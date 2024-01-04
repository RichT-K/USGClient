<svelte:options customElement="usg-home-component" />
<script>
  import { onMount } from 'svelte';
  import {fnGetUser} from '/context/User';
  const aPath = location.pathname.substr(1).toLowerCase().split("/");
  const root = "/" +(aPath[0] || "");
  let You = fnGetUser();
  let opened="";
  let pathtext = root=="/"?"Try a different path":"... or not :)";
  onMount(()=>{
    console.log("IN SVELTE !!")
    setTimeout(()=>{
      opened="OPENED";
    },1000);
  })
</script>
<h1>Welcome To USGolfers</h1>
<h2 class="{opened}">A Svelte Component Project</h2>
{#if You.alias}
<div>
  Hi {You.alias}! {#if !You.userid}You don't have an account but we can pretend!{/if}
</div>
{/if}
<h3 class="{opened}">
  <div>Root:{root}</div>

  <div>Path:{aPath.join("/")}</div>

  <div>
    <a href="{root=="/"?"/a/different/path":"/"}">{pathtext}</a>
  </div>
</h3>
<style>
h2{
    width:0%;
    white-space:pre;
    overflow:hidden;
    transition:all 1s ease;
}
h2.OPENED{
    width:100%;
    text-align: center;
}
h3{
    max-height:0%;
    white-space:pre;
    overflow:hidden;
    transition:all 4s ease;
}
h3.OPENED{
    max-height:100%;
    text-align: center;
}
a{
    margin-top:2em;
}
  </style>
  