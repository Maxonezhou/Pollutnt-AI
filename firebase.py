import pyrebase

def init_firebase():
    config = {
        "apiKey": "AIzaSyCxkOPS5DqnXak4ecDbuPrNKJ-fK4Xc868",
        "authDomain": "hacktech2020-88888.firebaseapp.com",
        "databaseURL": "https://hacktech2020-88888.firebaseio.com/",
        "storageBucket": "hacktech2020-88888.appspot.com"
    }

    firebase = pyrebase.initialize_app(config)
    return firebase

# firebase = init_firebase()
# print("Connected to Firebase")
# db = firebase.database()

# all_CO2 = db.child("Live").child("CCS811").child("CO2").get()
# all_TVOC = db.child("Live").child("CCS811").child("TVOC").get()

# co2_list = []
# tvoc_list = []
# for co2 in all_CO2.each():
#     co2_list.append(co2.val())
# for tvoc in all_TVOC.each():
#     tvoc_list.append(tvoc.val())

# print("CO2 Values:")
# for co2 in co2_list:
#     print(co2)
# print("\n\nTVOC Values:")
# for tvoc in tvoc_list:
#     print(tvoc)