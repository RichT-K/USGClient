import { getFormPacket, postPacketPromise } from "/lib/forms";
const sessionKey="USG-User";
export const jNewUser = {
    userid:"",
    name:"",
    logins:0, 
    created:"", 
    lastLogin:"",
    displayName:"",
    email:"", 
    removedEmail:"", 
    isLoggedIn:0, 
    isConfirmed:0, 
    CODE:"",
    ANSWER:"", 
    policy:0, 
    editorId:"", 
    ptLocation:"", 
    jShares:{shares:0,location:0,courses:0,roles:0}, 
    jCourses:{}, 
    jRoles:{},
    jBank:{}
}
let jUser = {};
export const User={
    get userid(){
        return jUser.userid;
    },
    get alias(){return jUser.displayName;},
    get isLoggedIn(){return jUser.isLoggedIn?true:false;},
    get Settings(){
        let You = {
            ...jNewUser,
            ...jUser,
        };
        return You;
    },
    get About(){
        return this.fnAbout();
    },
    fnAbout(jProxy){
        let Your = jProxy || jUser;
        let jShares = Your.jShares||{};
        let jCourses = Your.jCourses||{};
        let jRoles = Your.jRoles||{};
        let aSharing = Object.keys(jShares).map(share=>((jShares[share]?"":"not ") + "sharing " + share))
        aSharing = (aSharing.length?aSharing:['sharing nothing']);

        let aCourses = Object.entries(jCourses).map(([courseid,Course])=>(Course.type + " " + Course.name));
        aCourses = (aCourses.length?aCourses:['no']);

        let aRoles = Object.entries(jRoles).map(([role,Role])=>(Role.type));
        aRoles = (aRoles.length?aRoles:['user']);
        return `
<p>
<b>${Your.displayName||"No alias"}</b>, 
your fullname is <b>${Your.name||"unknown"}</b>,
your account was created on <b>${Your.created||"unavailable"}</b>,
you've logged in <b>${Your.logins||"0"}</b> times
and your last login was <b>${Your.lastLogin||"never"}</b>.
Your last known location was at the following coordinates (<b>${Your.location||"unknown"}</b>).
</p>
<p>
You are <b>${aSharing.join("</b>, <b>")}.
Your roles include <b>${aRoles.join("</b>, <b>")}</b>.
You follow <b>${aCourses.join("</b>, <b>")}</b>.
</p>
`    
      }
}
function saveUser(){
    sessionStorage[sessionKey] = JSON.stringify({...jUser,email:undefined});
}
export function fnGetUser(){
    if(!jUser.userid ){
        jUser = JSON.parse(sessionStorage[sessionKey]||JSON.stringify(jNewUser));
    }
    return User;    
}
export function fnLogin(jFields){
    jUser={...jNewUser};
    saveUser();
    return new Promise((resolve)=>{
        var jPacket = {
            url : "/api/submit.asp",
            method : "POST",
            action : "login",
            jForm : {
                action : "login",
                pageSize : 500,
                ...jFields,
            }
        };
        postPacketPromise(jPacket)
        .then((jResp)=>{
            jUser.userid = "empty";
            if(jResp.jUser){
                jUser.userid = jResp.jUser.userid;
                jUser.name = jResp.jUser.name;
                jUser.displayName = jResp.jUser.displayName||"";
                jUser.logins = jResp.logins;
                jUser.isLoggedIn = jResp.jUser.isLoggedIn;
                saveUser();
                // email is not saved
            }
            location.pathname="/profile";
            resolve(jResp.jUser || {});
        });
    })
}
export function fnLogout(){
    jUser.name;
    jUser.isLoggedIn = 0;
    saveUser();
    document.location="/";
}
export function fnRegister(jFields){
    return new Promise((resolve,reject)=>{
        if(!jFields.code){
            resolve({...jFields,code:1234,answer:5678});
            return;
        }
        else if( jFields.resp == jFields.answer){
            jFields.userid=1;
            jUser = jFields;
            saveUser();
            document.location="/profile";
        }
        resolve({});
    } );
}
export function fnSettings(jFields){
    console.log("Settings:",jFields);
    jUser = {...jUser,...jFields};
    sessionStorage[sessionKey] = JSON.stringify(jUser);
}
