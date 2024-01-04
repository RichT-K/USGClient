<svelte:options customElement="usg-template-component" />
<script>
    import { onMount, onDestroy } from 'svelte';
    onMount(()=>{
        // Local initialization
        console.log("CustomElement: usg-template-component");
    })
    onDestroy(()=>{
        // Local clean up        
    });
</script>
<div>
    <h1>Template Component</h1>
    <p >
        This Template component makes it easy to create a new Svelte component. 
        It has the basic functionality and sections which can be stripped or augmented as needed.
    </p>
</div>
<style>
    p{
        margin:2em;
    }
</style>
    