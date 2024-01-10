<svelte:options customElement="usg-draggable" />
<script>
    import {Drag, HOME} from '/lib/DragonDropon';
    export let id, Thing=undefined,fnDragend=undefined,dragDelay=400;
    let img;

    if(Thing && Thing.imgSrc){
        img = new Image(200);
        img.src=Thing.imgSrc;
    }
    const D = new Drag(id,{
        image:img,
        dragstart(e){
            e.dataTransfer.setData("text",Thing.id);
            e.dataTransfer.setData("Thing",JSON.stringify(Thing));
            e.dataTransfer.setData("state","START")
            console.log("Drag Start From the Drag Component")
            return e;
        },
        dragend(e){
            console.log("Drag End:",
                "State:" + D.state,
                "Status:" + D.status,
                "dropEffect:" + e.dataTransfer.dropEffect,
            );
            dragResult = D.status;
            setTimeout(()=>{
                if(fnDragend ) fnDragend(Thing.id, D.state);
                D.clear = dragResult="";
            },dragDelay);
        }
    });
    $: dragResult = D.status;

</script>
<div   
    id="{id}" 
    draggable   = "{D.draggable}"
    on:dragstart={D.dragstart}
    on:dragend  ={D.dragend}
    style="background-color:{Thing.color};"
     >
{#if dragResult}<div>{dragResult}</div>{/if}
<slot>
</slot>
</div>
<style>
    img{
        width:200px;
    }
    div{
        display:grid;
        justify-content: center;
        align-content: center;
        width:100%;
        height:100%;
        background-color:rgb(194, 140, 140);
        outline:1px solid rgb(206, 206, 206);
    }
</style>