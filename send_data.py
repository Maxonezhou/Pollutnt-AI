from firebase import *
import time
firebase = init_firebase()
print("Connected to Firebase")
db = firebase.database()

i = 0
while True:
    curr_time = time.time()
    curr_time = int(curr_time)
    upload_data = {"Time":curr_time,"CO2":i,"TVOC":i,"Pressure":i,"Altitude":i,"Temperature":i,"Humidity":i}
    print(upload_data)
    db.child("Data").child(str(curr_time)).set(upload_data)
    time.sleep(2)
    i = i%69
    i = i + 1