from firebase import *
from random import randint
import time
firebase = init_firebase()
print(“Connected to Firebase”)
db = firebase.database()
i = 0

while True:
    data3_co2 = randint(420, 440)
    data3_tvoc = randint(8,10)
    data3_altitude = 80.0
    data3_temp = randint(20, 25)
    data3_humidity = randint(30, 40)

    data4_co2 = randint(390, 400)
    data4_tvoc = randint(5,8)
    data4_altitude = 75.0
    data4_temp = randint(18, 22)
    data4_humidity = randint(10, 20)

    data5_co2 = randint(380, 390)
    data5_tvoc = randint(5,8)
    data5_altitude = 70.0
    data5_temp = randint(22, 26)
    data5_humidity = randint(20, 40)

    data6_co2 = randint(500, 520)
    data6_tvoc = randint(20,25)
    data6_altitude = 55.0
    data6_temp = randint(26, 30)
    data6_humidity = randint(20, 25)

    data7_co2 = randint(400, 510)
    data7_tvoc = randint(22,27)
    data7_altitude = 57.0
    data7_temp = randint(28, 33)
    data7_humidity = randint(20, 25)

    data8_co2 = randint(450, 480)
    data8_tvoc = randint(20,25)
    data8_altitude = 60.0
    data8_temp = randint(26, 30)
    data8_humidity = randint(20, 25)

    curr_time = time.time()
    curr_time = int(curr_time)
    upload_data = {“Time”:curr_time,“CO2”:i,“TVOC”:i,“Pressure”:i,“Altitude”:i,“Temperature”:i,“Humidity”:i}
    print(upload_data)
    db.child(“Data2”).child(str(curr_time)).set(upload_data)
    i = i%69
    i = i + 1

    # Data3
    curr_time = time.time()
    curr_time = int(curr_time)
    upload_data = {“Time”:curr_time,“CO2”:data3_co2,“TVOC”:data3_tvoc,“Pressure”:data3_altitude,“Altitude”:data3_altitude,“Temperature”:data3_temp,“Humidity”:data3_humidity}
    print(upload_data)
    db.child(“Data3”).child(str(curr_time)).set(upload_data)

    # Data4
    curr_time = time.time()
    curr_time = int(curr_time)
    upload_data = {“Time”:curr_time,“CO2”:data4_co2,“TVOC”:data4_tvoc,“Pressure”:data4_altitude,“Altitude”:data4_altitude,“Temperature”:data4_temp,“Humidity”:data4_humidity}
    print(upload_data)
    db.child(“Data4”).child(str(curr_time)).set(upload_data)

    # Data5
    curr_time = time.time()
    curr_time = int(curr_time)
    upload_data = {“Time”:curr_time,“CO2”:data5_co2,“TVOC”:data5_tvoc,“Pressure”:data5_altitude,“Altitude”:data5_altitude,“Temperature”:data5_temp,“Humidity”:data5_humidity}
    print(upload_data)
    db.child(“Data5”).child(str(curr_time)).set(upload_data)

    # Data6
    curr_time = time.time()
    curr_time = int(curr_time)
    upload_data = {“Time”:curr_time,“CO2”:data6_co2,“TVOC”:data6_tvoc,“Pressure”:data6_altitude,“Altitude”:data6_altitude,“Temperature”:data6_temp,“Humidity”:data6_humidity}
    print(upload_data)
    db.child(“Data6”).child(str(curr_time)).set(upload_data)

    # Data7
    curr_time = time.time()
    curr_time = int(curr_time)
    upload_data = {“Time”:curr_time,“CO2”:data7_co2,“TVOC”:data7_tvoc,“Pressure”:data7_altitude,“Altitude”:data7_altitude,“Temperature”:data7_temp,“Humidity”:data7_humidity}
    print(upload_data)
    db.child(“Data7”).child(str(curr_time)).set(upload_data)

    # Data8
    curr_time = time.time()
    curr_time = int(curr_time)
    upload_data = {“Time”:curr_time,“CO2”:data8_co2,“TVOC”:data8_tvoc,“Pressure”:data8_altitude,“Altitude”:data8_altitude,“Temperature”:data8_temp,“Humidity”:data8_humidity}
    print(upload_data)
    db.child(“Data8”).child(str(curr_time)).set(upload_data)

    sleep(2)