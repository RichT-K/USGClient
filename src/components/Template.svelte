<svelte:options customElement="usg-template-component" />
<script>
    import { onMount, onDestroy } from 'svelte';
    export let Thing={}; 
    onMount(()=>{
        // Local initialization
        console.log("CustomElement: usg-template-component");
    })
    onDestroy(()=>{
        // Local clean up        
    });
</script>
<div class="Thing">
    <h1>{Thing.text}</h1>
    <div>ID: {Thing.id}</div>
    <div style="background-color:{Thing.color};" >
        {#each Thing.aContents as content}
        <p>{@html content}</p>
        {/each}
    </div>
</div>
<style>
    .Thing{
        width:600px;
    }
    p{
        margin:2em;
    }
</style>
    