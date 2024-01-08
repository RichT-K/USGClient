import { fnGetUser } from "/context/User";
import Home     from '/src/components/Home.svelte';
import NotFound from '/src/components/NotFound.svelte';
import Latest from '/src/components/Latest.svelte';
import Profile from '/src/Profile/Profile.svelte';
import Template from '/src/components/Template.svelte';

export const PageHistory={
    get Pages(){
        return JSON.parse(sessionStorage["USG-PageHistory"]||"{}");
    },
    set Pages(jPages){
        sessionStorage["USG-PageHistory"] = JSON.stringify(jPages||{});
    },
    set Page(path){
        path = path||"/";
        let Pages = PageHistory.Pages;
        Pages[path] = Pages[path] ? (++Pages[path]) : 1;
        PageHistory.Pages = Pages;
    }
}

export const aPath = location.pathname.substr(1).toLowerCase().split("/");
export const root = "/" +(aPath[0] || "");
let validRoute="/";
let path="/";

let User = fnGetUser();
export const Routes = {
    [path]              :{text:"USGolfers ",  use:Home,     aProps:{User}},
}
if(User.isLoggedIn){
    if( root == "/" || root == "/profile" ){
        Routes[path="/profile"] = {text:"Profile",     use:Profile,  aProps:{aPath}};
    }
    Routes[path="/profile/logout"] = {text:"Logout", use:Profile,  aProps:{aPath}};
}
else{
    Routes[path="/profile/login"] = {text:"Login", use:Profile,  aProps:{aPath}};
}
Routes[path="/latest"] = {text:"Latest",      use:Latest,   aProps:{User}};
Routes[path="/template"]={text:"Template",    use:Template, aProps:{User}};

let jRoutes = Routes;
let Instance = NotFound;
let route="";
aPath.forEach((word,i)=>{
    route += ("/"+word);
    if(!jRoutes[route]) return;
    validRoute = route;
    if(jRoutes[route].use) Instance = jRoutes[route].use;
    if(jRoutes[route].Routes) jRoutes = jRoutes[route].Routes;
});
export function Router(element){
    PageHistory.Page =route;
    let props = (jRoutes[validRoute]||{}).aProps;
    new Instance({target:element,props});
}
export {Routes as Menu};