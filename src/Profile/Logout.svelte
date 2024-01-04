<svelte:options customElement="usg-profile-logout" />
<script lang="ts">
  import {fnLogout,fnGetUser} from '/context/User';
  let User = fnGetUser();
</script>
<form method="get" on:submit|preventDefault={fnLogout}>
    <div class="warning">Warning : Your current session will be lost!</div>
    <button type="submit">Logout</button>
</form>
<style>
    h1{
        font-size:1.2em;
    }
  form{
    display:grid;
    justify-content: center;
    gap:.5em;
    padding:var(--block-padding);
    margin:var(--block-margin);
    background-color:var(--form-background-color);
    border-radius:var(--block-radius);
  }
</style>
