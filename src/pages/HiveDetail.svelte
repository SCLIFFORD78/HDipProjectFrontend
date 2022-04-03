<script>
  import { mainBar, navBar, subTitle, title } from "../stores";
  import HiveInfo from "../components/HiveInfo.svelte";
  import PhotoWidget from "../components/PhotoWidget.svelte";
  import { getContext, onMount } from "svelte";
  import "@carbon/charts/styles.min.css";
  import "carbon-components/css/carbon-components.min.css";
  import { LineChart } from "@carbon/charts-svelte";
  import { ComboChart } from "@carbon/charts-svelte";
  import { user } from "../stores";
import { push } from "svelte-spa-router";
  

  const hiveTracker = getContext("HiveTracker");

  let weather = [];
  let weatherHistory = [];
  let errorMessage = "";
  let loggedInUser;

  title.set("Hive Tracker App");
  subTitle.set("Hive Details");
  navBar.set({
    bar: mainBar,
  });


  var newCombinedDataTemperature = [];
  var newCombinedDataHumidity = [];


  const hive = hiveTracker.selectedHive[0];


  onMount(async () => {
    try {
      loggedInUser = await hiveTracker.getUserByEmail($user.email);
      weather = await hiveTracker.getWeather(
        hive.location.lat,
        hive.location.lng
      );
      weatherHistory = await hiveTracker.readWeatherHistory(
        hive.fbid
      );
      newCombinedDataTemperature = weatherHistory["combinedPointsTemperature"]
      newCombinedDataHumidity = weatherHistory["combinedPointsHumidity"]

    } catch (error) {
      errorMessage = "Weather Details unavailable";
      console.log(error);
    }

  });
</script>

<div class="uk-container uk-container-xlarge uk-margin">
  <div>
    <div
      class="uk-card uk-card-default uk-card-hover uk-card-body uk-margin uk-column-1-4"
    >
      <h3 class="uk-card-title">Hive Number: {hive.tag}</h3>
      <p>FeelsLike: {weather.feelsLike} Celcus</p>
      <p>Cloud Cover: {weather.clouds}</p>
      <p>Wind Speed: {weather.windSpeed} Kph</p>
      <p>Wind Direction: {weather.windDirection} Deg.</p>
      <p>Visibility: {weather.visibility} km</p>
      <p>Humidity: {weather.humidity}%</p>
    </div>
  </div>
  <div class="uk-column-1-2 " uk-grid>
    <div class="uk-width-expand@m ">
      <HiveInfo />
    </div>
    <div class="uk-card uk-card-default uk-card-body uk-width-1-2@m">
      <PhotoWidget />
    </div>
  </div>


  <div class="uk-card uk-card-default uk-card-hover uk-card-body uk-margin">
    <ComboChart
      data={newCombinedDataTemperature}
      options={{
        title: "Values of Hive Temperature (If recorded) and ambient Temperature",
        points: {
          enabled: false,
          radius: 0
        },
        axes: {
          left: {
            title: "Temperature",
            mapsTo: "value",
          },
          bottom: {
            scaleType: "time",
            mapsTo: "date",
          },
          right: {
            title: "Temperature (°C)",
            mapsTo: "value",
            correspondingDatasets: ["Ambient Temp"],
          },
        },
        comboChartTypes: [
          {
            type: "area",
            options: {},
            correspondingDatasets: ["Ambient Temp"],
          },
          {
            type: "line",
            options: {
              points: {
                enabled: true,
              },
            },
            correspondingDatasets: ["Hive Temp"],
          },
        ],
        curve: "curveNatural",
        zoomBar: {
          top: {
            enabled: true,
          },
        },
        timeScale: {
          addSpaceOnEdges: 0,
        },
        height: "400px",
      }}
    />
  </div>

  <div class="uk-card uk-card-default uk-card-hover uk-card-body uk-margin">
    <ComboChart
      data={newCombinedDataHumidity}
      options={{
        title: "Values of Hive Humidity (If recorded) and ambient Humidity",
        points: {
          enabled: false,
          radius: 0
        },
        axes: {
          left: {
            title: "Humidity",
            mapsTo: "value",
          },
          bottom: {
            scaleType: "time",
            mapsTo: "date",
          },
          right: {
            title: "Humidity (%)",
            mapsTo: "value",
            correspondingDatasets: ["Hive Humidity"],
          },
        },
        comboChartTypes: [
          {
            type: "area",
            options: {},
            correspondingDatasets: ["Hive Humidity"],
          },
          {
            type: "line",
            options: {
              points: {
                enabled: true,
              },
            },
            correspondingDatasets: ["Ambient Humidity"],
          },
        ],
        curve: "curveNatural",
        zoomBar: {
          top: {
            enabled: true,
            updateRangeAxis: true
          },
        },
        timeScale: {
          addSpaceOnEdges: 0,
        },
        height: "400px",
      }}
    />
  </div>
</div>
