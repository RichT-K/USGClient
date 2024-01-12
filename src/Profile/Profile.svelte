<svelte:options customElement="usg-profile" />
<script>
    import { onMount } from 'svelte';
    import { fnGetUser } from "/context/User.ts";
    import Settings from "./Settings.svelte";
    import Login from "./Login.svelte";
    import Logout from "./Logout.svelte";
    import ForgotPassword from "./ForgotPassword.svelte";
    import Register from "./Register.svelte";
    import Data from "./Data.svelte";
    import Golfer from "./Golfer.svelte";
    import Roles from "./Roles.svelte";
    export let aPath=[];
    let User = fnGetUser();
    let U = {}
    let policyNumber=1;
    let msg = "";
    function fnReset(){
      U = {
          ...JSON.parse(JSON.stringify(User.Settings)),
          get About(){
              return User.fnAbout(U);
          }
          ,policy:0
      }
    }
    fnReset();
    function onSubmit(){
      msg = "";
      if(!U.policy) return msg="Policy acceptance is necessary.";
      U.policy = U.policy?policyNumber:0;
      fnSettings(U);
    }
    let section = (aPath[1] || aPath[0]).toLowerCase();
    onMount(()=>{
        console.log("In Profile<"+aPath+">:", User);
    })
    function onChangeSection(ev){
        if(ev){
            console.log("fnAbout:",ev)
            console.log("fnAbout:",ev.target)
            console.log("fnAbout:",ev.currentTarget)
            console.log("fnAbout:",ev.srcElement)
            section = ev.target.getAttribute("data-section");
            section = (section||"").toLowerCase();
            User = fnGetUser();
            fnReset();
        }
    }
    function fnAboutHandler(ev){
        
        console.log("fnAbout:",ev)
    }
</script>
<nav class="flex sticky">
    {#if User.isLoggedIn}
    <a href data-section="Profile" on:click|preventDefault="{onChangeSection}">Review & Save</a>
    <a href data-section="Settings" on:click|preventDefault="{onChangeSection}">Settings</a>
    <a href data-section="Roles" on:click|preventDefault="{onChangeSection}">Roles</a>
    <a href data-section="Golfer" on:click|preventDefault="{onChangeSection}">Golfer</a>
    <a href data-section="Data" on:click|preventDefault="{onChangeSection}">Data</a>
    <!-- a data-section="profile" href on:click|preventDefault="{onChangeSection}">Logout</a-->
    {:else}
    <a href data-section="Login" on:click|preventDefault="{onChangeSection}">Login</a>
    <a href data-section="Register" on:click|preventDefault="{onChangeSection}">Register</a>
    <a href data-section="Forgot Password" on:click|preventDefault="{onChangeSection}">Forgot Password</a>
    {/if}
</nav>
<div class="Verbiage grid justify-items-center">
    <h1><b>{User.possessiveAlias} {section}</b></h1>
{#if section=="login" }
<Login/>
{:else if section == "roles"}
<Roles/>
{:else if section == "golfer"}
<Golfer/>
{:else if section == "data"}
<Data/>
{:else if section == "logout" && User.isLoggedIn}
<Logout/>
{:else if section == "register"}
<Register/>
{:else if section == "forgot password"}
<ForgotPassword/>
{:else if section =="settings"}
<Settings />
{:else}
<form class="DOTTED" action="login" method="get" on:submit|preventDefault={onSubmit}>
    {@html User.fnChangesVerbiage(section)}
    <div class="about-you Verbiage ">
      <div class="content" on:click={onChangeSection}>{@html U.About}</div>
    </div>
    <div class="grid">
      {#if U.policy < policyNumber}
      <div>
        Please, Read and Accept Our Policy {U.policy?"It has Changes":""}
      </div>
      {/if}
      <label>
        <span>I Accept The Policy Regarding My Alterations</span>
        <input size=1 type="checkbox" required name="policy" bind:checked={U.policy} value="{policyNumber}"/>
      </label>
    </div>
    <div>{msg}</div>
    <div class="button-block">
        <button type="submit">Update</button>
        <button type="reset" on:click={fnReset}>Reset</button>
    </div>
  </form>
  {/if}
</div>
<style>
    nav{
        padding:0em;
        gap:0em;
        background-color:white;
        outline:1px solid rgb(218, 218, 218);
    }
    nav a{
        padding:.6em 2vw .4em 2vw;
        transition:padding .1s ease-in-out;
    }
    nav a:hover{
        padding:.4em 2vw .6em 2vw;
        text-shadow:1px 1px 2px rgb(112, 112, 112);
        background-color:rgb(233, 233, 233);
    }
    h1{
        text-transform: capitalize;
        margin:.2em 0em;
        padding:.2em 0em;
    }
    .Verbiage, .about-you{
    max-width:500px;
    max-height:fit-content;
  }
  .about-you .content{
    outline:1px solid rgb(219, 219, 219);
    padding:.5em .5em;
    max-height:500px;
    overflow:auto;
    transition:all .3s ease;
  }
</style>

