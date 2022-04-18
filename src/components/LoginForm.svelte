<script src="https://apis.google.com/js/platform.js" async defer>
  import { push } from "svelte-spa-router";
  import {getContext} from "svelte";
  const hiveTracker = getContext("HiveTracker");

  let email = ""
  let password = "";
  let errorMessage = "";

  async function login() {
    let success = await hiveTracker.login(email, password)
    if (success) {
      push("/map");
    } else {
      email = "";
      password = "";
      errorMessage = "Invalid Credentials";
    }
  }
  async function googleLogin(googleID,email) {
    let success = await hiveTracker.googleLogin(googleID)
    if (success) {
      push("/map");
    } else {
      email = "";
      password = "";
      errorMessage = "Invalid Google Details";
    }
  }

  window.onSignIn = (googleUser) => {
     const profile = googleUser.getBasicProfile();
     console.log('ID: ' + profile.getId());
     console.log('Name: ' + profile.getName());
     console.log('Image URL: ' + profile.getImageUrl());
     console.log('Email: ' + profile.getEmail());
     console.log('IDtoken: ' + googleUser.getAuthResponse().id_token);
     googleLogin(googleUser.getAuthResponse().id_token , profile.getEmail())
  };

function signOut() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      // User is now signed out
    });
  }

</script>

<svelte:head>
  <script src="https://apis.google.com/js/platform.js" async defer></script>
</svelte:head>



<form on:submit|preventDefault={login}>
  <div class="uk-margin uk-text-left">
    <label class="uk-form-label">Email</label>
    <div class="uk-inline uk-width-1-1">
      <span class="uk-form-icon" uk-icon="icon: mail"></span>
      <input bind:value={email} class="uk-input uk-form-large" type="text" name="email">
    </div>
  </div>
  <div class="uk-margin">
    <div class="uk-inline uk-width-1-1">
      <span class="uk-form-icon" uk-icon="icon: lock"></span>
      <input bind:value={password} class="uk-input uk-form-large" type="password" name="password">
    </div>
  </div>
  <div class="uk-margin">
    <button class="uk-button uk-button-primary uk-button-large uk-width-1-1">Login</button>
  </div>
  {#if errorMessage}
    <div class="uk-text-center uk-text-small uk-text-danger">
      {errorMessage}
    </div>
  {/if}
</form>
<!-- <div class="g-signin2" data-longtitle="true" data-onsuccess="onSignIn" />
<a href="#"  on:click={signOut}>Sign out</a> -->



