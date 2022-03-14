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
  const hiveTracker = getContext("HiveTracker");

  let weather = [];
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
  var points = [];
  var newData = [];

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
  });
  

  onMount(async () => {
    try {
      weather = await hiveTracker.getWeather(hive.location.lat, hive.location.lng);
    } catch (error) {
      errorMessage = "Weather Details unavailable";
      console.log(error);
    }
    newData = points;
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
</div>
<div
  class="uk-card uk-card-default uk-card-large uk-card-body uk-box-shadow-large uk-width-3xlarge uk-margin uk-height-2xlarge uk-align-center"
>
  <div
    class="uk-child-width-expand@s uk-text-center uk-height-large uk-align-center"
  >
    <h3>Temperature Data</h3>
    <LayerCake
      padding={{ right: 10, bottom: 20, left: 25 }}
      x={xKey}
      y={yKey}
      data={brushedData}
    >
      <Svg>
        <AxisX
          ticks={(ticks) => {
            const filtered = ticks.filter((t) => t % 1 === 0);
            if (filtered.length > 7) {
              return filtered.filter((t, i) => i % 2 === 0);
            }
            return filtered;
          }}
        />
        <AxisY ticks={4} />
        <Line stroke="#00e047" />
        <Area fill="#00e04710" />
      </Svg>
    </LayerCake>
  </div>

  <div
    class="uk-padding uk-child-width-expand@s uk-text-center uk-height-small uk-align-center"
  >
    <LayerCake padding={{ top: 5 }} x="x" y="y" data={newData}>
      <Svg>
        <Line stroke="#00e047" />
        <Area fill="#00e04710" />
      </Svg>
      <Html>
        <Brush bind:min={brushExtents[0]} bind:max={brushExtents[1]} />
      </Html>
    </LayerCake>
    <div class="uk-padding">
      <h3>Click and Drag to zoom</h3>
    </div>
  </div>
</div>

