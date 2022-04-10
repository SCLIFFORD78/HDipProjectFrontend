<script>
  import { onMount, getContext } from "svelte";
  
  const hiveTracker = getContext("HiveTracker");

  let selectedType = 0;
  let type = ["All", "Super", "National", "Langstroth", "Top Bar", "Warree"];
  export let expFilter;
  let hiveList;
  let errorMessage = " ";
  export let filter = [];
  export let match;

  onMount(async () => {
    hiveList=[]
    hiveList = await hiveTracker.getHives();
    for (var i = 0; i < hiveList.length; i++) {
      var user = await hiveTracker.getUser(hiveList[i].user);
      if (user) {
        hiveList[i].userName = user.firstName.concat(" ", user.secondName);
      }
    }
    hiveList.sort((a,b)=> a.tag - b.tag)
    filter = hiveList;

    if (hiveList) {
      expFilter({
        filter: filter,
        match: match,
      });
    }
  });

  function select() {
    filter = hiveList;
    if (hiveList) {
      match;
      if (selectedType > 0) {
        filter = [];
        for (var j = 1; j < type.length; j++) {
          if (selectedType == j) {
            match = type[j];
          }
        }
        for (var i = 0; i < hiveList.length; i++) {
          if (hiveList[i].type == match) {
            filter.push(hiveList[i]);
          }
        }
      }
      expFilter({ filter: filter });
    }
  }
</script>

<div class="uk-margin uk-grid-small uk-child-width-auto uk-grid">
  <label
    ><input
      bind:group={selectedType}
      value={0}
      class="uk-radio"
      type="radio"
      name="type"
      on:change={select}
    />
    {type[0]}
  </label><br />
  <label
    ><input
      bind:group={selectedType}
      value={1}
      class="uk-radio"
      type="radio"
      name="type"
      on:change={select}
    />
    {type[1]}
  </label><br />
  <label
    ><input
      bind:group={selectedType}
      value={2}
      class="uk-radio"
      type="radio"
      name="type"
      on:change={select}
    />
    {type[2]}
  </label><br />
  <label
    ><input
      bind:group={selectedType}
      value={3}
      class="uk-radio"
      type="radio"
      name="type"
      on:change={select}
    />
    {type[3]}
  </label><br />
  <label
    ><input
      bind:group={selectedType}
      value={4}
      class="uk-radio"
      type="radio"
      name="type"
      on:change={select}
    />
    {type[4]}
  </label><br />
  <label  class="uk-padding-small  uk-padding-remove-bottom"
    ><input
      bind:group={selectedType}
      value={5}
      class="uk-radio"
      type="radio"
      name="type"
      on:change={select}
    />
    {type[5]}
  </label><br />
</div>
