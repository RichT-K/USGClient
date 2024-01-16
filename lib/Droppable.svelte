<svelte:options customElement="usg-droppable" />
<script>
    import {Drop} from '/lib/DragonDropon';
    export let id,classname="",replaceContent=undefined,fnDropped=undefined,Dropon=undefined;
    let dropping=false;
    Dropon = Dropon || new Drop(id,{
        dropped:fnDropped,
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
                "State:"+ e.dataTransfer.getData("state"),
                )
            dropping=false;
            e.dataTransfer.setData("state","DROPPED")
            return e;
        }
    });
</script>
<div   
    class="DROPON {classname} {dropping?"DROPCANDIDATE":""}"
    id="{id}" 
    droppable   = "{Dropon.droppable}"
    on:drop|preventDefault={Dropon.drop}
    on:dragover|preventDefault   ={Dropon.dragover}
    on:dragenter|preventDefault  ={Dropon.dragenter}
    on:dragleave|preventDefault  ={Dropon.dragleave}
     >
<slot />
</div>
<style>
    .DROPON{
        height:100%;
        min-height:100%;
        overflow:auto;
        margin-bottom:5em;
    }
    .DROPCANDIDATE{
        box-shadow:0px 0px .5em rgb(87, 87, 87);
    }
</style>