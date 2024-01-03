<svelte:options customElement="usg-app-component" />
<script>
  import { onMount } from 'svelte';
  import {Routes,Router} from "/lib/Router"
  onMount(()=>{
    console.log("IN SVELTE !!")
  })
</script>
<ul class="NavMenu">
{#each Object.entries(Routes) as [path,Route], key}
  <li><a href="{path}">{Route.text}</a></li>
{/each}  
</ul>
<main use:Router />
<style>
  .NavMenu{
    display:grid;
    gap:1em;
    grid-auto-flow:column;
    list-style: none;
    justify-content: center;
  }
</style>
