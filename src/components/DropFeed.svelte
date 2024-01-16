<svelte:options customElement="usg-dropfeed" />
<script>
import { onMount } from 'svelte';
import {fnGetUser} from '/context/User';
import {aNews} from '/context/News';
import Draggable from "/lib/Draggable.svelte";
import Droppable from "/lib/Droppable.svelte";
import Template from "/src/components/Template.svelte";
import {DROPPED, HOME, THROWN} from '/lib/DragonDropon';
import { Feed } from "/lib/Feeds/Reader.js";
import Article from "/lib/Feeds/Article.svelte";

const TwoColumnWidth = 800;
let TwoColumn=false;

let Swapper={clientWidth:0},
    Bucket={scrollWidth:0},
    Thing1={clientWidth:0},
    Thing2={clientWidth:0};
$:{ 
    //TwoColumn = TwoColumnWidth < Swapper.clientWidth;
}
let newsCycle=0;
let F = new Feed("https://golfbusinessnews.com/feed/");
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
aThings2 = F.Items.map((Article,i)=>{
    return {
    index:i,
    id:Article.id, 
    text:Article.title,
    color:aColors[i%aColors.length],
    imgSrc:`Dragon.png`,
    isFeed:true,
    aContents:[]
    }});
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
<div class="Swapper {TwoColumn?"two-column":"three-column"} grid align-items-start justify-items-center "  bind:clientWidth={Swapper.clientWidth}>
{#if !TwoColumn}
<div class="Things">
    {#each aThings1 as T}
    <Draggable id="{T.id}" Thing="{T}" {fnDragend}>
    <div>{T.text}</div>
    </Draggable>
    {/each}
</div>
{/if}
<Droppable id="Bucket" classname="Bucket text-align-left" bind:this={Bucket} fnDropped={(e,Data)=>{console.log("Bucket received",Data)}}>
    {#if Thing}
    {#if Thing.isFeed}
        <Article jData={F.Items[Thing.index]}/>
    {:else}
        <Template {Thing} />
    {/if}
    {:else if F.content}
    <div class="Articles">
    {#each F.Items as Item}
        <Article jData={Item}/>
    {/each}
    </div>        
    {:else}
        <p>{@html `Hi <b>${You.alias}!</b> ${You.userid ?"":" If you don't have an account we can still pretend!"}`}</p>
        {#each aNews as article,idx}
        {#if idx <= newsCycle}
        <p>{@html article}</p>
        {/if}
        {/each}
    {/if}
</Droppable>
<div class="Things" bind:clientWidth={Thing2.clientWidth}>
    {#each aThings2 as T}
    <Draggable id="{T.id}" Thing="{T}" data={F.Items[T.index]} {fnDragend} fnDropped={(e,Data)=>{console.log("Dropped On The Bucket",Data)}}>
    <Article thumb={true} jData={F.Items[T.index]}/>
    </Draggable>
    {/each}
</div>
</div>
<style>
  .Articles{
    display:grid;
    gap:1em;
  }
  .Swapper{
    gap:1em;
    padding:.5em 2em;
    grid-template-columns:10em 1fr 10em;
    min-height:70vh;
    max-height:70vh;
    overflow:hidden;
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
</style>
