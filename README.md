#Inspiration
The combined effects of air pollution cause approximately 7 million premature deaths worldwide each year and lead to severe emissions of greenhouse gases. According to the World Health Organization (WHO), more than 80% of people living in urban areas are exposed to air quality levels which exceed the WHO limit. There is a pressing need to not only effectively monitor air quality but also provide crucial data for future predictions of air quality and AI-based anomaly detection to reduce the impacts of pollutants worldwide.

Pollutn't-AI is a novel approach to urban air quality monitoring by using an array of IoT enabled beacons deployed across a widespread area to enable the ability to gather real-time data on environmental variables and detect sudden changes in air quality. Pollutn't-AI leverages the power of AI and IoT to revolutionize the way urban air quality is monitored, paving the way to a smarter, and greener future.
What it does

Pollutn't-AI monitors air quality in a widespread urban area using an array of IoT enabled beacons capable of detecting eCO2, TVOC, temperature, humidity, pressure, altitude, precipitation, and wind. This data is then sent to our microservice backend where is it processed and stored in the Google Cloud Real-Time Firebase Database. The data can then be queried by the front-end to display.

Pollutn't-AI as three core features first is the lightweight and effective method of gathering current data using an array of IoT devices as well as future data using the DarkSkyWeather API. The second is the microservice backend which leverages AI and machine learning to perform anomaly detection using Microsoft Azure's Anomaly Detector API using Time-Series Forecasting Regression Models. And lastly is the front-end web interface that allows users to view the data present at each beacon, view a graph of historical and current data which updates in real-time, future weather patterns and its effects on pollution, alerts coming from the backend when an anomaly is detected, and an interactive heat map which can be toggled to see hotspots where pollution is present.

#How we built it

Pollutn't-AI is composed of four core parts, an array of IoT enabled sensors, a microservice architecture backend, a ReactJS front-end UI, and a Google Cloud Firebase Database. Together, these four parts form the complete end-to-end solution for smart city air quality monitoring.

##IoT Beacons
The core of Pollutn't-AI is an array of IoT beacons that are to be deployed throughout an urban area. Each beacon houses several crucial and lightweight sensors that gather information from the environment and transmits it over a publish/subscriber message brokering service running on MQTT protocol. For this part, we chose to use Solace's PubSub+ cloud message brokering service. By doing so, our array of IoT beacons were able to asynchronously transfer data to the backend without having to rely on the synchronous behavior of traditional REST protocols.

Each beacon contains a CCS811 Air Quality sensor which is capable of detecting equivalent CO2 and Total Volatile Organic Compounds in part per million (ppm), a MLP3115A2 air pressure, altitude, and temperature sensor and as well as DHT11 temperature and humidity sensor. The microcontroller used for this project was the NodeMCU ESP32 which is an IoT enabled development board running on the Arduino framework. Additional environment variables such as precipitation (probability, type, and intensity), wind (speed, gusts, bearing) were fetched in real-time from the DarkSkyWeather API.

Our plan for these beacons is for them to be placed on streetlights across the city where they are out of the reach of civilians but still close enough to the ground to detect crucial air quality data. Power to the beacons will be supplied using a solar panel and the IoT connection will be implemented using a mesh network across all of the beacons resulting in a strong and reliable signal.

##Microservice Backend
The microservice backend for Pollutn't-AI was built using Python. It receives real-time data from the IoT sensors via Solace PubSub+ and performs a series of operations. First, the data from each sensor is parsed into a JSON-like format and uploaded to Firebase for the front-end to display. Next, the data is periodically fed into an LSTM model which predicts future values for each of the metrics; these entries are also uploaded to Firebase for the front-end to display. Finally, we use the Microsoft Azure Anomaly Detector API to constantly monitor our stream of data and detect anomalies such as sudden spikes in CO2 or Volatile Organic Compounds.

##ReactJS Frontend UI
The frontend was built using ReactJS. Using Google Cloud Firebase Real-Time database, the frontend fetches live data from the IoT beacons and display the information in the form of a heatmap, using Google Maps React, graphs and charts. The data shows both the live current data and our predicted data from our machine learning models. This allows the user to utilize the data to make educated decisions based on environmental data. View our frontend here: https://maxonezhou.github.io/hacktech2020-website-deploy/ (Disclaimer: for the frontend UI, we currently only have one beacon displaying real data due to the fact that we were only able to get enough hardware to make one beacon for the hackathon, therefore, only the center beacon will show data when it is expanded, other beacons will show no data. In the future, when more hardware is available, other beacons will also display data similar to the first one.)

##Firebase
The backend for this project was implemented using a Google Cloud Firebase Real-Time database. From our backend end, after the data is received from the IoT beacons and is processed, the data is stored in the real-time database where it can then be fetched from our front-end UI. The purpose of using the database rather than utilizing a publish/subscriber protocol such as on the beacons is the allow for historical data to be retrieved and queried on the front-end. Additionally, utilizing synchronous data transfer protocols such as REST from the database to the frontend using HTPP is more efficient than an MQTT implementation as the connection will be kept alive continuously which data is fetched.

#Challenges we ran into

By far the hardest part of this project was being able to integrate all four core sections of the project together. Learning to set up an MQTT connection and using Solace PubSub+ to communicate with the IoT devices, pushing and pulling from Firebase for the backend and frontend, and setting up Microsoft Azure's Anomaly Detection for the backend. Additionally, it was our first time using this NodeMCU ESP32 development board so it was a learning curve to get all of the libraries and sensors working, one crucial issue we ran into was when the MQTT client on the board was not working due to an inability to get the chip ID, we were able to work around this by creating our own function to get the chip ID by getting the mac address manually.

#Accomplishments that we're proud of

Learning to communicate with all many different components and choosing the right communication protocol for the situation led us to create an extremely lightweight and efficient system that can gather real-time data from the environment and process it in novel ways for the interactive front-end to display. We hope to perform field testing on our beacons in the near future and see how they perform in real-life situations.

#What we learned
    NodeMCU ESP32 Dev Board
    Solace PubSub+ Cloud Message Brokering
    Microsoft Azure Anomaly Detection
    DarkSkyWeather API
    Google Cloud Firebase
    Google Maps API
    Google HeatMap API

#What's next for Pollutn't-AI

-Implementing a formula to aggregate all of the data we receive to predict the detrimental health effects of air pollution on health. We plan to do this by using a generalized additive model using a Poisson distribution.
-Performing field testing on our system to see how they respond to real-world environments
-Using geofencing to give alerts to nearby individuals and restrict access to highly polluted areas
