<svelte:options customElement="usg-profile-register" />
<script lang="ts">
  import {fnRegister,fnGetUser} from '/context/User';
  const User = fnGetUser();
  const U = {
    email:"",
    password:"",
    name:"",
    fullName:"",
    code:"",
    answer:"",
    resp:""
  }
  function onRegister(ev){
    fnRegister(U).then((jResp)=>{
        console.log("jResp:",jResp);
        U.resp="";  
        U.code = jResp.code;  
        U.answer = jResp.answer;  
    })
  }
</script>
{#if User.isLoggedIn}
<div class="warning">Warning : Your current session will be reset!</div>
{/if}
<form action="login" method="get" on:submit|preventDefault={onRegister}>
    {#if U.code && U.answer}
        <div>Answer : {U.answer}</div>
        <input type="text" name="resp" bind:value="{U.resp}" placeHolder="Answer Here" /> 
    {:else}
    <input type="email" name="email" bind:value="{U.email}" placeHolder="Email" /> 
    <input type="password" name="password" bind:value="{U.password}" placeHolder="Password" /> 
    <input type="text" name="fullname" bind:value="{U.fullName}" placeHolder="Full Name" /> 
    <input type="text" name="name" bind:value="{U.name}" placeHolder="Display Name" /> 
    {/if}
    <button type="submit">Register</button>
</form>
<style>
  form{
    display:grid;
    justify-content: center;
    gap:1em;
    padding:var(--block-padding);
    margin:var(--block-margin);
    background-color:var(--form-background-color);
    border-radius:var(--block-radius);
  }
</style>
