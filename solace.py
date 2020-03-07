import certifi
import paho.mqtt.client as mqtt

def initialize():
    client = mqtt.Client(transport='websockets')

    mqtt.Client.message_contents = ""
    mqtt.Client.message_received = False

    client.on_connect = on_connect
    client.on_message = on_message

    client.tls_set(ca_certs=certifi.where())

    # Enter your password here
    client.username_pw_set('solace-cloud-client', 'p2i7li6ckbaimoe0draq0qdl82') #HI PHILIP LOOK HERE thank u patty

    # Use the host and port from Solace Cloud without the protocol
    # ex. "ssl://yoururl.messaging.solace.cloud:8883" becomes "yoururl.messaging.solace.cloud"
    # wss://mrzpfs1b9tj1n.messaging.solace.cloud:20553 
    my_url = "mrzpfs1b9tj1n.messaging.solace.cloud"
    client.connect(my_url, port=20553)
    client.loop_start()
    return client

# Callback on connection
def on_connect(client, userdata, flags, rc):
    print(f'Connected (Result: {rc})')
    client.subscribe('data1')
    client.publish('test_connect', payload='Connected')

# Callback when message is received
def on_message(client, userdata, msg):
    print(f'Message received on topic: {msg.topic}. Message: {msg.payload.decode()}')
    message_str = msg.topic + ": " + msg.payload.decode()
    client.message_received = True
    client.message_contents = message_str
