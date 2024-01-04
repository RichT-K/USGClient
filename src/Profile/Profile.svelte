<svelte:options customElement="usg-profile" />
<script>
    import { onMount } from 'svelte';
    import { fnGetUser } from "/context/User.ts";
    import Settings from "./Settings.svelte";
    import Login from "./Login.svelte";
    import Logout from "./Logout.svelte";
    import Register from "./Register.svelte";
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
    <a href on:click|preventDefault="{onChangeSection}">Login</a>
    {#if User.isLoggedIn}
    <a href on:click|preventDefault="{onChangeSection}">Logout</a>
    {/if}
    <a href on:click|preventDefault="{onChangeSection}">Register</a>
</div>
<div>
    <h1>{User.alias || "User"} {section}</h1>
{#if section=="login" }
<Login/>
{:else if section == "logout" && User.isLoggedIn}
<Logout/>
{:else if section == "register"}
<Register/>
{:else}
<div>
    <Settings />
</div>
{/if}
</div>
<style>
    h1{
        text-transform: capitalize;
    }
    .flex{
        display:flex;
        gap:2em;
    }
</style>
