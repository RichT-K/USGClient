<svelte:options customElement="usg-profile-settings" />
<script>
    import {fnSettings,fnGetUser} from '/context/User';
    let User = fnGetUser();
    let U = {
        ...User.Settings,
        get About(){
            return User.fnAbout(U);
        }
    }
    function onSubmit(){
        fnSettings(U);
    }
</script>
<div class="Verbiage">{@html U.About}</div>
<form class="DOTTED" action="login" method="get" on:submit|preventDefault={onSubmit}>

    <label><span>ID</span><input type="text" readonly name="userid" value="{U.userid}"/></label>    
    <label><span>Name</span><input type="text" name="name" bind:value="{U.name}"/></label>    
    <label><span>Alias</span><input type="text" name="displayName" bind:value="{U.displayName}"/></label>    
    <label><span>Email</span><input size=30 type="text" readonly name="email" value="{U.email}"/></label>
    {#if !U.email}
    <p class="Verbiage">
      We do not keep sensitive data like email or password locally.
      When live and fully connecting to the api they will be more accessable.
    </p>
    {/if}

    <label><span>Policy</span><input size=1 type="text" readonly name="policy" value="{U.policy||0}"/></label>

    {#each Object.entries(U.jShares) as [share,value]}
        <label><span class="capitalize">{share} ({value?"Yes":"no"})</span><input type="checkbox" name="jShares.{share}" checked="{value?true:false}"
            on:change={()=>{U.jShares[share]=U.jShares[share]?0:1;U=U;}} 
            value="{value}"/></label>
    {/each}

    <div><button type="submit">Update</button></div>
</form>
<style>
  form{
    display:grid;
    min-width:fit-content;
    justify-self: start;
    justify-content: start;
    gap:.5em;
    padding:2em 0em;
    margin:2em 0em;
    background-color:var(--form-background-color);
    border-radius:var(--block-radius);
  }
  form label{
    overflow:hidden;
    display:grid;
    justify-self: start;
    min-width:500px;
    grid-template-columns:1fr auto;
  }
  .Verbiage{
    min-width:300px;
    max-width:600px;
  }
</style>
