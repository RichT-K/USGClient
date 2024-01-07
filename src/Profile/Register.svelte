<svelte:options customElement="usg-profile-register" />
<script lang="ts">
  import {EmailAttempts,fnRegister,fnValidForRegistration,fnGetUser,aInputPatterns} from '/context/User';
  const User = fnGetUser();
  let U = {
    email:"",
    password:"",
    fullName:"",
    alias:"",
    policy:0,
    answer:"",
    resp:"",
    question:"",
    secret:""
  }
  let message="";
  function onRegister(ev){
    if( U.resp !== U.answer ){
      message = "Try again!";
      return;
    }
    else if(!fnValidForRegistration(U)){
      message = "Invalid Form Values";
      return;
    }
    message = "";
    fnRegister(U).then((jResp)=>{
        console.log("jResp:",jResp);
        if(jResp.isRegistered){
          message="There's a problem Houston!"
        }
        else {
          U.resp="";  
          U.code = U.code || jResp.code ||"";
          U.answer = jResp.resp||"";
          U=U;  
        }
    })
  }
</script>
{#if User.isLoggedIn}
<div class="warning">Warning : Your current session will be reset!</div>
{/if}
<form class="DOTTED" action="login" method="get" on:submit|preventDefault={onRegister}>
    {#if message }
    <div><strong>{message}</strong></div>
    {/if}
    {#if U.answer !== ""}
      <div>Enter this value : {U.answer}</div>
      <input type="text" name="resp" bind:value="{U.resp}" placeHolder="Enter {U.answer} Here" /> 
    {/if}
    {#if true}
    <label><span>Email</span><input type="email" name="email" bind:value="{U.email}" placeHolder="Email" /></label> 
    <label title="Valid Chars: {aInputPatterns.password}" ><span>Password(8-16 chars)</span><input type="password" name="password" pattern="{aInputPatterns.password}" minlength=8 maxlength=16 bind:value="{U.password}" placeHolder="Password" /></label> 
    <label title="Valid Chars: {aInputPatterns.fullName}" ><span>Fullname(2+ names, A-Z,4-64 A-9\-)</span><input type="text" name="fullName" pattern="{aInputPatterns.fullName}" minlength=4 maxlength=64 bind:value="{U.fullName}" placeHolder="Full Name" /> </label>
    <label title="Valid Chars: {aInputPatterns.alias}"><span>Alias(1 name,1 A-Z,-16 A-9)</span><input type="text" name="alias" pattern="{aInputPatterns.alias}" minlength=2 maxlength=16 bind:value="{U.alias}" placeHolder="Alias" /> </label>
    <label><span>Policy Acceptance</span><input type="checkbox" value={1} bind:checked={U.policy} /></label>
    <label title="Your question(max. 100 chars) to confirm it's you?">
      <span>Question(max. 100 chars) to confirm it's you?</span>
      <br><input type="text" name="question" maxlength="100" bind:value="{U.question}"/>
    </label>
    <label title="The answer(max. 50 chars) to your question.">
      <span>The answer(max. 50 chars) to your question.</span>
      <br><input type="text" name="secret" maxlength="50" bind:value="{U.secret}"/>
    </label>
    {/if}
    <div>
      <button type="submit">Register</button>
      <button type="reset" on:click={()=>{U.answer="";}}>Reset</button>
    </div>
</form>
<style>
</style>
