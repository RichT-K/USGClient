<svelte:options customElement="usg-profile-roles" />
<script>
    import { fnGetUser } from "/context/User";
    import { onMount, onDestroy } from 'svelte';
    let panelName="Roles";
    let User = fnGetUser();
    let jRoles = User.Settings.jRoles;
    onMount(()=>{
    })
    onDestroy(()=>{
        // Local clean up        
    });
    function fnRemoveRole(ev){
        let role = ev.target.getAttribute("data-role");
        User.Role = role;
        jRoles = User.Settings.jRoles;
    }
    function fnRemoveDataByIndex(ev){

    }
</script>
<div class="DOTTED Verbiage" >
    {@html User.fnChangesVerbiage(panelName)}
    <div class="Roles" >
        <div>Your Roles</div>
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
    .DOTTED{
        width:500px;
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
    