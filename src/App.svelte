<svelte:options customElement="usg-app-component" />
<svelte:head>
  <title>USGolfers</title>
  <link rel="icon" href="favicon.ico" type="image/x-icon"/>
</svelte:head>

<script>
  import { onMount } from 'svelte';
  import {Routes,Router} from "/lib/Router"
  import Menu from "/lib/Menu.svelte"
  onMount(()=>{
    console.log("IN SVELTE !!")
  })
</script>
<Menu {Routes}/>
<main use:Router />
<style>
</style>
