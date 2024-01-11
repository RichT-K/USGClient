<svelte:options customElement="usg-profile-data" />
<script>
    import { fnGetUser,fnSettings } from "/context/User";
    import { onMount, onDestroy } from 'svelte';
    const maxDataLength=500;
    let panelName="Data";
    let User = fnGetUser();
    let jData = User.Settings.jData;
    let jField={name:"",value:""};
    $: jSize = {
        get length(){ return JSON.stringify(jData).length +(jField.name.length+jField.value.length) },
        get remaining(){ return maxDataLength-this.length; }
    }
    onMount(()=>{
        // Local initialization
        console.log("CustomElement: usg-template-component");
    })
    onDestroy(()=>{
        // Local clean up        
    });
    function fnAddField(){
        jData[jField.name.trim()]=jField.value.trim();
        jField.name=jField.value="";
        User.Data = jData=jData;
    }
    function fnRemoveField(ev){
        delete jData[ev.target.getAttribute("data-field")];
        User.Data = jData=jData;
    }
</script>
<div class="DOTTED Verbiage" >
    {@html User.fnChangesVerbiage(panelName)}
    <b>New Data</b>
    <div class="NewField" >
        <div class="label">
            <span>{jField.name}</span>
            <input type="text" size="3em" pattern={`^[A-Z][A-Za-z0-9 ]*[A-Za-z0-9]$`} name="field" minlength="2" maxlength="32" bind:value="{jField.name}" placeholder="Data Name(2-32 A-z) ">
            <button on:click|preventDefault="{fnAddField}">Add</button>
            <div class="msg">Invalid Value! Please Edit</div>
        </div>
        <input type="value" name="value" bind:value="{jField.value}">
    </div>
    <b>Your Data</b>
    <div class="label">
        <span class="Verbiage"><b>{jSize.remaining} characters remaining</b> </span>
    </div>
    <div class="DataFields" >
        <div>Your Data</div>
        {#each Object.entries(jData) as [field]}
        <div class="label">
            <span>{field}</span>
            <button data-field="{field}" on:click|preventDefault="{fnRemoveField}">Remove</button>
            <input type="value" name="value" bind:value="{jData[field]}">
            <div class="msg">Invalid Value! Please Edit</div>
        </div>
        {/each}
    </div>
</div>
<div class="Verbiage">
    {#each Object.entries(jData) as [field]}
        <p>{@html jData[field]}</p>
    {/each}
</div>
<style>
    .DOTTED{
        max-width:500px;
        margin:0em;
        gap:1em;
    }
    .NewField, .DataFields{
        position:relative;
        display:grid;
        padding:.5em;
        gap:2em;
        outline:1px solid black;
        border-radius:5px;
    }
    .label{
        display:grid;
    }
    .label span{
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
    .NewField .label{
        gap:.5em;
        grid-template-columns: auto 8em 5em;
    }
    .DataFields .label{
        grid-template-columns: auto 5em;
    }
    .NewField .label .msg{
        grid-column-end: 4;
    }
    .DataFields .label .msg{
        grid-column-end: 3;
    }
</style>
    