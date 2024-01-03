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
    <p >
        For this branch I'll briefly explained what I've changed and added.
        <br> Created a basic Router with a session PageHistory for fun.
        <br> Create a stub for a User.
        <br> Imported the Routes and Router into the App and basic Nav Menu from Routes.  
        <br> Created a Template Component to make the job of creating new templates easier.
        <br> Created a Home Component and moved the contents of the app into it.
        <br> Created a Page Not Found Component.
        <br> Added some root variables and styled "a" tags in the default css. I got tired of the green background.
        <br> Updated the Template with this explanation.
    </p>
    <p >
        <b>Next In USGClient :</b>
        <br> I'll create a Next Up Component and Route making it easier to perform this task.
        <br>I'll add Register, Login and Logout Routing.
        <br>Responder methods in User for sessionStorage and USGServer interfacing. 
    </p>
    <p >
        <b>Next In USGServer :</b>
        <br>I'll add a FormProcesser to respond to Submissions.
        <br>Add handlers to communicate with USGAPI. 
    </p>
    <p >
        <b>Next In USGAPI :</b>
        <br>I'll add entry points to process USGServer requests.
        <br>Create a User Table and SQL calls.
        <br>I'll use my existing Database Interface.
    </p>
</div>
<style>
    p{
        margin:2em;
    }
</style>
    