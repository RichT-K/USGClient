<svelte:options customElement="usg-profile-settings" />
<script>
    import { onDestroy } from 'svelte';
    import {fnSettings,fnGetUser} from '/context/User';
    let panelName = "Settings";
    let User = fnGetUser();
    let U = User.Settings;
    let policyNumber=1;
    let msg = "";
    onDestroy(()=>{User.Settings = U})
</script>
{@html User.fnChangesVerbiage(panelName)}
<div class="DOTTED" >
    <label><span>ID</span><input type="text" size="{U.userid.length}" readonly name="userid" value="{U.userid}"/></label>    
    <label><span>Name</span><input type="text" size="{U.fullName.length}" readonly name="fullName" bind:value="{U.fullName}"/></label>    
    <label><span>Alias</span><input type="text" required name="alias" bind:value="{U.alias}"/></label>    
    <label><span>Email</span><input size="{U.email.length}" type="text" readonly name="email" value="{U.email}"/></label>
    {#if !U.email}
    <p class="Verbiage">
      We do not keep sensitive data like email or password locally.
    </p>
    {/if}
    <div class="grid">
      <label><span class="capitalize">Show Changes Message ({User.showChangesMessage?"Yes":"no"})</span>
        <input type="checkbox" name="Alias" bind:checked="{User.showChangesMessage}"/>
      </label>

      <div>Limit Information You Share</div>
        <label><span class="capitalize">Alias (Yes)</span><input disabled type="checkbox" name="Alias" checked="true"/></label>
      {#each Object.entries(U.jShares) as [share,value]}
          <label><span class="capitalize">{share} ({value?"Yes":"no"})</span><input type="checkbox" name="jShares.{share}" checked="{value?true:false}"
              on:change={()=>{U.jShares[share]=U.jShares[share]?0:1;U=U;}} 
              value="{value}"/></label>
      {/each}
    </div>
    <div class="grid">
    <label title="Your question(max. 100 chars) to confirm it's you?">
      <span>Question(max. 100 chars) to confirm it's you?</span>
      <br><input type="text" required name="question" maxlength="100" bind:value="{U.question}"/>
    </label>
    <label title="The answer(max. 50 chars) to your question.">
      <span>The answer(max. 50 chars) to your question.</span>
      <br><input type="text" required name="secret" maxlength="50" bind:value="{U.secret}"/>
    </label>
  </div>
</div>
<style>
  [readonly]{
    text-align:right;
    border:0px solid black;
    outline:0px solid black;
    pointer-events: none;;
    cursor:unset;
  }
  .grid{
    margin:1em 0em;
    gap:inherit;
  }
  .Verbiage, .about-you{
    max-width:500px;
    max-height:fit-content;
  }
  .about-you .content{
    outline:1px solid rgb(219, 219, 219);
    padding:.5em .5em;
    max-height:500px;
    overflow:auto;
    transition:all .3s ease;
  }
  .about-you.hidden .content{
    max-height:0px;
  }
</style>
