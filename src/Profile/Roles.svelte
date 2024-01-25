<svelte:options customElement="usg-profile-roles" />
<script>
    import { fnGetUser } from "/context/User";
    import { onMount, onDestroy } from 'svelte';
    let Roles={
        jTypes:{
            "golfer"        :{ ghin:"", handicap:0, description:"Enter you ghin and handicap." },
            "courseadmin"   :{ jCourses:{courseid:"", domain:""},description:"The domain for each course you'll administer."},
            "mapper"        :{ courseid:"",description:"Responsible for mapping the course and may set pins."},
            "pinsetter"     :{ courseid:"",description:"Responsible setting regular pin placements."},
            "editor"        :{ pseudonym:"",domain:"",description:"Editors create story ideas and content and offer comments for improvement."},
            "writer"        :{ pseudonym:"",domain:"",description:"Research and create article content."},
            "reviewer"      :{ description:"Provide feedback on articles, suggest improvements and makes a recommendations."},
            "podcast"       :{ description:"Provide access and content to a periodic podcast."},
            "producer"      :{ description:"Provide access and content to individual video content."},
            "moderator"     :{ description:"Addresses users' role requests and curates content."},
            "usgadmin"      :{ disabled:true, description:"" },
        },
        get Types(){ return this.jTypes},
    }
    let panelName="Roles";
    let User = fnGetUser();
    let jRoles = User.Settings.jRoles;
    for(let role in Roles.Types) if(User.getRole(role)) Roles.Types[role].disabled=true;
    onMount(()=>{
    })
    onDestroy(()=>{
        // Local clean up        
    });
    function fnRemoveRole(ev){
        let role = ev.target.getAttribute("data-role");
        User.Role = role;
        jRoles = User.Settings.jRoles;
        for(let role in Roles.Types){
            delete Roles.Types[role].disabled;
            delete Roles.Types[role].requested;
            delete Roles.Types[role].disabled;
            if(User.getRole(role)) 
                Roles.Types[role].disabled=true;
        }

        Roles=Roles;
    }
    function fnRemoveDataByIndex(ev){

    }
    function fnRoleRequest(ev){
        let role = ev.target.value;
        let jRole = {type:role,requested:true,...Roles.Types[role]};
        delete jRole.description;
        Roles.Types[role].disabled=true;
        jRoles[role] = jRole; 
        if( role == "golfer" && (!jRoles[role].ghin || jRoles[role].handicap == undefined) ) jRole.pending=true;
        if( role.match(/editor|writer|voice|actor/) && !jRoles[role].pseudonym )jRole.pending=true;
        jRoles = jRoles;
        for(let role in Roles.Types) if(User.getRole(role)) Roles.Types[role].disabled=true;
    }
    function fnRolePending(ev){
        let role = ev.target.value;
        if( role == "golfer" && (!jRoles[role].ghin || jRoles[role].handicap == undefined) ) return;
        if( role.match(/editor|writer|voice|actor/) && !jRoles[role].pseudonym ) return;
        delete jRoles[role].pending;
        jRoles = jRoles;
    }
</script>
<div class="DOTTED Verbiage" >
    {@html User.fnChangesVerbiage(panelName)}
    <div class="RoleTypes grid">
        <h2>Request Roles</h2>
{#each Object.entries(Roles.Types) as [role, Role]}
    {#if !Role.disabled && !User.getRole(role) }
            <label class="label">
                <span>{role}({Role.requested?"Yes":"no"})</span>
                <input value="{role}" type="checkbox" 
                on:change|preventDefault={fnRoleRequest}
                bind:checked={Role.requested}>
            </label>
            <div class="description">
                {Role.description}
            </div>
    {/if}
{/each}
    </div>
    <div class="RoleTypes grid">
        <h2>Pending Roles</h2>
{#each Object.entries(jRoles) as [role, Role]}
    {#if Role.pending}
        <div class="Object label">
            <span>{role} <input value="{role}" type="checkbox" bind:checked={Role.requested}></span>
            <button value="{role}" data-role="{role}" on:click|preventDefault="{fnRolePending}">Request</button>
        </div>
        <div class="ObjectMembers">
        {#each Object.entries(Role) as [field,value]}
            {#if field.match(/ghin|handicap|pseudonym|domain/) }
            <div class="label">
                <span>{field}</span>
                <input bind:value={Role[field]}/>
            </div>
            {/if}
        {/each}
        </div>
    {/if}
{/each}
    </div>
    <div class="Roles" >
    <h2>Your Roles</h2>
{#each Object.entries(jRoles) as [role, Role]}
    {#if Role.aData}
        <div class="label"><span>{role}</span></div>
        <div class="MemberData">
            {#each Role.aData as content,idx}
            <div class="label">
                <span>{content}</span>
                <button data-index="{idx}" on:click|preventDefault="{fnRemoveDataByIndex}">Remove</button>
            </div>
        {/each}
        </div>
    {:else}
        <div class="Object label">
            <span>{role}</span><button data-role="{role}" on:click|preventDefault="{fnRemoveRole}">Remove</button>
        </div>
        <div class="ObjectMembers">
        {#each Object.entries(Role) as [field,value]}
            <div class="label">
                <span>{field}</span>
                <input readonly value={value}/>
            </div>
        {/each}
        </div>
    {/if}
{/each}
    </div>
</div>
<style>
    .RoleTypes{
        gap:.5em;
    }
    .RoleTypes .description{
        gap:0em;
        opacity:0;
        max-height:0em;
        max-width:30em;
        overflow:hidden;
        padding:0em 1em;
        transition:all .01s ease-out, all .5s ease-in;
        margin-top:-.3em;
        margin-bottom:.5em;
        z-index:2;
    }
    .RoleTypes .label{
        margin-bottom:0em;
        z-index:1;
    }
    .RoleTypes .label:hover + .description, .RoleTypes .description:hover{
        opacity:1;
        overflow:visible;
        background-color:white;
        max-height:10em;
        outline:1px solid rgb(131, 131, 131);
    }
    .DOTTED{
        width:500px;
        min-width:35em;
        max-width:90vw;
        margin:0em;
        gap:1em;
    }
    input[readonly]{
        border:0px solid black;
        outline:0px solid black;
    }
    .MemberData{
        padding-left:1em;
    }
    .ObjectMembers{
        padding-left:1em;
    }
    .Roles{
        position:relative;
        display:grid;
        padding:.5em;
        outline:1px solid rgb(199, 199, 199);
        border-radius:5px;
    }
    .Roles > .label, .MemberData .label{
        margin-top:1em;
    }
    .label{
        display:grid;
    }
    .label span{
        text-transform: capitalize;
        overflow:hidden;
    }
    .label span:after{
        white-space:pre;
        width:calc( 100% - 8em);
        overflow:hidden;
    }
    .label .msg{
        grid-column-start: 1;
    }
    .Roles .label{
        grid-template-columns: 1fr auto;
    }
</style>
    