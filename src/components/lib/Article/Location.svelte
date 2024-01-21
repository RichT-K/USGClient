<svelte:options customElement="usg-article-location" />
<script>
    import { onMount, onDestroy } from 'svelte';
    export let jLocationData=undefined, viewBy = "holes";
    let OPENED = jLocationData.opened?"OPENED":"", aData;
    $: if( !jLocationData.opened ){
            if(viewBy == "courses") aData = jLocationData.Locations.slice(0,3);
            else aData = jLocationData.aByHoles.slice(0,3);
        }
        else{
            if(viewBy == "courses") aData = jLocationData.Locations;
            else aData = jLocationData.aByHoles;
        }
</script>
<div class="Verbiage {OPENED} ">
    <h1>{jLocationData.title}</h1>
{#if viewBy == "courses"}
    <h3>Courses Details</h3>
    <div class="Details">
    {#each aData as jData, idx}
        <span>{@html `
${(!idx && jData.courses > 5)?"Leading the way are the ":(jData.courses==1?"There is":"There are")} 
<b>${jData.courses.withCommas()}</b> 
<b>${jData.age}</b>, <b>${jData.Type}</b>, <b>${jData.holes||"??"} hole</b>, 
<b>par ${jData.avgPar}</b>, 
<b>${jData.avgLength.withCommas()} yard</b>  
 course${jData.courses>1?"s":""}
`}
{@html jData.minYear==9999?" age unknown":(jData.minYear !== jData.maxYear ?` spanning <b>${jData.minYear}</b> through <b>${jData.maxYear}</b>`:` built in <b>${jData.minYear}</b>`)}.
</span>
{#if !((4+idx)%7) }<br/><br/>{/if}
    {/each}
    </div>
{:else}
    <h3>Courses By Number of Holes</h3>
    <div class="grid ByHoles">
    {#each aData as jData}
            <p>{`${jData.courses.withCommas()} course${jData.courses>1?"s":""} with ${jData.holes==0?"an unknown number of ":jData.holes} hole${jData.holes==1?"":"s"}`}</p>
    {/each}
    </div>
{/if}
</div>
<style>
    .ByHoles{
        gap:.5em;
        grid-template-columns:repeat(auto-fit, 15em);
    }
    .Details span{
        margin-right:.5em;
    }
    .OPENED .Details {
        margin:.5em 5vw;
    }
</style>