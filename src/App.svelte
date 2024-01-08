<svelte:options customElement="usg-app-component" />
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
