<svelte:options customElement="usg-profile-logout" />
<script lang="ts">
  import {fnLogout,fnGetUser,fnChangesVerbiage} from '/context/User';
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
  <p>{@html fnChangesVerbiage()}</p>
  <div class="button-block">
  <button type="submit">Logout</button>
  </div>
</form>
<style>
</style>
