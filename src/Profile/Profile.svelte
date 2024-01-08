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
    export let aPath=[];
    let User = fnGetUser();
    let section = (aPath[1] || aPath[0]).toLowerCase();
    onMount(()=>{
        console.log("In Profile<"+aPath+">:", User);
    })
    function onChangeSection(ev){
        section = ev.target.innerHTML.toLowerCase();
        User = fnGetUser();
    }
</script>
<div class="flex">
    <a href on:click|preventDefault="{onChangeSection}">Profile</a>
    <a href on:click|preventDefault="{onChangeSection}">Data</a>
    <a href on:click|preventDefault="{onChangeSection}">Login</a>
    {#if User.isLoggedIn}
    <a href on:click|preventDefault="{onChangeSection}">Logout</a>
    {:else}
    <a href on:click|preventDefault="{onChangeSection}">Forgot Password</a>
    {/if}
    <a href on:click|preventDefault="{onChangeSection}">Register</a>
</div>
<div class="Verbiage">
    <h1><b>{User.alias || "User"} {section}</b></h1>
{#if section=="login" }
<Login/>
{:else if section == "data"}
<Data/>
{:else if section == "logout" && User.isLoggedIn}
<Logout/>
{:else if section == "register"}
<Register/>
{:else if section == "forgot password"}
<ForgotPassword/>
{:else}
<div>
    <Settings />
</div>
{/if}
</div>
<style>
    h1{
        text-transform: capitalize;
        margin:.2em 0em;
        padding:.2em 0em;
    }
    .flex{
        display:flex;
        gap:2em;
    }
</style>

