<svelte:options customElement="usg-droppable" />
<script>
    import {Drop} from '/lib/DragonDropon';
    export let id,classname="",replaceContent=undefined;
    let dropping=false;
    const D = new Drop(id,{
        dragenter(e){
            dropping=true;
        },
        dragleave(e){
            dropping=false;
        },
        drop(e){
            console.log("Drop From the Drop Component",
                e, 
                "Text:" + e.dataTransfer.getData("text"),
                "Thing:"+ e.dataTransfer.getData("Thing"),
                "State:"+ e.dataTransfer.getData("state"),
                )
            dropping=false;
            e.dataTransfer.setData("state","DROPPED")
            return e;
        }
    });
</script>
<div   
    class="{classname} {dropping?"DROPCANDIDATE":""}"
    id="{id}" 
    droppable   = "{D.droppable}"
    on:drop|preventDefault={D.drop}
    on:dragover|preventDefault   ={D.dragover}
    on:dragenter|preventDefault  ={D.dragenter}
    on:dragleave|preventDefault  ={D.dragleave}
     >
<slot />
</div>
<style>
    .DROPCANDIDATE{
        box-shadow:0px 0px  15px rgb(27, 46, 216);
    }
</style>