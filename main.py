from train_models import *
from firebase import *
from solace import *
import time
import datetime as dt
import threading

def parse_data(str):
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


client = initialize()
firebase = init_firebase()
print("Connected to Firebase")
db = firebase.database()
data_count = 0
while True:
    if data_count >= 10:
        train_and_predict("CO2", False)
    while client.message_received != True:
        time.sleep(0.01)
    # print(client.message_contents)
    client.message_received = False;
    data = parse_data(client.message_contents)
    curr_time = int(time.time())
    # print(curr_time)
    # print(data)
    upload_data = {"Time":curr_time,"CO2":data.get("CO2"),"TVOC":data.get("TVOC"),"Pressure":data.get("Pressure"),"Altitude":data.get("Altitude"),"Temperature":data.get("Temperature"),"Humidity":data.get("Humidity")}
    print(upload_data)
    db.child("Data").child(str(curr_time)).set(upload_data)
    data_count = data_count + 1