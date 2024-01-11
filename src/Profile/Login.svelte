<svelte:options customElement="usg-profile-login" />
<script>
  import {fnLogin,fnGetUser} from '/context/User';
  const U = {
    email:"",
    password:""
  }
  let message=undefined;
  let User = fnGetUser();
  if( User.isLoggedIn){
    message= "Warning : Your current session will be reset!";
  }
  function onSubmit(){
    message=undefined;
    fnLogin(U).then((jResp)=>{
      User = fnGetUser();
      if(jResp.errors){
        message = "Hmm, that didn't work " + jResp.errors.join(" ");
      }
      else{
        message = User.alias + " you're logged in!";
        setTimeout(()=>{
          location="/profile";
        },2000);
      }
    });
  }
</script>

{#if message}
<div class="message-block">{message}</div>
{/if}
<form class="DOTTED" action="login" method="post" on:submit|preventDefault={onSubmit}>
  <label><span>Email</span>
    <input type="email" name="email" bind:value="{U.email}" placeHolder="Email" /> 
  </label>
  <label>
    <span>Password</span>
    <input type="password" name="password" bind:value="{U.password}" placeHolder="Password" /> 
  </label>
    <div class="button-block flex">
      <button type="submit">Login</button>
      <button type="reset">Reset</button>
    </div>
</form>
<style>
</style>
