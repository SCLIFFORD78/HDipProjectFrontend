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
  import { Confirm } from "svelte-confirm";

  const hiveTracker = getContext("HiveTracker");

  let weather = [];
  let weatherHistory = [];
  let errorMessage = "";
  let loggedInUser;
  let alarms = [];

  title.set("Hive Tracker App");
  subTitle.set("Hive Details");
  navBar.set({
    bar: mainBar,
  });

  var newCombinedDataTemperature = [];
  var newCombinedDataHumidity = [];

  const hive = hiveTracker.selectedHive[0];

  var allAlarms = true;
  var sortedAlarms = []

  onMount(async () => {
    try {
      loggedInUser = await hiveTracker.getUserByEmail($user.email);
      weather = await hiveTracker.getWeather(
        hive.location.lat,
        hive.location.lng
      );
      weatherHistory = await hiveTracker.readWeatherHistory(hive.fbid);
      newCombinedDataTemperature = weatherHistory["combinedPointsTemperature"];
      newCombinedDataHumidity = weatherHistory["combinedPointsHumidity"];
      sortAlarms();
    } catch (error) {
      errorMessage = "Weather Details unavailable";
      console.log(error);
    }
  });

  async function ackAlarm(alarmID) {
    let success = await hiveTracker.ackAlarm(alarmID);
    if (success) {
      sortAlarms();
    } else {
      errorMessage = "Faile to ack Alarm";
    }
  }

  async function sortAlarms() {
    alarms = await hiveTracker.getHiveAlarms(hive.fbid);
    alarms.sort((a, b) => a.dateActive - b.dateActive);
    alarms.forEach((alarm) => {
      alarm.dateActive =
        new Date(parseInt(alarm.dateActive) * 1000).toLocaleTimeString() +
        " " +
        new Date(parseInt(alarm.dateActive) * 1000).toLocaleDateString();
    });
  }

  async function filterAlarms() {
    sortAlarms();
    sortedAlarms = []
    alarms.forEach((alarm) => {
      if (!alarm.act) {
        sortedAlarms.push(alarm);
      }
    });

    alarms = sortedAlarms;
  }

  function toggleFilter() {
    if (allAlarms) {
      allAlarms = false;
      filterAlarms();
    } else {
      allAlarms = true;
    }
  }
</script>

<div class="uk-container uk-container-xlarge uk-margin">
  <div id="offcanvas-reveal" uk-offcanvas="mode: reveal; overlay: true">
    <div class="uk-offcanvas-bar">
      <button class="uk-offcanvas-close" type="button" uk-close />
      <div class="uk-align-center uk-padding" on:click={toggleFilter}>
        {#if allAlarms == true}<i class="fas fa-toggle-on fa-2x" /> all alarms
        {/if}{#if allAlarms == false}<i class="fas fa-toggle-off fa-2x" /> active
          alarms
        {/if}
      </div>

      <div class="uk-table uk-table-divider">
        <table class="uk-table">
          <thead>
            <th> Ack.</th>
            <th> Temp </th>
            <th> Set </th>
            <th> DTG </th>
          </thead>
          <tbody class="uk-text-left">
            {#if allAlarms == true}
              {#if alarms}
                {#each alarms as alarm}
                  <tr>
                    {#if alarm.act}
                      <td
                        ><span
                          class="uk-badge"
                          style="background-color: green;"
                        /></td
                      >
                    {:else}
                      <td
                        ><Confirm
                          confirmTitle="Acknowledge Alarm"
                          cancelTitle="Cancel"
                          let:confirm={confirmThis}
                          ><span
                            class="uk-badge"
                            style="background-color: red;"
                            on:click={() => confirmThis(ackAlarm, alarm.fbid)}
                          />
                        </Confirm></td
                      >
                    {/if}
                    <td>{alarm.recordedValue.toFixed(2)}</td>
                    <td> {alarm.tempAlarm.toFixed(2)} </td>
                    <td> {alarm.dateActive} </td>
                  </tr>
                {/each}
              {/if}
            {:else if allAlarms == false}
              {#each sortedAlarms as alarm}
                <tr>
                  {#if alarm.act}
                    <td
                      ><span
                        class="uk-badge"
                        style="background-color: green;"
                      /></td
                    >
                  {:else}
                    <td
                      ><Confirm
                        confirmTitle="Acknowledge Alarm"
                        cancelTitle="Cancel"
                        let:confirm={confirmThis}
                        ><span
                          class="uk-badge"
                          style="background-color: red;"
                          on:click={() => confirmThis(ackAlarm, alarm.fbid)}
                        />
                      </Confirm></td
                    >
                  {/if}
                  <td>{alarm.recordedValue.toFixed(2)}</td>
                  <td> {alarm.tempAlarm.toFixed(2)} </td>
                  <td> {alarm.dateActive} </td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div>
    <div
      class="uk-card uk-card-default uk-card-hover uk-card-body uk-margin uk-column-1-6 uk-text-center"
    >
      <h2 class="uk-card-title">Hive No: {hive.tag}</h2>
      <p>FeelsLike: {weather.feelsLike} Celcus</p>
      <p>Cloud Cover: {weather.clouds}</p>
      <p>Wind Speed: {weather.windSpeed} Kph</p>
      <p>Direction: {weather.windDirection} Deg.</p>
      <p>Visibility: {weather.visibility} km</p>
      <p>Humidity: {weather.humidity}%</p>
      <div class="uk-margin">
        <button class="uk-button uk-button-link uk-card uk-card-small uk-card-hover">
        <i class="fas fa-bell fa-3x" 
        uk-tooltip="title:Show Alarms;pos:bottom" 
        style="color: rgb(255, 0, 0);"
        uk-toggle="target: #offcanvas-reveal"></i></button>
      </div>
    </div>
  </div>
  <div class="uk-column-1-2 " uk-grid>
    <div class="uk-width-expand@m ">
      <HiveInfo />
    </div>
    <div class="uk-card uk-card-default uk-card-body uk-width-expand@m ">
      <PhotoWidget />
    </div>
  </div>

  <div class="uk-card uk-card-default uk-card-hover uk-card-body uk-margin">
    <ComboChart
      data={newCombinedDataTemperature}
      options={{
        title:
          "Values of Hive Temperature (If recorded) and ambient Temperature",
        points: {
          enabled: false,
          radius: 0,
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
          radius: 0,
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
            updateRangeAxis: true,
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
