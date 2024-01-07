<svelte:options customElement="usg-profile-settings" />
<script>
  import { parse } from 'svelte/compiler';
    import {fnSettings,fnGetUser} from '/context/User';
    let User = fnGetUser();
    let U = {}
    function fnReset(){
      U = {
          ...JSON.parse(JSON.stringify(User.Settings)),
          get About(){
              return User.fnAbout(U);
          }
      }
    }
    fnReset();
    function onSubmit(){
        fnSettings(U);
    }
</script>
<div class="Verbiage">{@html U.About}</div>
<form class="DOTTED" action="login" method="get" on:submit|preventDefault={onSubmit}>

    <label><span>ID</span><input type="text" readonly name="userid" value="{U.userid}"/></label>    
    <label><span>Name</span><input type="text" readonly name="fullName" bind:value="{U.fullName}"/></label>    
    <label><span>Alias</span><input type="text" name="alias" bind:value="{U.alias}"/></label>    
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
    <label title="Your question(max. 100 chars) to confirm it's you?">
      <span>Question(max. 100 chars) to confirm it's you?</span>
      <br><input type="text" name="question" maxlength="100" bind:value="{U.question}"/>
    </label>
    <label title="The answer(max. 50 chars) to your question.">
      <span>The answer(max. 50 chars) to your question.</span>
      <br><input type="text" name="secret" maxlength="50" bind:value="{U.secret}"/>
    </label>

    <div>
      <button type="submit">Update</button>
      <button type="reset" on:click={fnReset}>Reset</button>
    </div>
</form>
<style>
</style>
