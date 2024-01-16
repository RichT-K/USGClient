<svelte:options customElement="usg-template-component" />
<script>
    import { onMount, onDestroy } from 'svelte';
    //import {jWorld,fnLoadDemographics} from "/context/Courses";
    export let something=false;
    onMount(()=>{
        // Local initialization
        console.log("CustomElement: usg-template-component");
    })
    onDestroy(()=>{
        // Local clean up        
    });
</script>
<div class="Template" >
    Nothing Here
</div>
<style>
</style>
    