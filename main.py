from train_models import *
from firebase import *
from solace import *
import time

client = initialize()
firebase = init_firebase()
print("Connected to Firebase")
db = firebase.database()

while True:
    while client.message_received != True:
        time.sleep(0.01)
    print(client.message_contents)
    client.message_received = False;
