<svelte:options customElement="usg-page-not-found-component" />
<script>
    import { fnGetUser } from "/context/User";
    import {PageHistory} from "/lib/Router"
    let User = fnGetUser();
</script>
<div class="PAGE-NOT-FOUND">
    <h2>USGolfers</h2>
    <h1>Page Not Found</h1>
    <h4>You're In A Tough Spot!</h4>
    <div>
        <h3>Oh The Places You've Been {User.alias|| ""}!!!</h3>
        {#each Object.entries(PageHistory.Pages) as [path,count],i}
        <div>{i+1}) {count} time{count>1?"s":""} at {path}</div>
        {/each}
    </div>
</div>
<style>
.PAGE-NOT-FOUND{
    display:grid;
    padding:3em;
    justify-items:center;
    background-color:red;
    color:white;
}
</style>
    