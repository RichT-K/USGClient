<svelte:options customElement="usg-page-not-found-component" />
<script>
    import { fnGetUser } from "/context/User";
    import {PageHistory} from "/lib/Router"
    let User = fnGetUser();
</script>
<div class="PAGE-NOT-FOUND">
    <div class="text-align-center sticky">
        <h2>USGolfers</h2>
        <h1>Page Not Found</h1>
    </div>
    <h4>You're In A Tough Spot!</h4>
    <div>
        <h3>Oh The Places You've Been {User.alias|| ""}!!!</h3>
    </div>
    <div class="grid Places">
{#each Object.entries(PageHistory.Pages).sort((a,b)=>(a[1]<b[1]?1:a[1]>b[1]?-1:0)) as [path,count],i}
        <div>{i+1}) {count} time{count>1?"s":""} at {path}</div>
{/each}
    </div>
</div>
<style>
.sticky{
    width:100%;
    background:rgb(196, 182, 182);
}
.Places{
    width:100%;
    gap:2em;
    grid-template-columns:repeat(auto-fill, minmax(5em,20em));
    align-content:start;
    justify-items:start;
    justify-content:center;
    min-height:40vh;
}
.PAGE-NOT-FOUND{
    display:grid;
    margin:0em;
    padding:0em 3em  3em 3em;
    justify-items:center;
    background-color:red;
    color:white;
    width:80vw;
}
</style>
    