<svelte:options customElement="usg-draggable" />
<script>
    import {Drag} from '/lib/DragonDropon';
    export let 
        id, 
        Thing=undefined,
        fnDragend=undefined,
        fnDropped=undefined,
        fnNoChange=undefined,
        fnThrown=undefined,
        Dropon=undefined,
        data=undefined,
        dragDelay=400;
    let img;

    if(Thing && Thing.imgSrc){
        img = new Image(200);
        img.src=Thing.imgSrc;
    }
    const Dragon = new Drag(id,{
        image:img,
        Dropon,
        data,
        dragstart(e){
            e.dataTransfer.setData("text",Thing.id);
            e.dataTransfer.setData("Thing",JSON.stringify(Thing));
            e.dataTransfer.setData("state","START")
            console.log("Drag Start From the Drag Component")
            return e;
        },
        dragend(e){
            console.log("Drag End:",
                "State:" + Dragon.state,
                "Status:" + Dragon.status,
                "dropEffect:" + e.dataTransfer.dropEffect,
            );
            dragResult = Dragon.status;
            setTimeout(()=>{
                if(fnDragend ) fnDragend(Thing.id, Dragon.state);
                Dragon.clear = dragResult="";
            },dragDelay);
        },
         dropped : fnDropped,
         nochange: fnNoChange,
         thrown  : fnThrown
    });
    $: dragResult = Dragon.status;

</script>
<div   
    id="{id}" 
    draggable   = "{Dragon.draggable}"
    on:dragstart={Dragon.dragstart}
    on:dragend  ={Dragon.dragend}
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