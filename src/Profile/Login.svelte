<svelte:options customElement="usg-profile-login" />
<script>
  import {fnLogin,fnGetUser} from '/context/User';
  const U = {
    email:"",
    password:""
  }
  let User = fnGetUser();
  function onSubmit(){
    fnLogin(U);
  }
</script>

{#if User.isLoggedIn}
<div class="warning">Warning : Your current session will be reset!</div>
{/if}
<form action="login" method="get" on:submit|preventDefault={onSubmit}>
    <input type="email" name="email" bind:value="{U.email}" placeHolder="Email" /> 
    <input type="password" name="password" bind:value="{U.password}" placeHolder="Password" /> 
    <button type="submit">Login</button>
</form>
<style>
  form{
    display:grid;
    justify-content: center;
    gap:.5em;
    padding:0em 2em;
    margin:2em;
    background-color:var(--form-background-color);
    border-radius:var(--block-radius);
  }
</style>
