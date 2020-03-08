from azure.cognitiveservices.anomalydetector import AnomalyDetectorClient
from azure.cognitiveservices.anomalydetector.models import Request, Point, Granularity, \
    APIErrorException
from msrest.authentication import CognitiveServicesCredentials
import pandas as pd
import os
import globals

def detect_anomaly():
    SUBSCRIPTION_KEY = globals.key
    print(SUBSCRIPTION_KEY)
    ANOMALY_DETECTOR_ENDPOINT = globals.endpoint
    print(ANOMALY_DETECTOR_ENDPOINT)

    TIME_SERIES_DATA_PATH = "dataset.csv"
    client = AnomalyDetectorClient(ANOMALY_DETECTOR_ENDPOINT, CognitiveServicesCredentials(SUBSCRIPTION_KEY))
    series = []
    data_file = pd.read_csv(TIME_SERIES_DATA_PATH, header=None, encoding='utf-8', parse_dates=[0])
    data_file.drop(data_file.index[1])
    print(data_file)
    for index, row in data_file.iterrows():
        series.append(Point(timestamp=row[0], value=row[1]))
    request = Request(series=series, granularity=Granularity.daily)
    print('Detecting the anomaly status of the latest data point.')

    try:
        response = client.last_detect(request)
    except Exception as e:
        if isinstance(e, APIErrorException):
            print("***************\nThe latest point is detected as anomaly.\n*************")
            # print('Error code: {}'.format(e.error.code),
            #     'Error message: {}'.format(e.error.message))
        else:
            # print(e)
            print("***************\nThe latest point is detected as anomaly.\n*************")
            

    # if response.is_anomaly:
    #     print('The latest point is detected as anomaly.')
    # else:
    #     print('The latest point is not detected as anomaly.')