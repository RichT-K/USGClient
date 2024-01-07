<svelte:options customElement="usg-profile-login" />
<script>
  import {fnLogin,fnGetUser} from '/context/User';
  const U = {
    email:"",
    password:""
  }
  let User = fnGetUser();
  let message=undefined;
  function onSubmit(){
    message=undefined;
    fnLogin(U).then((jResp)=>{
      User = fnGetUser();
      if(jResp.errors){
        message = jResp.errors.join(" ");
      }
      else{
        message = User.alias + " you're logged in!";
      }
    });
  }
</script>

{#if User.isLoggedIn}
<div class="warning">Warning : Your current session will be reset!</div>
{/if}
{#if message}
<div>{message}</div>
{/if}
<form class="DOTTED" action="login" method="post" on:submit|preventDefault={onSubmit}>
  <label><span>Email</span>
    <input type="email" name="email" bind:value="{U.email}" placeHolder="Email" /> 
  </label>
  <label>
    <span>Password</span>
    <input type="password" name="password" bind:value="{U.password}" placeHolder="Password" /> 
  </label>
    <div>
      <button type="submit">Login</button>
      <button type="reset">Reset</button>
    </div>
</form>
<style>
</style>
