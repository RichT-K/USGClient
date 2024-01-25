import { postPacketPromise } from "/lib/forms";
import { Articles } from "/context/Articles";
function fnEncrypt(str){
    let key = Math.ceil(Math.random()*96)+32;
    let c = String.fromCharCode(key);
    return c + str.split("").map((c,i)=>{
        return String.fromCharCode(((c.charCodeAt(0)-32)^(key+(i%9)))+32);
    }).join("");
}
function fnDecrypt(str){
    let key = str.charCodeAt(0);
    return str.substr(1).split("").map((c,i)=>{
        return String.fromCharCode(((c.charCodeAt(0)-32)^(key+(i%9)))+32);
    }).join("");
}
const sessionKey="USG-User";
const binKey="USG-bin";
const noattempts = "";
export const EmailAttempts={
    emails:{
        "failed@attempts.com":0
    },
    set Email(v){
        if( !v.indexOf("until|") ){
            for(let e in this.emails){
                if(!e.indexOf("until|")){
                    if(this.emails[e]>2)
                        this.emails["working@on.it"] = (this.emails["working@on.it"]||0) + 1;
                    v=e;
                    break;
                }
            }
        }
        this.emails[v] = (this.emails[v] || 0) + 1;
        localStorage[binKey]=fnEncrypt(JSON.stringify(this.emails));
    },
    get Emails(){
        if(localStorage[binKey])
            this.emails = JSON.parse(fnDecrypt(localStorage[binKey]));
        let emails={}
        Object.entries(this.emails).reverse().map(([k,v])=>{emails[k]=v});
        return emails;
    },
    get patience(){
        let aPatience=[
            "Give it another try!",
            "Stil no good?",
            "There are a lot of emails!",
            "Wow, you are persistent!",
            "Be Patient!",
            "Pretty Soon!",
            "Might be a While!",
            "Something could be wrong!",
            "We'll get back with you!",
            "The solution is in the mail.",
            "Check your mail box!",
            "Ask the carrier what the problem is!"
        ];
        return aPatience[this.emails["working@on.it"]] || "The ball's in your court!";  
    }
}
export const jNewUser = {
    userid:"",
    fullName:"",
    logins:0, 
    created:"", 
    lastLogin:"",
    alias:"",
    email:"", 
    removedEmail:"", 
    isLoggedIn:0, 
    isConfirmed:0, 
    CODE:"",
    ANSWER:"", 
    policy:0, 
    editorId:"", 
    ptLocation:"", 
    question:"",
    secret:"",
    jShares:{ name:0, loggedin:0, location:0, shares:0, preferences:0, courses:0, roles:0, data:0 }, 
    jCourses:{}, 
    jRoles:{},
    jBank:{},
    jData:{},
    jPreferences:{
        showChangesMessage:true
    },
}
let jUser = {};
export const User={
    get userid(){
        return jUser.userid;
    },
    get alias(){return jUser.alias;},
    get isLoggedIn(){return jUser.isLoggedIn?true:false;},
    get Settings(){
        let You = {
            ...jNewUser,
            ...jUser,
        };
        return You;
    },
    set Settings(jSettings){
        jUser = jSettings;
        saveUser( );
    },
    get About(){
        return this.fnAbout();
    },
    get canSaveArticle(){
        return this.isWriter
            && !Articles.rejected
            && !Articles.pending;
    },
    get isGolfer(){return this.isA("golfer");},
    get isUSGAdmin(){return this.isA("usgadmin");},
    get isEditor(){return this.isA("editor");},
    get isWriter(){return this.isA("writer");},
    get isReviewer(){return this.isA("reviewer");},
    get isAdmin(){return this.isA("courseadmin");},
    get isMapper(){return this.isA("mapper");},
    get isPinSetter(){return this.isA("pinsetter");},
    isA(role){
        let jRole = this.getRole(role);
        if(jRole) return jRole.requested?false:true;
    },
    get domain(){
        if( !this.isWriter) return "";
        return this.getRole("writer").domain || "";
    },
    getRole(role){
        if(!jUser || !jUser.jRoles) return;
        if(jUser.jRoles.usgadmin) return jUser.jRoles.usgadmin;
        if( jUser.jRoles.editor && role.match(/editor|writer|reviewer/) )
            return jUser.jRoles.editor;
        if( jUser.jRoles.writer && role.match(/writer|reviewer/) )
            return jUser.jRoles.writer;
        if( jUser.jRoles.courseadmin && role.match(/courseadmin|mapper|pinsetter/) )
            return jUser.jRoles.courseadmin;
        if( jUser.jRoles.mapper && role.match(/mapper|pinsetter/) )
            return jUser.jRoles.mapper;
        return jUser.jRoles[role];
    },
    set Role(Role){
        /* the Role.type is jRoles member and the Role is the data */
        if(Role.type){
            jUser.jRoles[Role.type] = JSON.parse(JSON.stringify(Role));
        }
        else if( typeof(Role) == "string" ){
            delete jUser.jRoles[Role];
        }
        saveUser( );
    },
    set Data(jData){
        jUser.jData = JSON.parse(JSON.stringify(jData));
        saveUser( );
    },
    get possessiveAlias(){
        return fnPossessiveName(jUser.alias);
    },
    get showChangesMessage(){return (jUser.jPreferences||{}).showChangesMessage?true:false },
    set showChangesMessage(tf){(jUser.jPreferences = (jUser.jPreferences||{})).showChangesMessage= tf?1:0 },
    hasACourse(courseid){
        if(jUser && jUser.jCourses)
        return this.hasA.call(jUser.jCourses,courseid);
    },
    hasA(thing, like, value){
        if(this[thing] !== undefined) {
            if(like===undefined) return this[thing];
            return this[thing] === like?true:false;
        }
        if(jUser[thing]){
            return User.hasA.call(jUser[thing],like, value);
        }
    },
    fnChangesVerbiage(panelName=""){
        if(!this.showChangesMessage) return "";
        if(panelName.toLowerCase()=="profile"){
            return `<div class="Verbiage warning text-align-center">You must return here and click <b>Update</b> 
            to save changes from the Profile Section up to the <b>Server</b>! 
            Otherwise, your temporary changes may be lost or become unusable especially when you <b>Logout</b>.</div>`;
        }
        return `<div class="Verbiage warning text-align-center">Changes made here in the <b>${panelName} ARE NOT</b> <b>saved to the Server.<br> 
        <b>Save changes to the Server in Settings</b></div>`;
    },
    fnVerbiage(jRole, jProxy){
        let Your = jProxy || jUser;
        return `As a Golfer you will be recognized by your Alias(<b>${Your.alias}</b>)${!Your.jShares.roles?", and though you do not share it":""}, 
        your <b>Handicap(${(jRole.handicap < 0 ? "+":"")+Math.abs(jRole.handicap)})</b> may be shared as may the <b>Courses</b>, <b>Locations</b>,
        and other <b>Event</b> information submitted by you through your participation.`; 
    },
    fnAbout(jProxy){
        let Your = jProxy || jUser;
        let jShares = Your.jShares||{};
        let jCourses = Your.jCourses||{};
        let jRoles = Your.jRoles||{};
        let aSharing = Object.keys(jShares).map(share=>("<b class='capitalize'>"+share +"</b>" + (jShares[share]?" <b>is</b>":" is <b>not</b>") + " shared"))
        aSharing = (aSharing.length?aSharing:['nothing else']);

        let aCourses = Object.entries(jCourses).map(([courseid,Course])=>(Course.type + " " + Course.name));
        aCourses = (aCourses.length?aCourses:['no courses']);

        let aRoles = Object.entries(jRoles).map(([role,Role])=>("<b class='capitalize'>"+Role.type+"</b>"));
        aRoles = (aRoles.length?aRoles:['user']);
        let aRoleGuidance=[];
        if(jRoles.golfer) aRoleGuidance.push(User.fnVerbiage(jRoles.golfer,Your)); 

        return `
<p data-section="Settings" title="Settings">
<b>${Your.alias||"No alias"}</b>, 
your fullname is <b>${Your.fullName||"unknown"}</b>,
your account was created on <b>${Your.created||"unavailable"}</b>,
you've logged in <b>${Your.logins||"0"}</b> times
and your last login was <b>${Your.lastLogin||"never"}</b>.
Your last known location was at the following coordinates (<b>${Your.location||"unknown"}</b>).

<div class="warning">You are ${Your.jPreferences.showChangesMessage?"":"<b>NOT</b>"} showing <b>Change Warnings</b>!</div>

</p>
<p data-section="Settings" title="Settings">
Your Alias (<b>${jUser.alias}</b>) will always be shared, ${aSharing.join(", ")}.
</p>
<p data-section="Roles" title="Roles">
Your roles include ${aRoles.join(", ")}.
<br/>${aRoleGuidance.join('<br/>')}
</p>
<p data-section="Golfer" title="Golfer">
You follow <b>${aCourses.join("</b>, <b>")}</b>.
</p>
<p data-section="Settings" title="Settings">
Your question is <b>${Your.question||"empty"}</b> and your answer is <b>${Your.secret||"empty"}</b>
</p>
`    
    }
}
export function fnPossessiveName(name){
    name = name || "User";
    return (name) +"'"+ (name.charAt(name.length-1)=='s'?"":"s");
}
function saveUser( drop ){
    if(drop) {
        jUser={...jNewUser};
        delete sessionStorage[sessionKey]; 
        return;
    } 
    sessionStorage[sessionKey] = fnEncrypt(JSON.stringify({...jUser}))
}
export function fnChangesVerbiage(panelName){ 
    return User.fnChangesVerbiage(panelName);
}
export function fnGetUser(){
    if(!jUser.userid ){
        if( sessionStorage[sessionKey] ){
            jUser = {...jNewUser,...JSON.parse(fnDecrypt(sessionStorage[sessionKey]))};
        }
        else{
            jUser = JSON.parse(JSON.stringify(jNewUser));
        }
        jUser.jShares={...jNewUser.jShares,...jUser.jShares};
    }
    return User;    
}
export const aInputPatterns={
    password:"[A-Za-z-0-9~!@#$%^&*()_+:;,.|=\-]{8,16}",
    fullName:"^(([A-Z][a-z]+) ([A-Z][a-z]* ){0,1}([A-Z][a-z]+(\-[A-Z][a-z]+){0,1}))$",
    alias:"[A-Z][A-Za-z]{1,15}",
    code:"[0-9]{8,8}"
};
function fnRandomCode(){
    return "99999999".split("").map(n=>(Math.floor(Math.random()*9)+1)).join("")
}
export function fnValidForRegistration(jData){
    return (
        jData.email !== "" 
        && jData.policy 
        && jData.password !== "" 
        && jData.password.length >= 8
        && jData.password.length <= 16 
    );
}
export function fnLogin(jFields){
    saveUser(true);
    return new Promise((resolve)=>{
        var jPacket = {
            url : "/api/submit.asp",
            method : "POST",
            action : "login",
            jForm : {
                action : "login",
                ...jFields,
            }
        };
        postPacketPromise(jPacket)
        .then((jResp)=>{
            jUser.userid = "empty";
            if(jResp.jUser){
                jUser = {...jResp.jUser};
                jUser.jShares={...jNewUser.jShares,...jUser.jShares};
                saveUser();
                console.log("Login:", jUser);
                resolve(jResp.jUser);
            }
            else{
                resolve(jResp);
            }
        });
    })
}
export function fnLogout(){
    var jPacket = {
        url : "/api/submit.asp",
        method : "POST",
        action : "logout",
        jForm : {
            action : "logout",
            userid:jUser.userid,
        }
    };
    jUser = {};
    saveUser(true);
    return postPacketPromise(jPacket)
    .then((jResp)=>{
        document.location="/";
        return(jResp);
    });
}
export function fnRegister(jFields){
    EmailAttempts.Email = jFields.email;
    if(!jFields.answer){
        var jPacket = {
            url : "/api/submit.asp",
            method : "POST",
            action : "code",
            jForm : {
                action : "code",
                code:fnRandomCode(),
                ...jFields,
            }
        };
        return postPacketPromise(jPacket)
        .then((jResp)=>{
            return(jResp);
        });
    }
    else if(fnValidForRegistration(jFields)){
        var jPacket = {
            url : "/api/submit.asp",
            method : "POST",
            action : "confirm",
            jForm : {
                action : "confirm",
                aActions:[{action:"signin"}],
                ...jFields,
            }
        };
        return postPacketPromise(jPacket)
        .then((jResp)=>{
            jUser = jResp.jUser;
            saveUser();
            //document.location="/profile";
            return(jUser);
        });
    }
}
export function fnSettings(jFields){
    console.log("Settings:",jFields);
    var jPacket = {
        url : "/api/submit.asp",
        method : "POST",
        action : "saveuser",
        jForm : {
            action : "saveuser",
            ...jFields,
            About:undefined,
        }
    };
    return postPacketPromise(jPacket)
    .then((jResp)=>{
        if(jResp.userid){
            jUser = jFields;
            saveUser();
            document.location="/profile";
        }
        return(jResp);
    });
}
export function fnForgotPassword(jFields){
    EmailAttempts.Email = jFields.email;
    if(!jFields.answer){
        var jPacket = {
            url : "/api/submit.asp",
            method : "POST",
            action : "code",
            jForm : {
                action : "code",
                code:fnRandomCode(),
                ...jFields,
            }
        };
        return postPacketPromise(jPacket)
        .then((jResp)=>{
            return(jResp);
        });
    }
    else {
        var jPacket = {
            url : "/api/submit.asp",
            method : "POST",
            action : "confirm",
            jForm : {
                action : "confirm",
                aActions:[{action:"forgotpassword"}],
                ...jFields,
            }
        };
        return postPacketPromise(jPacket)
        .then((jResp)=>{
            saveUser();
            document.location="/profile";
            return(jUser);
        });
    }
}
export function fnUpdateHandicap(jFields){
    if(jFields.ghin && jFields.handicap!==undefined){
        User.Role = {
            type:"golfer",
            ghin:jFields.ghin,
            handicap:jFields.handicap
        };
        saveUser();
    }
}
