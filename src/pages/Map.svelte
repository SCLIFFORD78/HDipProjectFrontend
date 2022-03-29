<script>
  //import 'leaflet/dist/leaflet.css';
  import { mainBar, navBar, subTitle, title, user } from "../stores";
  import { LeafletMap } from "../services/leaflet-map";
  import { getContext, onMount } from "svelte";

  const hiveTracker = getContext("HiveTracker");

  let latitude = 52.05102;
  let longtitude = -9.6871;
  let hives;
  let marker;
  let adminUser = false;
  let origionalHiveList = [];
  let adminUserHiveList = [];
  let loggedInUser;
  let adminOwnHiveFilter = false;
  let mapConfig

  let types = ["Super", "National", "Langstroth", "Top Bar", "Warré"];

  let map;

  onMount(async () => {
    loggedInUser = await hiveTracker.getUserByEmail($user.email);
    if (loggedInUser.data.admin == true) {
      adminUser = true;
    } else {
      adminUser = false;
    }
    mapConfig = {
      location: { lat: latitude, lng: longtitude },
      zoom: 11,
      minZoom: 1,
    };
    map = new LeafletMap("hive-map", mapConfig, "Terrain");

    map.showZoomControl();
    if (loggedInUser.data.admin == false) {
      hives = await hiveTracker.getHiveByOwner(loggedInUser.data.fbid);
    } else {
      hives = await hiveTracker.getHives();
      origionalHiveList = hives;
    }

    populateMap(hives)

    map.showLayerControl();
  });

  function adminOwnHiveFilterFunction() {
    map.clearMap()
    map = new LeafletMap("hive-map", mapConfig, "Terrain");
    
    origionalHiveList.forEach((hive) => {
      if (hive.user == loggedInUser.data.fbid && adminOwnHiveFilter) {
        adminUserHiveList.push(hive);
      }
      if (adminOwnHiveFilter) {
        adminUserHiveList = adminUserHiveList.filter(
          (element, i) => i === hives.indexOf(element)
        );
        hives = adminUserHiveList;
        populateMap(hives)
      } else {
        hives = origionalHiveList;
        populateMap(hives)
      }
      
    });
    map.showLayerControl();
  }

  async function toggleAdminOwnHiveFilter() {
    if (adminOwnHiveFilter) {
      adminOwnHiveFilter = false;
      adminOwnHiveFilterFunction();
    } else {
      adminOwnHiveFilter = true;
      adminOwnHiveFilterFunction();
    }
  }

  async function populateMap(hives){
    hives.forEach((hive) => {
          types.forEach((type) => {
            if (hive.type == type) {
              const hiveStr = `Hive No.${hive.tag.toString()} ${hive.type.toString()}`;

              marker = map.addMarker(
                { lat: hive.location.lat, lng: hive.location.lng },
                hiveStr,
                hive.type,
                false
              );
            }
          });
        });
  }

  title.set("Hive Tracker.");
  subTitle.set("Map of all Hives");
  navBar.set({
    bar: mainBar,
  });
</script>

<div class="uk-container uk-margin  uk-container-large " uk-grid>
  {#if adminUser == true}
    <div>
      <div class="uk-margin uk-align-center">
        <button
          on:click={toggleAdminOwnHiveFilter}
          href="#toggle-animation"
          class="uk-button uk-button-default"
          type="button"
          >{#if adminOwnHiveFilter == true}<span uk-icon="users" /> Select All User
            Hives
          {/if}{#if adminOwnHiveFilter == false}<span uk-icon="user" /> Select Own
            Hives
          {/if}</button
        >
      </div>
    </div>
  {/if}
  <div
    class="uk-card uk-card-default uk-card-body uk-box-shadow-large uk-width-1-1"
  >
    <div id="hive-map" class="ui embed" style="height:800px" />
  </div>
</div>
