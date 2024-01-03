import { User } from "/context/User";
import Home     from '/src/components/Home.svelte';
import NotFound from '/src/components/NotFound.svelte';
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
let path="/";
export const Routes = {
    [path]              :{text:"USGolfers ",  use:Home,       aProps:{User}},
    [path="/template"]  :{text:"Template",    use:Template,   aProps:{User}},
}
let jRoutes = Routes;
let Instance = NotFound;
let route="";
aPath.forEach((word,i)=>{
    route += ("/"+word);
    if(!jRoutes[route]) return;
    if(jRoutes[route].use) Instance = jRoutes[route].use;
    if(jRoutes[route].Routes) jRoutes = jRoutes[route].Routes;
});
export function Router(element){
    PageHistory.Page = route;
    let props = (jRoutes[route]||{}).aProps;
    new Instance({target:element,props});
}
export {Routes as Menu};