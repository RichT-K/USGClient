<svelte:options customElement="usg-menu" />
<script type="ts">
	import { onMount } from 'svelte';
    export let Routes ={"/":{text:"USGolfers"}};
    let menuIsOpen = "";
    let addBurgerClass,ul={scrollWidth:0},clientWidth=0;
    $: { 
        addBurgerClass= (clientWidth-100) < ul.scrollWidth?"has-burger":""; 
    }
    onMount(()=>{
    })
    function fnToggleBurgerMenu(ev){
        menuIsOpen = menuIsOpen?"":"open";
    }
</script>
<div class="Menu {addBurgerClass} {menuIsOpen}" bind:clientWidth={clientWidth}>
    <div class="burger-button">
        <button on:click="{fnToggleBurgerMenu}">
            <span>___</span>   
            <span>___</span>   
            <span>___</span>   
        </button>
    </div>
    <ul class="NavMenu" bind:this={ul}  >
        {#each Object.entries(Routes) as [key,Item] }
        <li><a href="{key}">{Item.text}</a></li>
        {/each}
    </ul>
</div>
<style>
a{
    text-decoration: none;
    color:var(--black-text);
}
.Menu{
    position:fixed;
    display:grid;
    justify-content: center;;
    top:0px;
    right:0px;
    width: 100%;
    overflow: hidden;
    background-color:white;
    outline:1px solid rgb(218, 218, 218);
}

.NavMenu{
    display: grid;
    margin:10px 60px;
    overflow:hidden;
    justify-content: left;
    grid-auto-flow: column;
    grid-template-columns: repeat(auto-fit,minmax(auto,1fr));
    gap:2em;
    list-style: none;
}
.Menu.has-burger.open{
    position: absolute;
    height:100vh;
    z-index: 11111;
    margin:0px 0px;
    overflow: visible;
    background-color:inherit;
    border-radius: var(--input-radius);
    outline:var(--input-outline);
    box-shadow:var(--li-box-shadow);
}
.Menu.has-burger.open .NavMenu{
  display:grid;
  grid-auto-flow: row;
  grid-template-columns: repeat(auto-fit,minmax(160px,1fr));
}
.Menu .burger-button{
    z-index:11111;
    display:none;
}
.Menu.has-burger .burger-button{
    display:initial;
    position:absolute;
    top:0em;
    right:0em;
    padding:.5em;
    background-color:inherit;
}
.Menu .burger-button button{
    display:grid;
    align-items: start;
    align-content: space-evenly;
    gap:1px;
    padding:0px;
    min-width:unset;
    width:2em;
    height:2em;
}
.Menu .burger-button button *{
    margin:-.5em;
    padding:0px;
    line-height:0em;
}

</style>
  