<script>
  import { mainBar, navBar, subTitle, title } from "../stores";
  import HiveInfo from "../components/HiveInfo.svelte";
  import PhotoWidget from "../components/PhotoWidget.svelte";
  import { getContext, onMount } from "svelte";
  import { LayerCake, Svg, Html } from "layercake";
  import Line from "../components/Line.svelte";
  import Area from "../components/Area.svelte";
  import AxisX from "../components/AxisX.svelte";
  import AxisY from "../components/AxisY.svelte";
  import Brush from "../components/Brush.svelte";
  import SyncedBrushWrapper from "../components/SyncedBrushWrapper.svelte";
  import Chart from "svelte-frappe-charts";
  import { scaleOrdinal } from "d3-scale";
  import MultiLine from "../components/MultiLine.svelte";
  import Labels from "../components/GroupLabels.html.svelte";
  import SharedTooltip from "../components/SharedTooltip.html.svelte";
  import "@carbon/charts/styles.min.css";
  import "carbon-components/css/carbon-components.min.css";
  import { LineChart } from "@carbon/charts-svelte";
  import { ComboChart } from "@carbon/charts-svelte";

  const hiveTracker = getContext("HiveTracker");

  let weather = [];
  let weatherHistory = [];
  let errorMessage = "";

  title.set("Hive Tracker App");
  subTitle.set("Hive Details");
  navBar.set({
    bar: mainBar,
  });

  let brushExtents = [null, null];
  let brushedData;

  const xKey = "x";
  const yKey = "y";
  const zKey = "z";

  var points = [];
  var humidityPoints = [];
  var combinedPoints = [];
  var historicalPoints = [];
  var historicalHumidityPoints = [];
  var newData = [];
  var newHumidityData = [];
  var historicalData = [];
  var historicalHumidityData = [];
  var newCombinedData = [];

  var datasets = [newData, historicalData];
  $: {
    brushedData = points.slice(
      (brushExtents[0] || 0) * points.length,
      (brushExtents[1] || 1) * points.length
    );
    console.log(points);
    if (brushedData.length < 2) {
      brushedData = points.slice(
        brushExtents[0] * points.length,
        brushExtents[0] * points.length + 2
      );
    }
  }

  const hive = hiveTracker.selectedHive[0];
  var values = JSON.parse("[" + hive["recordedData"] + "]");
  var temps = [];
  values.forEach((element) => {
    var theDate = new Date(element["timeStamp"] * 1000);
    var dateString =
      theDate.toLocaleDateString() +
      " " +
      theDate.getHours() +
      ":" +
      theDate.getMinutes() +
      ":" +
      theDate.getMinutes();
    //layer cake chart
    points.push({ x: element["timeStamp"], y: element["Temperature"] });
    humidityPoints.push({ x: element["timeStamp"], y: element["Humidity"] });
    combinedPoints.push({
      group: "Hive Temp",
      date: theDate.toISOString(),
      value: element["Temperature"],
    });
    combinedPoints.push({
      group: "Hive Humidity",
      date: theDate.toISOString(),
      value: element["Humidity"],
    });
  });

  onMount(async () => {
    try {
      weather = await hiveTracker.getWeather(
        hive.location.lat,
        hive.location.lng
      );
      weatherHistory = await hiveTracker.readWeatherHistory(
        hive.location.lat,
        hive.location.lng
      );
      if (weatherHistory.length > 0) {
        weatherHistory.forEach((element) => {
          var theDate = new Date(element["timeStamp"] * 1000);
          var dateString =
            theDate.toLocaleDateString() +
            " " +
            theDate.getHours() +
            ":" +
            theDate.getMinutes() +
            ":" +
            theDate.getMinutes();
          //layer cake chart
          historicalPoints.push({
            x: element["timeStamp"],
            y: element["Temperature"],
          });
          historicalHumidityPoints.push({
            x: element["timeStamp"],
            y: element["Humidity"],
          });
          combinedPoints.push({
            group: "Ambient Temp",
            date: theDate.toISOString(),
            value: element["Temperature"],
          });
          combinedPoints.push({
            group: "Ambient Humidity",
            date: theDate.toISOString(),
            value: element["Humidity"],
          });
        });

        brushedData = points.slice(
          (brushExtents[0] || 0) * points.length,
          (brushExtents[1] || 1) * points.length
        );
        if (brushedData.length < 2) {
          brushedData = points.slice(
            brushExtents[0] * points.length,
            brushExtents[0] * points.length + 2
          );
        }
      }
    } catch (error) {
      errorMessage = "Weather Details unavailable";
      console.log(error);
    }
    newData = points;
    historicalData = historicalPoints;
    newHumidityData = humidityPoints;
    historicalHumidityData = historicalHumidityPoints;
    newCombinedData = combinedPoints;
    datasets = [
      newData,
      historicalData,
      newHumidityData,
      historicalHumidityData,
    ];
    console.log(newCombinedData);
  });
</script>

<div class="uk-container uk-container-xlarge uk-margin">
  <div>
    <div
      class="uk-card uk-card-default uk-card-hover uk-card-body uk-margin uk-column-1-4"
    >
      <h3 class="uk-card-title">Hive Number: {hive.fbId}</h3>
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
    <LineChart
      data={newCombinedData}
      options={{
        title: "Line (time series) - Zoom bar enabled",
        axes: {
          bottom: {
            title: "2019 Annual Sales Figures",
            mapsTo: "date",
            scaleType: "time",
          },
          left: {
            mapsTo: "value",
            title: "Conversion rate",
            scaleType: "linear",
          },
        },
        curve: "curveMonotoneX",
        experimental: true,
        zoomBar: {
          top: {
            enabled: true,
          },
        },
        height: "400px",
      }}
    />
  </div>
  <div class="uk-card uk-card-default uk-card-hover uk-card-body uk-margin">
    <ComboChart
      data={newCombinedData}
      options={{
        title: "Combo (Line + Area) Time series",
        points: {
          enabled: false,
        },
        axes: {
          left: {
            title: "Hive Temp",
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
</div>
