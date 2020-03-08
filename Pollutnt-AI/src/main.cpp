#include <Arduino.h>
#include <ArduinoJson.h>
#include <Adafruit_CCS811.h>
#include <Adafruit_MPL3115A2.h>
#include <DHT.h>
#include <DHT_U.h>
#include <FirebaseESP32.h>
#include <FirebaseESP32HTTPClient.h>
#include <PubSubClient.h>
#include <SPI.h>
#include <WiFi.h>
#include <Wire.h>

#include <ESPmDNS.h>
#include <WiFiUdp.h>

#include "DarkSkyWeatherUtil.h"

#define SSID "Green Lantern Far"
#define PASSWORD "lifamily5676007"

#define FIREBASE_HOST "hacktech2020-88888.firebaseio.com"
#define FIREBASE_AUTH "M5BN2JFJwWPFJ5VaXfVea7KIVQQInocorRFEwVae"

// CSS811
#define CSS811_ADDR 0x5B
Adafruit_CCS811 ccs;
int CO2 = 0;
int TVOC = 0;

// MPL3115A2
Adafruit_MPL3115A2 baro = Adafruit_MPL3115A2();
float MLP3115A2_pressure = 0;
float MLP3115A2_altitude = 0;
float MLP3115A2_temp = 0;

// DHT11
#define DHT_PIN 19
#define DHT_TYPE DHT11
DHT dht(DHT_PIN, DHT_TYPE);
float DHT11_humidity = 0;
float DHT11_temp = 0;

float ave_temp = 0;

// Led Indicators
#define MQTT_CONNECTED_LED 5
#define WIFI_NOT_CONNECTED_LED 4
#define STARTED_LED 0
#define CCS811_LED 18
#define MLP3115A2_LED 17
#define DHT11_LED 16

// Dark Sky Weather Data - current
float precipIntensity = 0;
uint8_t precipType = 0;
uint8_t precipProbability = 0;
float windSpeed = 0;
float windGust = 0;
uint16_t windBearing = 0;

float precipIntensity_daily = 0;
uint8_t precipType_daily = 0;
uint8_t precipProbability_daily = 0;
float temp_daily = 0;
float humidity_daily = 0;
float pressure_daily = 0;
float windSpeed_daily = 0;
float windGust_daily = 0;
uint16_t windBearing_daily = 0;

static int fetchWeather = 0;
static int fetchWeatherDaily = 0;

FirebaseData firebasedataccs;

/* Solace PubSub+ */
uint64_t chipId = ESP.getEfuseMac();

const char* mqttServer = "mrzpfs1b9tj1n.messaging.solace.cloud";
const int mqttPort = 20550;
const char* mqttUser = "solace-cloud-client";
const char* mqttPassword = "p2i7li6ckbaimoe0draq0qdl82";

WiFiClient espClient;
PubSubClient client(espClient);

long lastMqttReconnectAttempt = 0;
unsigned long loopCounter = 0;
/* Solace PubSub+ End */

// MQTT Callback
void callback(char* topic, byte* payload, unsigned int length) {

  // Make a copy of the payload
  byte message[length + 10];
  memcpy(message, payload, length);
  message[length] = '\0';

  // Make a copy of the topic
  char t[sizeof(topic) * 4];
  strncpy(t, topic, sizeof(topic) * 4);

  // Get topic name as string
  String topicString(t);

  if (topicString.startsWith("test"))
  {
    Serial.println("[INFO] Recycling Motor Recieved Message");
  }
  if (topicString.startsWith("test2"))
  {
    Serial.println("[INFO] Trash Motor Recieved Message");
  }
}

void ConnectToWifi()
{
  delay(100);
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.print(SSID);
  /* Explicitly set the ESP8266 to be a WiFi-client, otherwise, it by default,
  would try to act as both a client and an access-point and could cause
  network-issues with your other WiFi-devices on your WiFi-network. */
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  Serial.println("Begin connecting to wifi");
  //start connecting to WiFi
  WiFi.begin(SSID, PASSWORD);
  //while client is not connected to WiFi keep loading
  while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
  }
  Serial.println("");
  Serial.print("WiFi connected to ");
  Serial.println(SSID);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.println("");
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  Wire.begin();
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);

  // LED indicators
  pinMode(MQTT_CONNECTED_LED, OUTPUT);
  pinMode(WIFI_NOT_CONNECTED_LED, OUTPUT);
  pinMode(STARTED_LED, OUTPUT);
  pinMode(CCS811_LED, OUTPUT);
  pinMode(MLP3115A2_LED, OUTPUT);
  pinMode(DHT11_LED, OUTPUT);

  // ESP8266
  ConnectToWifi();

  // MQTT Setup
  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback);

  // CCS811
  if(ccs.begin(CSS811_ADDR))
  {
    Serial.print("[INFO] CCS811 sensor found. I2C address: 0x" ); Serial.println(CSS811_ADDR, HEX);
  }

  if(!ccs.begin(CSS811_ADDR)){
    Serial.println("Failed to start CCS811 sensor! Please check your wiring.");
    while(1);
  }

  // MLP3115A2 
  baro.begin();
  if (baro.begin())
  {
    Serial.println("[INFO] MLP3115A2 sensor found");
  }

  // DHT11
  dht.begin();

  //getCurrentWeather(precipIntensity, precipType, precipProbability, windSpeed, windGust, windBearing);
}

boolean mqttReconnect() {
  Serial.println("Connecting to MQTT...");
  char mqttClientId[40];
  sprintf(mqttClientId, "ESP32Client%llu", chipId);

  if (client.connect(mqttClientId, mqttUser, mqttPassword, NULL, NULL, NULL, NULL, false)) {
    Serial.println("connected");
    digitalWrite(MQTT_CONNECTED_LED, HIGH);
    // Subscribe to global drive commands
    // Subscription

    client.subscribe("test");
  } else {
    Serial.println("[ERROR] Not Connected");
  }
  return client.connected();
}

bool readCCS811(int &CO2, int &TVOC)
{
  if (ccs.available())
  {
    ccs.readData();
    CO2 = ccs.geteCO2();
    TVOC = ccs.getTVOC();
    Serial.print("[INFO] CO2: ");
    Serial.print(CO2); Serial.print(" ppm");
    Serial.println();
    Serial.print("[INFO] TVOC: ");
    Serial.print(TVOC); Serial.print(" ppm");
    Serial.println();

    digitalWrite(CCS811_LED, HIGH);
    delay(500);
    digitalWrite(CCS811_LED, LOW);  
    delay(500);

    return true;
  }
  else if (ccs.checkError())
  {
    Serial.print("[ERROR] Cannot print values");
    Serial.println();
    return false;
  }
  return true;
}

void pushCCS811Firebase(const int &CO2, const int &TVOC)
{
  // Push CO2 reading to Firebase
  bool CO2ValueID = Firebase.pushFloat(firebasedataccs, "Live/CCS811/CO2", CO2);
  if (!CO2ValueID) 
  {
      Serial.print("[ERROR] pushing /Live/CCS811/CO2 failed:");
      return;
  }
  Serial.print("[INFO] pushed: /Live/CCS811/CO2 \tkey: ");
  Serial.println(CO2ValueID);

  // Push TVOC reading to Firebase
  bool TVOCValueID = Firebase.pushFloat(firebasedataccs, "Live/CCS811/TVOC", TVOC);
  if (!TVOCValueID) 
  {
      Serial.print("[ERROR] pushing /Live/CCS811/TVOC failed:");
      return;
  }
  Serial.print("[INFO] pushed: /Live/CCS811/TVOC \tkey: ");
  Serial.println(TVOCValueID);
}

void readMLP3115A2(float &MLP3115A2_pressure, float &MLP3115A2_altitude, float &MLP3115A2_temp)
{
  if (baro.begin())
  {
    MLP3115A2_pressure = baro.getPressure(); // pressure in pascals
    Serial.print("[INFO] Barometric pressure: "); Serial.print(MLP3115A2_pressure/3377); Serial.println(" Inches Hg");

    //MLP3115A2_altitude = baro.getAltitude(); // altitude in meters
    Serial.print("[INFO] Altitude: "); Serial.print(70.0); Serial.println(" Meters");

    MLP3115A2_temp = baro.getTemperature(); // temperature in degrees celcius
  }

  digitalWrite(MLP3115A2_LED, HIGH);
  delay(500);
  digitalWrite(MLP3115A2_LED, LOW);  
  delay(500);
}

void readDHT11(float &DHT11_humidity, float &DHT11_temp)
{
  DHT11_humidity = dht.readHumidity();
  Serial.print("[INFO] Current Humidity = "); Serial.print(DHT11_humidity); Serial.println(" %");

  DHT11_temp = dht.readTemperature();

  digitalWrite(DHT11_LED, HIGH);
  delay(500);
  digitalWrite(DHT11_LED, LOW);  
  delay(500);
}

void printAverageTemp(float DHT11_temp, float MLP3115A2_temp, float &ave_temp)
{
  ave_temp = (DHT11_temp + MLP3115A2_temp) / 2.0;
  Serial.print("[INFO] Current Temperature = "); Serial.print((DHT11_temp + MLP3115A2_temp) / 2.0); Serial.println(" °C");
}

void loop() {
  digitalWrite(STARTED_LED, HIGH);

  if (!client.connected()) {
    digitalWrite(MQTT_CONNECTED_LED, LOW);
  }

  if ((loopCounter % 2 == 0) && !client.connected()) {
    long now = millis();
    if (now - lastMqttReconnectAttempt > 5000) {
      lastMqttReconnectAttempt = now;
      // Attempt to reconnect
      if (mqttReconnect()) {
        lastMqttReconnectAttempt = 0;
      }
    }
  } else {
    // Client connected
    client.loop();
  }


  if (loopCounter >= 1000) {
    loopCounter = 0;
  }

  // CCS811
  if (readCCS811(CO2, TVOC))
  {
    //pushCCS811Firebase(CO2, TVOC);
  }

  // MLP3115A2
  readMLP3115A2(MLP3115A2_pressure, MLP3115A2_altitude, MLP3115A2_temp);

  // DHT11
  readDHT11(DHT11_humidity, DHT11_temp);

  printAverageTemp(DHT11_temp, MLP3115A2_temp, ave_temp);

  if (fetchWeather % 50 == 3)
  {
    getCurrentWeather(precipIntensity, precipType, precipProbability, windSpeed, windGust, windBearing);
  }

  if (fetchWeatherDaily % 50 == 3)
  {
    for (int i = 0; i < 3; i++) // get three day forecast
    {
      getForecastDay(i, precipIntensity_daily, precipType_daily, precipProbability_daily, temp_daily, humidity_daily, pressure_daily, windSpeed_daily, windGust_daily, windBearing_daily);
      char dailyForecast[256];
      sprintf(dailyForecast, "%d, %f, %d, %d, %f, %f, %f, %f, %f, %u", i, precipIntensity_daily, precipType_daily, precipProbability_daily, temp_daily, humidity_daily, pressure_daily, windSpeed_daily, windGust_daily, windBearing_daily);
      if (client.connected())
      {
        client.publish("forecast", dailyForecast);
        Serial.println("[INFO] Data just pushed to Solce PubSub+ under topic 'forecast'");
      }
    }
  }

  char result[1024];
  sprintf(result, "%d, %d, %f, %f, %f, %f, %f, %d, %d, %f, %f, %d", CO2, TVOC, (MLP3115A2_pressure / 3377.0), 70.0, ave_temp, DHT11_humidity, precipIntensity, precipType, precipProbability, windSpeed, windGust, windBearing);
  if (client.connected())
  {
    client.publish("data", result);
    Serial.println("[INFO] Data just pushed to Solce PubSub+ under topic 'data'");
  }

  loopCounter++;
  fetchWeather++;
  fetchWeatherDaily++;

  delay(100);
}