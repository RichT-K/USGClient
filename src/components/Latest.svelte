<svelte:options customElement="usg-latest-component" />
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
    <h1>Latest Work</h1>
    <p>
        After writing a good bit of the NextUp and History component I remembered that GitHub has a very nice Project 
        area which I can also query. So I canned the NextUp and will build the Project query at another time.
        Though, I did create a "nextup-component" branch to preserve the work which may come in handy.
        So, I am back at the real work of this project - the USGolfers Web Application employing Svelte components.
    </p>
    <h4>USGClient:</h4>
        <ul>
            <li>Add Register, Login and Logout with Routing</li>
            <li>Handlers in the User for sessionStorage and USGServer interfacing</li>
        </ul>
    <h4>USGServer:</h4>
        <ul>
            <li>Add a FormProcesser to respond to Submissions</li>
            <li>Add handlers to communicate with USGAPI</li>
        </ul>
    <h4>USGAPI:</h4>
        <ul>
            <li>Add entry points to process USGServer requests</li>
            <li>Create a User Table and SQL calls</li>
            <li>Use the existing Database Interface</li>
        </ul>
</div>
<style>
    p{
        max-width:600px;
        margin:2em;
    }
</style>
    