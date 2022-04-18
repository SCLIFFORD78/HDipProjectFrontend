<script>
  import bba from "/src/assets/bba.png"
  import {title, subTitle, user} from "../stores.js"
</script>

<div class="uk-width-1-2@m  uk-card uk-card-default uk-padding-small uk-visible@m ">
  <div class="uk-grid">
    <div class="uk-width-1-3@m">
      <a href="/"> <img src="{bba}" width="400" alt="img"/> </a>
    </div>
    <div class="uk-width-expand@m uk-text-left">
      <div class="title">
        {$title}
      </div>
      <div class="uk-text-muted uk-text-small">
        {$subTitle}
      </div>
      <div class="uk-width-expand@m uk-text-left">
        <div class="uk-text-muted " style="font-size:x-small">{$user.email} </div>
      </div>
    </div>
    <div class="uk-card uk-card-small uk-text-center ">
      <a target="_blank" href="https://sclifford-hdip-project-handbook.netlify.app">
        <div>
          <i class="fas fa-info-circle fa-3x" style="color:rgb(95, 96, 173)" title="Info Page" pos="bottom" uk-tooltip></i>
        </div>
        
      </a>
    </div>
  </div>
</div>
