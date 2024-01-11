<svelte:options customElement="usg-profile-settings" />
<script>
  import { parse } from 'svelte/compiler';
    import {fnSettings,fnGetUser} from '/context/User';
    let panelName = "Settings";
    let User = fnGetUser();
    let U = {}
    let policyNumber=1;
    let msg = "";
    function fnReset(){
      U = {
          ...JSON.parse(JSON.stringify(User.Settings)),
          get About(){
              return User.fnAbout(U);
          }
          ,policy:0
      }
    }
    fnReset();
    function onSubmit(){
      msg = "";
      if(!U.policy) return msg="Policy acceptance is necessary.";
      U.policy = U.policy?policyNumber:0;
      fnSettings(U);
    }
</script>
<p class="Verbiage">{@html User.fnChangesVerbiage(panelName)}</p>
<form class="DOTTED" action="login" method="get" on:submit|preventDefault={onSubmit}>
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
      <div>Limit Information Shared</div>
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
  <div class="about-you Verbiage ">
    <div class="content">{@html U.About}</div>
  </div>
  <div class="grid">
    <label>
      <span>Accept Policy</span>
      <input size=1 type="checkbox" required name="policy" bind:checked={U.policy} value="{policyNumber}"/>
    </label>
  </div>
  <div>{msg}</div>
  <div class="button-block">
      <button type="submit">Update</button>
      <button type="reset" on:click={fnReset}>Reset</button>
  </div>
</form>
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
    max-height:500px;
    overflow:auto;
    transition:all .3s ease;
  }
  .about-you.hidden .content{
    max-height:0px;
  }
</style>
