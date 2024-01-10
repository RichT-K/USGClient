<svelte:options customElement="usg-home-component" />
<script>
  import App from '../App.svelte';

  import { onMount } from 'svelte';
  import {fnGetUser} from '/context/User';
  import Template from "/src/components/Template.svelte";
  import DropFeed from "./DropFeed.svelte";

  const aPath = location.pathname.substr(1).toLowerCase().split("/");
  const root = "/" +(aPath[0] || "");
  let pathtext = root=="/"?"Try a different path":"... or not :)";
  let You = fnGetUser();
</script>
<div class="Panel grid-auto-flow-row justify-items-center">
  <div class="grid  Verbiage">
    <h1>USGolfers Network</h1>
    <div class="text-align-end">A Svelte Golf Project</div>
  </div>
  <DropFeed/>
 </div>
<style>
  .Panel{
    max-width:1000px;
  }
  .Messages{
    overflow:auto;
    margin:0em 2em;
    min-height:1em;
  }
  .Verbiage{
    max-width:unset;
    text-shadow:.1em .1em .2em rgb(201, 201, 201);
  }
</style>
  