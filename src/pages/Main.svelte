<script>
  import {title, subTitle, navBar, welcomeBar} from "../stores"
  import hive from "/src/assets/bumblebee.png";
  import {getContext} from "svelte";
  const hiveTracker = getContext("HiveTracker");

  title.set("Hive Tracker App");
  subTitle.set("Sign up or Log in");

  navBar.set({
    bar: welcomeBar
  });
  hiveTracker.logout();
</script>

<div class="uk-container uk-container uk-container-large uk-margin">
  <div class="uk-child-width-expand uk-flex-center uk-flex-middle uk-text-center" uk-grid>
    <div class="uk-width-auto@m">
      <img width="400" src="{hive}" alt="img">
    </div>
    <article class="uk-article ">
      <div class="uk-card uk-card-default uk-card-body uk-box-shadow-xlarge">
      <h1 class="uk-article-title">Hive Tracker</h1>
  
      <p class="uk-article-meta">Created by Sheamus Clifford for final project HDip Computer Science WIT, 2022</p>
  
      <p class="uk-text-lead uk-padding ">A web application in conjunction with an android application and datalogger
        which utilizes Bluetooth BLE technology and cloud storage, to monitor
        temperature and humidity within a beehive. This will allow beekeepers to
        nonintrusively monitor key matrices which indicate overall hive health.</p>
  
      <p>Nonintrusive monitoring of conditions within a hive reduces the
        frequency for physical checks which need to be carried out, thus
        reducing the potential stress imposed on the hive, reducing the risk of
        a hive swarming and reduced overall honey yield. Key matrices analysis can also help identify early signs of compromise
        to general hive health.</p>

      </div>
  </article>
  </div>
</div>

