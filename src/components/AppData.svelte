<script>
    import { onMount } from 'svelte';
    import {fnAppData} from "/Context/Courses";
    let jAppData={
        length:0,
        total:0,
        accessed:0,
        first:9999999999999,
        last:-1,
        get world(){
            return (sessionStorage["USG-jWorld"]||"").length
        },
        aData:[] 
    }
    onMount(()=>{
        fnLoadAppData();
    })
    function fnLoadAppData(){
        jAppData.length=jAppData.total=jAppData.accessed=0;
        jAppData.last=-1;
        jAppData.first=9999999999999;
        fnAppData({something:false})
        .then(jQueries=>{
            // TODO : Cycle these and join the ACCESSED record value to the QUERY record
            let T,aAppData=Object.entries(jQueries);
            aAppData.forEach(([key,Q])=>{
                jAppData.total+=Q.length;
                jAppData.accessed+=(Q.accessed||0);
                jAppData.first = Math.min(jAppData.first,Q.createDt);
                jAppData.last = Math.max(jAppData.last,Q.lastDt);
                T = Math.ceil((Q.lastDt-Q.createDt)/1000);
                Q.time = `${Math.ceil((T/3600)%60)}h:${Math.ceil((T/60)%(60))}m:${Math.ceil((T)%60)}s`;
            });
            T = Math.ceil((jAppData.last-jAppData.first)/1000);
            jAppData.time = `${Math.ceil((T/3600)%60)}h:${Math.ceil((T/60)%(60))}m:${Math.ceil((T)%60)}s`;
            jAppData.aData = aAppData.sort((a,b)=>{
                return a[1].accessed > b[1].accessed?-1:a[1].accessed < b[1].accessed?1:0;
            })
            jAppData=jAppData;
        });
    }

</script>
<div class="grid AppData">
    <div class="grid Row">
        <div>Wld {jAppData.world.withCommas()}</div>
        <div>{jAppData.accessed.withCommas()}</div>
        <div>{jAppData.total.withCommas()}</div>
        <div>{jAppData.time}</div>
    </div>
    <div class="grid Row">
        <div><a href on:click|preventDefault={fnLoadAppData}>Refresh</a></div>
        <div>Accessed</div>
        <div>Length</div>
        <div>Time</div>
    </div>
    {#each jAppData.aData as [key,Q],idx}
    <div class="grid Row " title="{key}">
        <div>{(idx+1).withCommas()}</div>
        <div>{Q.accessed.withCommas()}</div>
        <div>{Q.length.withCommas()}</div>
        <div>{Q.time}</div>
    </div>
    <div class="grid FullRow">{key.replace(/\|/g," ")}</div>
    {/each}
</div>
<style>
    .AppData{
        justify-items:start;
        overflow-y:auto;
        min-height:30vh;
        background-color: white;
        max-width:100%;
        gap:0em;
        padding:.5em;
        padding-bottom:5em;
    }
    .AppData .Row{
        width:100%;
        grid-template-columns:repeat(4, 1fr);
        gap:2em;
        margin:0px;
    }
    .AppData .FullRow{
        display:block;
        width:100%;
        height:0em;
        margin:0px;
        max-height:0em;
        overflow:hidden;
        text-align:left;
        padding:0em;
        outline:0px solid black;
        transition: all ease-in-out .3s;
    }
    .AppData .Row:hover + .FullRow,.AppData .FullRow:hover{
        outline:1px solid black;
        padding:0em 0em 1em 0em;
        height:max-content;
        min-height:2em;
        max-height:40em;
    }
</style>