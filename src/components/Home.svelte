<svelte:options customElement="usg-home-component" />
<script>
  import { onMount } from 'svelte';
  import {fnGetUser} from '/context/User';
  const aPath = location.pathname.substr(1).toLowerCase().split("/");
  const root = "/" +(aPath[0] || "");
  let You = fnGetUser();
  let msgCycle=0;
  let aMessages=[
    `Hi <b>${You.alias}!</b> ${You.userid ?"":" If you don't have an account we can still pretend!"}`,
    `Currently working on components for displaying and navigating our 181 Countries, 2870 Regions and 20098 Cities.
    `,
    `Also working on Searching and Mapping our 34,387 Golf Courses, Map and Overlay components.  
    `,
    `Following that will begin the Golfer, and Course Admin and Manager Components.  
    `
  ]
  let msg = aMessages[0];
  let pathtext = root=="/"?"Try a different path":"... or not :)";
  onMount(()=>{
    console.log("IN SVELTE !!")
    let I = setInterval(()=>{
      if(++msgCycle ==aMessages.length) I=clearInterval(I)
    },1000);
  })
</script>
<div class="Panel grid-auto-flow-row justify-items-center Verbiage">
  <div class="grid">
    <h1>Welcome The Network Of USGolfers</h1>
    <div class="text-align-end">A Svelte Golf Project</div>
  </div>
  <div class="Message text-align-left">
    {#each aMessages as message,idx}
      {#if idx <= msgCycle}
      <p>{@html message}</p>
      {/if}
    {/each}
    </div>
</div>
<style>
  .Panel{
    width:100%;
  }
  .Message{
    width:100%;
    padding:2em 0em;
    margin:2em;
    min-height:1em;
  }
  .Verbiage{
    max-width:unset;
    text-shadow:.1em .1em .2em rgb(201, 201, 201);
  }
</style>
  