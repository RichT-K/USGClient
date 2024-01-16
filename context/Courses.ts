import { readonly, writable } from "svelte/store";
import { postPacketPromise } from "/lib/forms.js";
function cCourses(){
    let jCourses = { 
    };
    const setCourses=(set)=>{
        set(jCourses);
    }; 
    const wCourses = writable(jCourses,setCourses);
    return {
        get(){return jCourses},
        get json(){return jCourses},
        push(newCourse){
            jCourses[newCourse.courseid] = {
                courseid: newCourse.courseid,
                lat: newCourse.lat,
                lng: newCourse.lng,
                type: newCourse.type,
                name: newCourse.name
            };
            wCourses.set(jCourses);
        },
        readonly(callback){ 
            const R = readonly(wCourses);
            return R.subscribe(callback);
        },
        post(){
            // fetch action:"usg-courses", userid, jCourses 
        },
        pull(){
            // fetch action:"usg-courses", lastpull:datetime, start:0,records:default 60, courseid, userid

            jCourses = JSON.parse( localStorage["USG-Courses"] || JSON.stringify(jCourses) );
        },
    }
}
const oCourses = cCourses();
export const jCourses = oCourses.json;
export const jWorld = JSON.parse( sessionStorage["USG-jWorld"] || JSON.stringify({}) );

function fnWorldSection(jObj){
    let jCopy={};
    if(typeof jObj == "object"){
        jCopy = jObj.join ? []:{};
        for(let o in jObj){
            if(o=="jData") continue;
            jCopy[o] = fnWorldSection(jObj[o]);
        }
    }
    else
        jCopy = jObj;
    return jCopy;
}

async function fLoad(jFields,jQuery,jCache,fnStore){
    return new Promise((resolve)=>{
        if(jCache.jData) return resolve(jCache.jData);
        jCache.jData={};
        var jPacket = {
            url : "/api/submit.asp",
            method : "POST",
            action : "demographics",
            jForm : {
                action : "demographics",
                pageSize : 500,
                ...jFields,
            }
        };
        postPacketPromise(jPacket)
            .then((jResp)=>{
                if(!jCache.jAccessed) jCache.jAccessed = jResp.jAccessed;
                let aResults = jResp.aResults||[];
                let N=-90,W=180,S=90,E=-180;
                aResults.forEach((element,idx) => {
                    let jData = {
                        order       : idx,
                        lat         : element.avgLat,
                        lng         : element.avgLng,
                        countryid   : element.countryid,
                        regionid    : element.regionid,
                        cityid      : element.cityid,
                        courseid    : element.courseid,
                        ctry        : element.ctry || jQuery.ctry,
                        country     : element.country || jQuery.country,
                        region      : element.region || jQuery.region,
                        city        : element.city || jQuery.city,
                        name        : element.name || ""
                    }
                    jData.title = jData.name || jData.city || jData.region || jData.country; 
                    if(jData.lat > N) N=jData.lat;
                    if(jData.lng < W) W=jData.lng;
                    if(jData.lat < S) S=jData.lat;
                    if(jData.lng > E) E=jData.lng;
                    if(element.jData){
                        jData.order = element.jData.courses;
                        jData.jCourseTypes = element.jData.jCourseTypes;

                    }
                    if(element.jCourses){
                        Object.entries(element.jCourses).forEach((X)=>{
                            X[1].lat=X[1].avgLat;X[1].lng=X[1].avgLng;
                        })
                        //jData.jCourses  = element.jCourses;
                    }
                    jCache.jData = fnStore(jCache.jData,jData,element);
                });
                let NW=[W,N],SE=[E,S];
                jQuery.aBounds = [NW,SE];
                console.log("aBounds:",jQuery.aBounds);
                resolve(jCache.jData);
            });
    })
}
export async function fnLoadDemographics(jQuery){
    if(!jQuery) return new Promise(()=>{
        return;
    });
    const jFields={
        country:jQuery.countryid,
        region:jQuery.regionid,
        city:jQuery.cityid,
    }
    jFields.cache = jQuery.cache == undefined?("World|"+Object.entries(jFields).filter(f=>(f[1]?f:undefined)).join("|")):jQuery.cache;

    return await fLoad(
        jFields,
        jQuery,
        jWorld,
        (jCountries,jData,element)=>{
            if(!jData.countryid){
                jWorld.jCourseTypes=jData.jCourseTypes;
                if(!jWorld.courses ){
                    jWorld.courses=0;
                    for(let type in jWorld.jCourseTypes){
                        jWorld.courses+=jWorld.jCourseTypes[type];
                    }
                }
            }
            else{
                jCountries[jData.ctry]=jData;
            }
            return jCountries;
        }
    )
    .then((jCountries)=>{
        if(!jWorld.aBounds){
            jWorld.aBounds = jQuery.aBounds;
            sessionStorage["USG-jWorld"] = JSON.stringify(jWorld);
        }
        if(!jQuery.countryid){
            jQuery.aBounds = jWorld.aBounds;
            return jCountries;
        }

        return fLoad(jFields,jQuery,jCountries[jQuery.ctry],(jRegions,jData,element)=>{
            jData.regionid = element.regionid;
            jRegions[jData.region] = jData;
            return jRegions;
        });
    },(jObj)=>{
        console.log("Countries jError?:",jObj);
    }).then((jRegions)=>{
        if(!jQuery.countryid) return jRegions;
        let jCountry = jWorld.jData[jQuery.ctry];
        if(!jCountry.jData){
            jCountry.jData = jRegions;
            jCountry.aBounds = jQuery.aBounds;
            sessionStorage["USG-jWorld"] = JSON.stringify(jWorld);
        }
        jQuery.aBounds = jCountry.aBounds;
        if(!jQuery.regionid) return jRegions;
        return fLoad(jFields,jQuery,jRegions[jQuery.region],(jCities,jData,element)=>{
            jData.regionid  = element.regionid;
            jData.cityid    = element.cityid;
            jCities[jData.city] = jData;
            return jCities;
        });
    },(jObj)=>{
        console.log("Regions jError?:",jObj);
    }).then((jCities)=>{
        if(!jQuery.regionid) return jCities;
        let jRegion = jWorld.jData[jQuery.ctry].jData[jQuery.region];
        if(!jRegion.jData){
            jRegion.jData = jCities;
            jRegion.aBounds = jQuery.aBounds;
            sessionStorage["USG-jWorld"] = JSON.stringify(jWorld);
        }
        jQuery.aBounds = jRegion.aBounds;
        if(!jQuery.cityid) return jCities;
        return fLoad(jFields,jQuery,jRegion.jData[jQuery.city],(jCourses,jData,element)=>{
            jData.order = 0;
            jData.lat=element.lat;
            jData.lng=element.lng;            
            jData.courseid  = element.courseid;
            jData.name      = element.name;
            jData.type      = element.type;
            jData.holes     = element.holes;
            jData.length    = element.length;
            jData.jCourse   = element.jCourse;
            // jData.jLayout  = element.jLayout;
            jCourses[jData.courseid] = jData;
            return jCourses;
        });
    },(jObj)=>{
        console.log("Cities jError?:",jObj);
    }).then((jData)=>{
        if(!jQuery.cityid) return jData;
        let jCity = jWorld.jData[jQuery.ctry].jData[jQuery.region].jData[jQuery.city];
        let N=-90,W=180,S=90,E=-180;
        for(let cid in jData){
            if(jData[cid].lat > N) N=jData[cid].lat;
            if(jData[cid].lng < W) W=jData[cid].lng;
            if(jData[cid].lat < S) S=jData[cid].lat;
            if(jData[cid].lng > E) E=jData[cid].lng;
        }
        let NW=[W,N],SE=[E,S];
        jQuery.aBounds = [NW,SE];
        if(!jCity.jData){
            jCity.jData = jData;
            jCity.aBounds = jQuery.aBounds;
        }
        sessionStorage["USG-jWorld"] = JSON.stringify(jWorld);
        return jData;
    },(jObj)=>{
        console.log("Final jError?:",jObj);
    });
}