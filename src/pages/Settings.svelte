<script lang="ts">
  import { mainBar, navBar, subTitle, title , user} from "../stores";
  import hive from "/src/assets/beehive.jpg";
  import SettingsForm from "../components/SettingsForm.svelte";
  import AdminSettingsForm from "../components/AdminSettingsForm.svelte";
  import { onMount, getContext } from "svelte";

  const hiveTracker = getContext("HiveTracker");

  title.set("Hive Tracker App");
  subTitle.set("Edit Account details");
  let loggedUser;
  let adminSelection = false;

  onMount(async () => {
    adminSelection = true;
    const loggedInUser = await hiveTracker.getUserByEmail($user.email);
    if (loggedInUser.data.admin == true) {
      loggedUser = true;
    } else {
      loggedUser = false;
    }
  });


  function adminAccount() {
    if (adminSelection) {
      adminSelection = false
    } else {
      adminSelection = true
    }
  }

  navBar.set({
    bar: mainBar,
  });
</script>
{#if loggedUser == true}
  <div class="uk-column-1-2 uk-padding">
    <div class="uk-margin uk-align-right">
      <button
          on:click={adminAccount}
          href="#toggle-animation"
          class="uk-button uk-button-default"
          type="button"
          >{#if adminSelection == true}<span uk-icon="users" /> Select User Management
            
          {/if}{#if adminSelection == false}<span uk-icon="user" /> Select Admin User
          {/if}</button
        >
    </div>
  </div>
{/if}
<div class="uk-flex uk-flex-center uk-flex-top uk-grid-large " uk-grid>
  {#if loggedUser == true && !adminSelection}
    <div class=" uk-text-center">
      <AdminSettingsForm />
    </div>
  {:else if (loggedUser == true && adminSelection) || loggedUser == false}
    <!--     <div class="uk-width-1-2@m ">
      <img width="300" src={hive} alt="hive" />
    </div> -->

    <div class="uk-container uk-margin">
      <div
        class="uk-child-width-expand uk-flex-center uk-flex-middle uk-text-center"
        uk-grid
      >
        <div class="uk-width-auto@m">
          <img width="300" src={hive} alt="hive" />
        </div>
        <div class="uk-width-expand@m">
          <div
            class="uk-card uk-card-default uk-width-xlarge uk-card-body uk-box-shadow-large"
          >
            <SettingsForm />
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<!--   <div class="">
    <div
      class="uk-card uk-card-default uk-card-body uk-box-shadow-large uk-width-2xlarge"
    >
      <h3 class="uk-card-title uk-text-center">
        Edit any entry and press save
      </h3>

      <SettingsForm />
    </div>
  </div>
</div> -->
