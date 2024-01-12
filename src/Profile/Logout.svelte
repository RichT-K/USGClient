<svelte:options customElement="usg-profile-logout" />
<script lang="ts">
  import {fnLogout,fnGetUser} from '/context/User';
  let message=undefined;
  let User = fnGetUser();
  if( User.isLoggedIn){
    message= "Warning : Your current session will be lost!";
  }
</script>
  {#if message}
  <div class="message-block"><b>{message}</b></div>
  {/if}
<form class="grid standard-block" method="get" on:submit|preventDefault={fnLogout}>
  <p class="Verbiage warning"><b>Have you saved all your updates?</b></p>
  <div class="button-block">
  <button type="submit">Logout</button>
  </div>
</form>
<style>
</style>
