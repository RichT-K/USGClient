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
            <li>Added Register, Login, Logout and ForgotPassword with Routing Local To Profile</li>
            <li>Added Handlers in the User for sessionStorage and USGServer interfacing</li>
            <li>Added Settings component to allow editing Profile fields</li>
            <li>Added basic sharing flags for FullName, Location, Courses, Roles and Sharing</li>
            <li>Added a verbiage about the User using their settings.</li>
            <li>Added Question and Answer fields each user can ask and change to verify them self.</li>
            <li></li>
        </ul>
    <h4>USGServer:</h4>
        <ul>
            <li>Added a FormProcesser to respond to Submissions</li>
            <li>Added handlers to communicate with USGAPI</li>
            <li>Added code/answer for registration confirmation applying question/secret for password regeneration.</li>
            <li></li>
        </ul>
    <h4>USGAPI:</h4>
        <ul>
            <li>Added entry points to process USGServer requests</li>
            <li>Created a User Table and SQL interfacing</li>
            <li>Used the existing Database Interface</li>
            <li></li>
        </ul>
</div>
<style>
    p{
        max-width:600px;
        margin:2em;
    }
</style>
    