<script>
  import { onMount, getContext } from "svelte";
  import { push } from "svelte-spa-router";
  import Coordinates from "./Coordinates.svelte";
  import Filter from "../components/Filter.svelte";
  import { user } from "../stores";

  export let selectedHiveInfo;
  let filter = [];
  let errorMessage = "";
  let hives = [];
  let filteredHives = [];
  let loggedInUser;
  let adminUser = false;
  let adminOwnHiveFilter = false;
  let origionalFilter = [];

  const hiveTracker = getContext("HiveTracker");

  async function selectedHive(hive) {
    await hiveTracker.getHive(hive.target.value).then((selectedHive) => {
      if (selectedHive) {
        selectedHiveInfo = selectedHive;
      } else {
        errorMessage = "Hive not found!";
      }
      push("/HiveDetail");
    });
  }

  function expFilter() {
    origionalFilter = filter;
    hives = [];
    if (loggedInUser.data.admin == false || adminOwnHiveFilter) {
      filter.forEach((hive) => {
        if (hive.user == loggedInUser.data.fbid) {
          hives.push(hive);
        }
        filter = hives;
      });
    }
  }

  function adminOwnHiveFilterFunction() {
    origionalFilter.forEach((hive) => {
      if (hive.user == loggedInUser.data.fbid && adminOwnHiveFilter) {
        hives.push(hive);
      }
      if (adminOwnHiveFilter) {
        hives = hives.filter((element, i) => i === hives.indexOf(element));
        filter = hives;
      } else {
        filter = origionalFilter;
      }
    });
  }

  onMount(async () => {
    loggedInUser = await hiveTracker.getUserByEmail($user.email);
    expFilter();
    if (loggedInUser.data.admin == true) {
      adminUser = true;
    } else {
      adminUser = false;
    }
  });

  async function toggleAdminOwnHiveFilter() {
    if (adminOwnHiveFilter) {
      adminOwnHiveFilter = false;
      adminOwnHiveFilterFunction();
    } else {
      adminOwnHiveFilter = true;
      adminOwnHiveFilterFunction();
    }
  }
</script>

<Filter {expFilter} bind:filter />
<h3 class="uk-heading-divider">Hive List</h3>
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
<div class="uk-table uk-table-divider">
  <table class="uk-table">
    <thead>
      <th> Hive Number </th>
      <th> Category </th>
      <th> Owner </th>
      <th> Select for more info </th>
    </thead>
    <tbody class="uk-text-left">
      {#if filter}
        {#each filter as hive}
          <tr>
            <td>{hive.tag}</td>
            <td>{hive.type}</td>
            <td> {hive.userName} </td>
            <td>
              <button
                class="submit uk-button uk-button-primary uk-button-small uk-width-1-1"
                on:click={selectedHive}
                value={hive.fbid}
                >Select
              </button>
            </td>
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</div>
