# from train_models import *
from firebase import *
from solace import *
import time
import datetime as dt
import threading
import csv
from train_models import *

def parse_data(str, type):
    if type == "data":
        split_str = str.split(',')
        if len(split_str) < 6:
            return 0
        data = {
            "CO2": int(split_str[0]),
            "TVOC": int(split_str[1]),
            "Pressure": float(split_str[2]),
            "Altitude": float(split_str[3]),
            "Temperature": float(split_str[4]),
            "Humidity": float(split_str[5])
        }
        return data
    else:
        split_str = str.split(',')
        if len(split_str) < 10:
            return 0
        
        data = {
        "i": int(split_str[0]),
        "precip_intensity": float(split_str[1]),
        "precip_type": int(split_str[2]),
        "precip_prob": int(split_str[3]),
        "temp": float(split_str[4]),
        "humidity": float(split_str[5]),
        "pressure": float(split_str[6]),
        "wind": float(split_str[7]),
        "gust": float(split_str[8]),
        "bearing": int(split_str[9])
        }
        return data

client = initialize()
firebase = init_firebase()
print("Connected to Firebase")
db = firebase.database()
data_count = 0
while True:
    if data_count >= 10:
        all_pred_data = db.child("Forecast").get()
        all_data = db.child("Data").get()
        all_forecast_data = db.child("Forecast").get()
        timestamps = []
        co2 = []
        tvoc = []
        pressure = []
        temperature = []
        humidity = []
        intensity = []
        ptype = []
        prob = []
        wind = []
        gust = []
        bearing = []
        last = 0
        for child in all_data.each():
            # print(child.val().get("CO2"))
            timestamps.append(child.val().get("Time"))
            co2.append(child.val().get("CO2"))
            tvoc.append(child.val().get("TVOC"))
            pressure.append(child.val().get("Pressure"))
            temperature.append(child.val().get("Temperature"))
            humidity.append(child.val().get("Humidity"))
        for fc in all_forecast_data.each():
            timestamps.append(fc.val().get("Time"))
            co2.append(0)
            tvoc.append(0)
            pressure.append(fc.val().get("Pressure") * 100)
            temperature.append(fc.val().get("Temperature"))
            humidity.append(fc.val().get("Humidity"))
            intensity.append(fc.val().get("precip_intensity"))
            prob.append(fc.val().get("precip_prob"))
            ptype.append(fc.val().get("precip_prob"))
            wind.append(fc.val().get("wind"))
            gust.append(fc.val().get("gust"))
            bearing.append(fc.val().get("bearing"))
            # print(fc.val())
        for i in range(len(timestamps)):
            if timestamps[i] <= last:
                db.child("Forecast").child(str(timestamps[i])).remove()
                timestamps.pop(i)
                co2.pop(i)
                tvoc.pop(i)
                pressure.pop(i)
                temperature.pop(i)
                humidity.pop(i)
                intensity.pop(i)
                prob.pop(i)
                ptype.pop(i)
                wind.pop(i)
                gust.pop(i)
                bearing.pop(i)
        for p in all_pred_data.each():
            if p.val().get("Time") <= timestamps[0]:
                db.child("Prediction").child(str(p.val().get("Time"))).remove()
        train = False
        pressure_preds = train_and_predict("Pressure",train)
        temperature_preds = train_and_predict("Temperature",train)
        humidity_preds = train_and_predict("Humidity",train)

        # print(len(pressure_preds))
        # print(len(temperature_preds))
        # print(len(humidity_preds))

        curr_time = int(time.time())
        for i in range(len(humidity_preds)):
            upload_pred = {"Time":curr_time,"Pressure":str(pressure_preds[i]),"Temperature":str(temperature_preds[i]),"Humidity":str(humidity_preds[i]),"CO2":0,"TVOC":0,"Altitude":70}
            # print(upload_pred)
            db.child("Prediction").child(str(curr_time)).set(upload_pred)
            curr_time = curr_time + 2
            

        with open('dataset.csv', 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(["Time","CO2","TVOC","Pressure","Temperature","Humidity"])
            for i in range(len(co2)):
                t = timestamps[i]
                # t = t + 60
                # t_str = time.strftime("%Y-%m-%dT%H:%M:%SZ",time.localtime(t))
                writer.writerow([t,co2[i],tvoc[i],pressure[i],temperature[i],humidity[i]])
        data_count = 0

    while client.message_received != True:
        time.sleep(0.01)
    # print(client.message_contents)
    # print(client.message_topic)
    client.message_received = False;
    data = parse_data(client.message_contents, client.message_topic)
    curr_time = int(time.time())
    # print(curr_time)
    # print(data)
    if client.message_topic == "data":
        upload_data = {"Time":curr_time,"CO2":data.get("CO2"),"TVOC":data.get("TVOC"),"Pressure":data.get("Pressure"),"Altitude":data.get("Altitude"),"Temperature":data.get("Temperature"),"Humidity":data.get("Humidity")}
        print(upload_data)
        print("\n")
        db.child("Data").child(str(curr_time)).set(upload_data)
    else:
        curr_time = curr_time + data.get("i") * 86400
        upload_data = {"Time":curr_time,"Pressure":data.get("pressure"),"Temperature":data.get("temp"),"Humidity":data.get("humidity"),"precip_intensity":data.get("precip_intensity"),"precip_type":data.get("precip_type"),"precip_prob":data.get("precip_prob"),"wind":data.get("wind"),"gust":data.get("gust"),"bearing":data.get("bearing")}
        print(upload_data)
        print("\n")
        db.child("Forecast").child(str(curr_time)).set(upload_data)
    data_count = data_count + 1