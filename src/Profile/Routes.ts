import Login from "./Login.svelte";
import Logout from "./Logout.svelte";
import Register from "./Register.svelte";
export const Routes = {
    login:{name:"Login",Svelte:Login},
    logout:{name:"Logout",Svelte:Logout},
    register:{name:"Register",Svelte:Register},
}