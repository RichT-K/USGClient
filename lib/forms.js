function validateFormField(element){
    if( element.name){
        let jField = {name:element.name}
        let required = element.getAttribute("required");
        if( element.value !== undefined ){
            let test = String(element.value).replace(/ /g,"")
            if(required && !test) (jField.aIssues=[...jField.aIssues]).push("Value is required");
            jField.value = String(element.value).replace(/ /g,"+");
            return jField;
        }
    }
}
function getFormPacket(form){ 
    const formName = form.getAttribute("name");
    var jPacket = {
        url : form.action,
        method : form.getAttribute("method"),
        action : formName,
        jForm : {
            action : formName
        },
        aIssues:[]
    };
    if( form.elements ){
        for(var i=0;i < form.elements.length; i++){
            var element = form.elements[i];
            let jField = validateFormField(element);
            if( jField && !jField.aIssues && jField.value){
                jPacket.jForm[jField.name] = jField.value;
            }
        }
        //console.log("jForm:",jPacket.jForm)
    }
    return jPacket;
}
const Posts = [];
const CachedResults = {

}
function postPacketPromise(jPacket){
    var data="";
    var nocache=false;
    var jHeaders={
        "usg-post":Posts.length,
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 'Content-Type': 'application/x-www-form-urlencoded',
    }
    if(jPacket.jForm){
        const AMP = "_amp_";
        const strForm = JSON.stringify(jPacket.jForm).replace(/&/g,AMP);
        jPacket.length = strForm.length;
        if( jPacket.jForm["content-type"] ){
            jHeaders["content-type"] = jPacket.jForm["content-type"];
        }
        const action = (jPacket.jForm.action || jPacket.action);
        data = "length="+jPacket.length
             + "&action="+action
             + "&data="+strForm.replace(/ /g,"%20")
        nocache = jPacket.jForm.nocache?true:false;
        if(action == 'load-course-structure' || action == 'lookup-course' || action == 'lookup-tees'){
            nocache = true;
            if(!nocache && CachedResults[data]){
                return new Promise( ()=>{
                    success(CachedResults[data]);
                    return CachedResults[data];
                },() => undefined );
            }
        }
    }
    const jPost ={
        url: jPacket.url||"/api/submit.asp",
        packet:{
            method: jPacket.method || 'POST',
            mode: 'same-origin', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'omit', // include, *same-origin, omit
            headers: jHeaders,
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body:data
        }
    };
    Posts.push( jPost );

    return fetch( jPost.url, jPost.packet )
    .then( function(response){
        if(jPacket.isSvg){
            return response.text();
        }
        return response.json();
    }).then((jData)=>{
        if(!nocache){
            CachedResults[data] = jData;
        }
        return jData;
    })
}
export {
    getFormPacket,
    postPacketPromise
}
