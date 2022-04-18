<script
  src="https://upload-widget.cloudinary.com/global/all.js"
  type="text/javascript">
  import { user } from "../stores";

  import { getContext, onMount } from "svelte";
  import { push } from "svelte-spa-router";

  const hiveTracker = getContext("HiveTracker");

  export let hive = hiveTracker.selectedHive[0];
  console.log(hive)
  let errorMessage ="";
  let comment = "";
  let myWidget;
  let errorGallery = false;
  let loggedInUser
  let comments = []
  

  onMount(async () => {
    loggedInUser = await hiveTracker.getUserByEmail($user.email);
    errorGallery = false
    hive = hiveTracker.selectedHive[0];
    comments = []
    comments = await hiveTracker.getHiveComments(hive.fbid)
    formatDTG()
    console.log(hive)
    myWidget = cloudinary.createUploadWidget({
    cloudName: 'digabwjfx',
    uploadPreset: 'hive_tracker',
    tags: [hive.fbid],
    }, (error, result) => {
      if (!error && result && result.event === "success") {
        console.log('Done! Here is the image info: ', result.info);
        errorGallery = false;
      }
    }
    );
  });

  async function widgetOpen(){
    if (!errorGallery) {
      console.log("trying to open widget")
      myWidget.open();
    } else {
      errorMessage = "!! Gallery Server offline."
    }
    
  };

  async function addHiveComment() {
    if (comment != "") {
      const success = await hiveTracker.addHiveComment(comment,hive.fbid,loggedInUser.data.fbid);
    if (success["success"]==true) {
      comments = await hiveTracker.getHiveComments(hive.fbid)
      formatDTG()
    } else {
      errorMessage = "Comment not added - error occurred";
    }
    }
    
  };

  async function deleteHiveComment(comment_id) {
    const _id = comment_id.target.value;
    const success = await hiveTracker.deleteHiveComment( _id);
    if (success["success"]==true) {
      comments = []
      comments = await hiveTracker.getHiveComments(hive.fbid)
      formatDTG()

    } else {
      errorMessage = "Comment not removed - error occurred";
    }
  };

  async function deleteOneHive() {
    var deleteHive = false;
    
    const loggedInUserHives = await hiveTracker.getHiveByOwner(loggedInUser.data.fbid);
    loggedInUserHives.forEach(loggedInUserHive => {
      if (loggedInUserHive.fbid == hive.fbid ) {
        deleteHive = true;
        
      }
    });
    if (deleteHive ||loggedInUser.data.admin) {
      const success = await hiveTracker.deleteOneHive(hive.fbid);
    if (success) {
      push("/hives")
    } else {
      errorMessage = "Deletion not completed - some error occurred";
    }
    }else{
      errorMessage = "!! Hive can only be deleted by Owner OR Admin member"
    }
    
  };

  function updateLocation(){
    push("/updateLocation");
  }

  function gallery(){
    if (!errorGallery) {
      push("/gallery");
    } else {
      errorMessage = "!!  Gallery server offline"
    }
    
  }

  function formatDTG(){
    if (comments.length > 0) {
      comments.forEach(comment => {
      comment.dateLogged =
        new Date(parseInt(hive.dateRegistered) * 1000).toLocaleTimeString() +
        " " +
        new Date(parseInt(hive.dateRegistered) * 1000).toLocaleDateString();
    });
    }
  }
</script>


<div
  class="uk-margin uk-width-2xlarge uk-margin-auto uk-card uk-card-default uk-card-body 
  uk-box-shadow-large uk-card-hover uk-panel-scrollable "
>
<div class="uk-column-1-4">

  <div class="uk-margin " >
    <button class="uk-button uk-button-link uk-card uk-card-small uk-card-hover">
    <i class="far fa-images fa-3x" on:click={gallery} 
    uk-tooltip="title:Edit Gallery;pos:bottom"
    style="color:rgb(153, 196, 74)" ></i>
  </button>
  </div>

  <div class="uk-margin">
    <button class="uk-button uk-button-link uk-card uk-card-small uk-card-hover">
    <i class="far fa-trash-alt fa-3x" on:click={deleteOneHive}
    onclick="return confirm('Are you sure you want to delete hive CANNOT be undone!')" 
    style="color: red;" 
    uk-tooltip="title:Delete Hive;pos:bottom"></i></button>
  </div>
  
  <div class="uk-margin " >
    <button class="uk-button uk-button-link uk-card uk-card-small uk-card-hover">
      <i class="fas fa-file-image fa-3x" on:click={widgetOpen} 
      uk-tooltip="title:Upload Images;pos:bottom"
      style="color: orange;"></i>
  </button>
  </div>
  

  
  <div class="uk-margin">
    <button class="uk-button uk-button-link uk-card uk-card-small uk-card-hover">
    <i class="fas fa-map-marker-alt fa-3x" on:click={updateLocation}  
    uk-tooltip="title:Update Location;pos:bottom" 
    style="color: rgb(102, 153, 255);"></i></button>
  </div>

  





</div>
    {#if errorMessage}
      <div class="uk-text-center uk-text-small uk-text-danger">
        {errorMessage}
      </div>
    {/if}
      <div class="uk-margin">
        <textarea
          class="uk-textarea uk-resize-vertical"
          rows="10"
          placeholder="Comments"
          name="details"
          bind:value={comment}
          
        />
      </div>

    <div class="uk-margin">
      <button 
        class="submit uk-button uk-button-link uk-button-small uk-align-center"
        ><i class="far fa-comment fa-3x" on:click={addHiveComment} uk-tooltip="title:Add Comment;pos:top"></i>
      </button>
    </div>

  
  <table class="uk-table">
    <caption>
      RECORDS
    </caption>
    <thead class="uk-text-left">
      <th>Date Logged</th>
      <th>Comments</th>
      <th>Delete Comment</th>

    </thead>
    <tbody class="uk-text-left">
      {#if comments}
        {#each comments as comment}

        <tr>
          <td class="uk-text-small"> {comment.dateLogged} </td>
          <td class="uk-text-break uk-text-small"> {comment.comment} </td>
          <td>

              <div class="uk-margin">
                
                <button  class="uk-button uk-button-danger uk-button-small uk-text-small"
                on:click={deleteHiveComment} value={comment.fbid}
                onclick="return confirm('Are you sure you want to delete comment?')"
                  >Delete
                </button>

              </div>
          </td>
        </tr>

        {/each}
      {/if}
    </tbody>
  </table>
</div>
