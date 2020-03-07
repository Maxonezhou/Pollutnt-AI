import tensorflow as tf
import os
import datetime
from firebase import *
import csv

import numpy as np
import matplotlib.pyplot as plt


def plot_series(time, series, format="-", start=0, end=None):
    plt.plot(time[start:end], series[start:end], format)
    plt.xlabel("Time")
    plt.ylabel("Value")
    plt.grid(True)
    plt.show()

def train_and_predict(data_type, retrain_model):
    print(data_type)
    time_step = []
    vals = []
    retrain_model = True

    with open('data.csv') as csvfile:
        reader = csv.reader(csvfile, delimiter=',')
        next(reader)
        step=0
        for row in reader:
            if len(row[2]) == 0:
                break
            vals.append(float(row[2]))
            time_step.append(step)
            step = step + 1

        series = np.array(vals)
        time = np.array(time_step)
        plt.figure(figsize=(10, 6))
        plot_series(time, series)

        split_time = 1000
        time_train = time[:split_time]
        x_train = series[:split_time]
        time_valid = time[split_time:]
        x_valid = series[split_time:]

        window_size = 30
        batch_size = 32
        shuffle_buffer_size = 1000

        def windowed_dataset(series, window_size, batch_size, shuffle_buffer):
            series = tf.expand_dims(series, axis=-1)
            ds = tf.data.Dataset.from_tensor_slices(series)
            ds = ds.window(window_size + 1, shift=1, drop_remainder=True)
            ds = ds.flat_map(lambda w: w.batch(window_size + 1))
            ds = ds.shuffle(shuffle_buffer)
            ds = ds.map(lambda w: (w[:-1], w[1:]))
            return ds.batch(batch_size).prefetch(1)

        def model_forecast(model, series, window_size):
            ds = tf.data.Dataset.from_tensor_slices(series)
            ds = ds.window(window_size, shift=1, drop_remainder=True)
            ds = ds.flat_map(lambda w: w.batch(window_size))
            ds = ds.batch(32).prefetch(1)
            forecast = model.predict(ds)
            return forecast

        tf.keras.backend.clear_session()
        tf.random.set_seed(51)
        np.random.seed(51)
        train_set = windowed_dataset(x_train, window_size=60, batch_size=100, shuffle_buffer=shuffle_buffer_size)
        print(train_set)
        print(x_train.shape)
        model = tf.keras.models.Sequential([
        tf.keras.layers.Conv1D(filters=60, kernel_size=5,
                            strides=1, padding="causal",
                            activation="relu",
                            input_shape=[None, 1]),
        tf.keras.layers.LSTM(60, return_sequences=True),
        tf.keras.layers.LSTM(60, return_sequences=True),
        tf.keras.layers.Dense(30, activation="relu"),
        tf.keras.layers.Dense(10, activation="relu"),
        tf.keras.layers.Dense(1),
        tf.keras.layers.Lambda(lambda x: x * 400)
        ])


        optimizer = tf.keras.optimizers.SGD(lr=1e-5, momentum=0.9)
        model.compile(loss=tf.keras.losses.Huber(),
                    optimizer=optimizer,
                    metrics=["mae"])

        log_dir = "logs/" + datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
        tensorboard_callback = tf.keras.callbacks.TensorBoard(log_dir, histogram_freq=1)
        if retrain_model:
            history = model.fit(train_set,epochs=50,callbacks=[tensorboard_callback])
            model.save(data_type + "_model.h5")
            print("Saved model")
        else:
            path = os.path.join(os.getcwd(), 'LSTM_model.h5')
            model = tf.keras.models.load_model(path)
            print("Loaded model")

        rnn_forecast = model_forecast(model, series[..., np.newaxis], window_size)
        rnn_forecast = rnn_forecast[split_time - window_size:-1, -1, 0]
        start=0
        end=None
        format="-"
        plt.figure(figsize=(10, 6))
        plt.title("Predicted Air Quality Index in Calgary vs. AQI For The 966 Days Following 8/26/2018")
        plt.plot(time_valid[start:end], x_valid[start:end], format)
        plt.xlabel("Time")
        plt.ylabel("Value")
        plt.grid(True)
        plt.plot(time_valid[start:end], rnn_forecast[start:end], format)
        plt.xlabel("Time")
        plt.ylabel("Value")
        plt.grid(True)
        plt.show()

        tf.keras.metrics.mean_absolute_error(x_valid, rnn_forecast).numpy()

        print(rnn_forecast)