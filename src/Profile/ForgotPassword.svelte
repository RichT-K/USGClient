<svelte:options customElement="usg-forgot-password-login" />
<script>
  import {EmailAttempts,fnForgotPassword,fnGetUser,aInputPatterns} from '/context/User';
  let U = {
    email:"",
    password:"",
    answer:"",
    resp:"",
    question:"",
    secret:""
    
  }
  let User = fnGetUser();
  let message=undefined;
  function onSubmit(ev){
    if(EmailAttempts.Emails[U.email] > 3){
        message = EmailAttempts.patience;
        EmailAttempts.Email = `until|${new Date().getTime()}@wait.com`;
        return;
    }
    if( U.resp !== U.answer ){
      message = "Try again!";
      return;
    }
    message = "";
    fnForgotPassword(U).then((jResp)=>{
        U.resp="";  
        U.code = U.code || jResp.code ||"";
        U.question = jResp.question||"";
        U.answer = jResp.resp||"";
        U=U;  
    })
  }
</script>

{#if User.isLoggedIn}
<div class="warning">Warning : Your current password will be reset!</div>
{/if}
<form class="DOTTED" action="login" method="get" on:submit|preventDefault={onSubmit}>
    {#if message }
    <div><strong>{message}</strong></div>
    {/if}
    {#if U.answer !== ""}
      <div>Enter this value : {U.answer}</div>
      <input type="text" name="resp" bind:value="{U.resp}" placeHolder="Enter {U.answer} Here" /> 
      {#if U.question}
      <label title="Your Question: {U.question}" >
        <span>{U.question}</span>
        <br><input type="text" name="secret" maxlength="50" bind:value="{U.secret}" placeHolder="Enter your answer" />
      </label> 
      {/if}
    {:else}
    <label><span>Email</span><input type="email" name="email" bind:value="{U.email}" placeHolder="Email" /></label> 
    <label title="Valid Chars: {aInputPatterns.password}" ><span>Password(8-16 chars)</span><input type="password" name="password" pattern="{aInputPatterns.password}" minlength=8 maxlength=16 bind:value="{U.password}" placeHolder="Password" /></label> 
    <label><span>Policy Acceptance</span><input type="checkbox" value={1} bind:checked={U.policy} /></label>
    {/if}
    <div>
      <button type="submit">Replace</button>
      <button type="reset" on:click={()=>{U.answer=U.secret="";}}>Reset</button>
    </div>
</form>
<style>
</style>
