<svelte:options customElement="usg-games" />
<script>
    import { onMount, onDestroy } from 'svelte';
    import { fnGetUser } from "/context/User.ts";
    import USGCardGame from "./USGCardGame.svelte";
    export let aPath=[];

    let section = (aPath[1] || aPath[0]).toLowerCase();
    let User = fnGetUser();

    onMount(()=>{
        // Local initialization
        console.log("CustomElement: usg-games");
    })
    onDestroy(()=>{
        // Local clean up        
    });
    function onChangeSection(ev){
        section = ev.target.getAttribute("data-component") || "";
    }
</script>
<div class="menu">
    <a href on:click|preventDefault="{onChangeSection}">Home</a>
    <a href  on:click|preventDefault="{onChangeSection}" data-component="usgcardgame">USGolfers Card Game</a>
</div>
{#if section=="usgcardgame" }
<div class="GameArea">
<USGCardGame/>
</div>
{:else}
<h1>Games</h1>
<p >
    There are many golf games for play both on and off the course. 
    You may ask why create another? Who not?
</p>
<p >
    Games will be for users to search, add, play some and maybe create new games. 
    Until the interface is ready I'll use this area to design and develop build my golf card game. 
</p>
<p >
    There are many golf games for play both on and off the course. 
    You may ask why create another? Who not?
</p>
{/if}
<style>
    .GameArea{
        min-width:50vw;
    }
    p{
        margin:2em;
    }
</style>
    