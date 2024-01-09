<svelte:options customElement="usg-home-component" />
<script>
  import { onMount } from 'svelte';
  import {flip} from 'svelte/animate';
  import {fnGetUser} from '/context/User';
  import {aNews} from '/context/News';
  import Draggable from "/lib/Draggable.svelte";
  import Droppable from "/lib/Droppable.svelte";
  import Template from "/src/components/Template.svelte";
  import {DROPPED, HOME, THROWN} from '/lib/DragonDropon';

  const aPath = location.pathname.substr(1).toLowerCase().split("/");
  const root = "/" +(aPath[0] || "");
  const TwoColumnWidth = 800;
  let You = fnGetUser();
  let newsCycle=0;
  let pathtext = root=="/"?"Try a different path":"... or not :)";
  onMount(()=>{
    let waitTime = aNews[newsCycle].trim().length*25;
    let I = setInterval(()=>{
      if((waitTime-=1000) < 0){ 
          if(++newsCycle >= aNews.length)
            I = clearInterval(I);
          else
            waitTime = aNews[newsCycle].trim().length*25;
      }
    },1000);
  })
  let Swapper={clientWidth:0},
      Bucket={scrollWidth:0},
      Thing1={clientWidth:0},
      Thing2={clientWidth:0};
  $:{ 
        console.log("clientWidth, ul.scrollWidth :",Swapper.clientWidth, Bucket.scrollWidth ); 
    }
    let Thing=undefined;
    let aThings1=[];
    let aThings2=[];
    let aColors=["#ffffff", "#efefef", "#efefff", "#effffe", "#eeefff", "#efeefe", "#efeeee", "#ffddcc", "#cceeff", "#ddeecc", "#eeccdd"]
    for(let i=1;i<11;i++){
      aThings1.push({
        id:"Things-1-" + i, 
        text:"Thing 1 "+ i,
        color:aColors[i],
        imgSrc:`Dragon.png`,
        aContents:["The contents of Thing 1." + i, 
          "<br>Another line."
        ]
      })
    }
    aColors=aColors.reverse();
    for(let i=1;i<11;i++){
      aThings2.push({
        id:"Things-2-" + i, 
        text:"Thing 2 "+ i,
        color:aColors[i],
        imgSrc:`Dragon.png`,
        aContents:["The contents of Thing 2." + i, 
          "<br>Another line."
        ]
      })
    }
    function fnDragend(thingId, effect){
      if( thingId && effect !== HOME ){
        let index = aThings1.findIndex((T)=>(T.id==thingId));
        if(index >=0){
          Thing = (effect == DROPPED) ? aThings1[index] : undefined;
          aThings1.push(aThings1.splice(index,1)[0]);
          aThings1=aThings1;
          return;
        }
        index = aThings2.findIndex((T)=>(T.id==thingId));
        if(index >=0 ){
          Thing = (effect == DROPPED) ? aThings2[index] : Thing;
          aThings2.push(aThings2.splice(index,1)[0]);
          aThings2=aThings2;
          return;
        }
        Thing = undefined;
      }
    }

</script>
<div class="Panel grid-auto-flow-row justify-items-center">
  <div class="grid  Verbiage">
    <h1>USGolfers Network</h1>
    <div class="text-align-end">A Svelte Golf Project</div>
  </div>
  <div class="Swapper {Swapper.clientWidth > TwoColumnWidth?"":"two-column"} grid align-items-start justify-items-center "  bind:clientWidth={Swapper.clientWidth}>
    {#if Swapper.clientWidth > TwoColumnWidth}
    <div class="Things"  bind:clientWidth={Thing1.clientWidth}>
      {#each aThings1 as T}
      <Draggable id="{T.id}" Thing="{T}" {fnDragend}>
        <div>{T.text}</div>
      </Draggable>
      {/each}
    </div>
    {/if}
    <Droppable id="Bucket" classname="Bucket Messages text-align-left" bind:this={Bucket}>
      {#if Thing}
        <Template {Thing} />
      {:else}
          <p>{@html `Hi <b>${You.alias}!</b> ${You.userid ?"":" If you don't have an account we can still pretend!"}`}</p>
          {#each aNews as article,idx}
            {#if idx <= newsCycle}
            <p>{@html article}</p>
            {/if}
          {/each}
      {/if}
    </Droppable>
    <div class="Things"  bind:clientWidth={Thing2.clientWidth}>
      {#each aThings2 as T}
      <Draggable id="{T.id}" Thing="{T}"  {fnDragend}>
        <div>{T.text}</div>
      </Draggable>
      {/each}
    </div>
  </div>
</div>
<style>
  .Panel{
    max-width:1000px;
  }
  .Swapper{
    width:1000px;
    gap:1em;
    padding:.5em 2em;
    grid-template-columns:10em 1fr 10em;
  }
  .Swapper.two-column{
    padding:.5em .5em;
    grid-template-columns:1fr 10em;
  }
  .Things{
    display:grid;
    grid-template-columns: 10em;
    grid-template-rows: repeat(4,10em);
    justify-items: center;
    align-items:center;
    align-content: start;
    height:40em;
    overflow:hidden;
    outline:1px solid rgb(206, 206, 206);
    gap:0;
  }
  .Things > *{
    display:grid;
    text-align:center;
    justify-content: center;
    align-content: center;
    min-width:9em;
    min-height:9em;
    padding:.5em;
    background-color:rgb(194, 140, 140);
    outline:1px solid rgb(206, 206, 206);
  }
  .Messages{
    overflow:auto;
    margin:0em 2em;
    min-height:1em;
  }
  .Verbiage{
    max-width:unset;
    text-shadow:.1em .1em .2em rgb(201, 201, 201);
  }
</style>
  