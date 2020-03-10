#include <time.h>
#include <JSON_Listener.h>
#include <JSON_Decoder.h>
#include <DarkSkyWeather.h>

#define TIME_OFFSET 0UL * 3600UL // UTC + 0 hour

String api_key = "";
String longitude = "-75.697189";
String latitude = "45.421532";
String units = "si";
String language = "en";

DS_Weather dsw; // Weather forecast library instance

/***************************************************************************************
**                          Convert unix time to a time string
***************************************************************************************/
String strTime(time_t unixTime)
{
  unixTime += TIME_OFFSET;
  return ctime(&unixTime);
}

/***************************************************************************************
**                          Get the icon file name from the index number
***************************************************************************************/
const char* getMeteoconIcon(uint8_t index)
{
  if (index > MAX_ICON_INDEX) index = 0;
  return dsw.iconName(index);
}

void getCurrentWeather(float& precipIntensity, uint8_t &precipType, uint8_t &precipProbability,
                       float& windSpeed, float& windGust, uint16_t &windBearing)
{
  // Create the structures that hold the retrieved weather
  DSW_current *current = new DSW_current;
  DSW_hourly *hourly = new DSW_hourly;
  DSW_daily  *daily = new DSW_daily;

  time_t time;

  Serial.print("\nRequesting current weather information from DarkSky.net... ");

  dsw.getForecast(current, hourly, daily, api_key, latitude, longitude, units, language);

  Serial.println("Current Weather Data from Dark Sky\n");

  Serial.println("############### Current weather ###############\n");
  Serial.print("[INFO] Current precipIntensity  : "); Serial.println(current->precipIntensity);
  precipIntensity = current->precipIntensity;

  Serial.print("[INFO] Current precipType       : "); Serial.println(getMeteoconIcon(current->precipType));
  precipType = current->precipType;

  Serial.print("[INFO] Current precipProbability: "); Serial.println(current->precipProbability);
  precipProbability = current->precipProbability;

  Serial.print("[INFO] Current wind speed       : "); Serial.println(current->windSpeed);
  windSpeed = current->windSpeed;

  Serial.print("[INFO] Current wind gust        : "); Serial.println(current->windGust);
  windGust = current->windGust;

  Serial.print("[INFO] Current wind dirn        : "); Serial.println(current->windBearing);
  windBearing = current->windBearing;
}

void getForecastDay(int day, float& precipIntensity, uint8_t &precipType, uint8_t &precipProbability,
                    float& temp, float& humidity, float& pressure, float& windSpeed, float& windGust, 
                    uint16_t &windBearing)
{
  // Create the structures that hold the retrieved weather
  DSW_current *current = new DSW_current;
  DSW_hourly *hourly = new DSW_hourly;
  DSW_daily  *daily = new DSW_daily;

  time_t time;
  int i = day;

  Serial.print("\nRequesting daily weather information from DarkSky.net... ");

  dsw.getForecast(current, hourly, daily, api_key, latitude, longitude, units, language);

  Serial.println("Daily Weather Data from Dark Sky\n");

  Serial.println("############### Daily weather ###############\n");

  Serial.print("Day: "); Serial.print(i); Serial.print(" "); Serial.print("precipIntensity   : "); Serial.println(daily->precipIntensity[i]);
  precipIntensity = daily->precipIntensity[i];

  Serial.print("Day: "); Serial.print(i); Serial.print(" "); Serial.print("precipType        : "); Serial.println(daily->precipType[i]);
  precipType = daily->precipType[i];

  Serial.print("Day: "); Serial.print(i); Serial.print(" "); Serial.print("precipProbability : "); Serial.println(daily->precipProbability[i]);
  precipProbability = daily->precipProbability[i];

  Serial.print("Day: "); Serial.print(i); Serial.print(" "); Serial.print("temperatureHigh   : "); Serial.println(daily->temperatureHigh[i]);
  Serial.print("Day: "); Serial.print(i); Serial.print(" "); Serial.print("temperatureLow    : "); Serial.println(daily->temperatureLow[i]);
  temp = ((daily->precipProbability[i]) + (daily->temperatureLow[i])) / 2.0;

  Serial.print("Day: "); Serial.print(i); Serial.print(" "); Serial.print("humidity          : "); Serial.println(daily->humidity[i]);
  humidity = daily->humidity[i];

  Serial.print("Day: "); Serial.print(i); Serial.print(" "); Serial.print("pressure          : "); Serial.println(daily->pressure[i]);
  pressure = (daily->pressure[i]) / 3377.0;

  Serial.print("Day: "); Serial.print(i); Serial.print(" "); Serial.print("windSpeed         : "); Serial.println(daily->windSpeed[i]);
  windSpeed = daily->windSpeed[i];

  Serial.print("Day: "); Serial.print(i); Serial.print(" "); Serial.print("windGust          : "); Serial.println(daily->windGust[i]);
  windGust = daily->windGust[i];

  Serial.print("Day: "); Serial.print(i); Serial.print(" ");Serial.print("windBearing        : "); Serial.println(daily->windBearing[i]);
  windBearing = daily->windBearing[i];
}

void printCurrentWeather()
{
  // Create the structures that hold the retrieved weather
  DSW_current *current = new DSW_current;
  DSW_minutely *minutely = new DSW_minutely;
  DSW_hourly *hourly = new DSW_hourly;
  DSW_daily  *daily = new DSW_daily;

  time_t time;

  Serial.print("\nRequesting weather information from DarkSky.net... ");

  dsw.getForecast(current, hourly, daily, api_key, latitude, longitude, units, language);

  Serial.println("Weather from Dark Sky\n");

  // We can use the timezone to set the offset eventually...
  // Serial.print("Timezone            : "); Serial.println(current->timezone);
  
  Serial.println("############### Current weather ###############\n");
  Serial.print("Current time             : "); Serial.print(strTime(current->time));
  Serial.print("Current summary          : "); Serial.println(current->summary);
  Serial.print("Current icon             : "); Serial.println(getMeteoconIcon(current->icon));
  Serial.print("Current precipInten      : "); Serial.println(current->precipIntensity);
  Serial.print("Current precipType       : "); Serial.println(getMeteoconIcon(current->precipType));
  Serial.print("Current precipProbability: "); Serial.println(current->precipProbability);
  Serial.print("Current temperature      : "); Serial.println(current->temperature);
  Serial.print("Current humidity         : "); Serial.println(current->humidity);
  Serial.print("Current pressure         : "); Serial.println(current->pressure);
  Serial.print("Current wind speed       : "); Serial.println(current->windSpeed);
  Serial.print("Current wind gust        : "); Serial.println(current->windGust);
  Serial.print("Current wind dirn        : "); Serial.println(current->windBearing);

  Serial.println();

  Serial.println("############### Minutely weather  ###############\n");
  Serial.print("Overall minutely summary : "); Serial.println(minutely->overallSummary);
  for (int i = 0; i<MAX_MINUTES; i++)
  {
    Serial.print("Minutely summary  "); if (i<10) Serial.print(" ");
    Serial.print("Time               : "); Serial.print(strTime(minutely->time[i]));
    Serial.print("precipIntensity    : "); Serial.println(minutely->precipIntensity[i]);
    Serial.print("precipProbability  : "); Serial.println(minutely->precipProbability[i]);
    Serial.println();
  }

  Serial.println("############### Hourly weather  ###############\n");
  Serial.print("Overall hourly summary : "); Serial.println(hourly->overallSummary);
  for (int i = 0; i<MAX_HOURS; i++)
  {
    Serial.print("Hourly summary  "); if (i<10) Serial.print(" ");
    Serial.print(i);  Serial.print(" : "); Serial.println(hourly->summary[i]);
    Serial.print("Time               : "); Serial.print(strTime(hourly->time[i]));
    Serial.print("precipIntensity    : "); Serial.println(hourly->precipIntensity[i]);
    Serial.print("precipProbability  : "); Serial.println(hourly->precipProbability[i]);
    Serial.print("precipType         : "); Serial.println(hourly->precipType[i]);
    Serial.print("precipAccumulation : "); Serial.println(hourly->precipAccumulation[i]);
    Serial.print("temperature        : "); Serial.println(hourly->temperature[i]);
    Serial.print("pressure           : "); Serial.println(hourly->pressure[i]);
    Serial.print("cloudCover         : "); Serial.println(hourly->cloudCover[i]);
    Serial.println();
  }

  Serial.println("###############  Daily weather  ###############\n");
  Serial.print("Daily summary     : "); Serial.println(daily->overallSummary);
  Serial.println();

  for (int i = 0; i<MAX_DAYS; i++)
  {
    Serial.print("Daily summary   ");
    Serial.print(i); Serial.print(" : "); Serial.println(daily->summary[i]);
    Serial.print("time              : "); Serial.print(strTime(daily->time[i]));
    Serial.print("Icon              : "); Serial.println(getMeteoconIcon(daily->icon[i]));
    Serial.print("sunriseTime       : "); Serial.print(strTime(daily->sunriseTime[i]));
    Serial.print("sunsetTime        : "); Serial.print(strTime(daily->sunsetTime[i]));
    Serial.print("Moon phase        : "); Serial.println(daily->moonPhase[i]);
    Serial.print("precipIntensity   : "); Serial.println(daily->precipIntensity[i]);
    Serial.print("precipProbability : "); Serial.println(daily->precipProbability[i]);
    Serial.print("precipType        : "); Serial.println(daily->precipType[i]);
    Serial.print("precipAccumulation: "); Serial.println(daily->precipAccumulation[i]);
    Serial.print("temperatureHigh   : "); Serial.println(daily->temperatureHigh[i]);
    Serial.print("temperatureLow    : "); Serial.println(daily->temperatureLow[i]);
    Serial.print("humidity          : "); Serial.println(daily->humidity[i]);
    Serial.print("pressure          : "); Serial.println(daily->pressure[i]);
    Serial.print("windSpeed         : "); Serial.println(daily->windSpeed[i]);
    Serial.print("windGust          : "); Serial.println(daily->windGust[i]);
    Serial.print("windBearing       : "); Serial.println(daily->windBearing[i]);
    Serial.print("cloudCover        : "); Serial.println(daily->cloudCover[i]);
    Serial.println();
  }

  // Delete to free up space and prevent fragmentation as strings change in length
  delete current;
  delete minutely;
  delete hourly;
  delete daily;
}