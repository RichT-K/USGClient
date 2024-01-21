<svelte:options customElement="usg-worldview" />
<script>
    import "/public/styles/worldview.css";
    import { onMount, onDestroy } from 'svelte';
    import { fnGetUser } from "/context/User";
    import {jWorld,fnLoadDemographics,fnGetCourseHead} from "/context/Courses";
    import Course from "./lib/Course.svelte";
    import Article from "./lib/Article/NewArticle.svelte";
    import LocationArticle from "./lib/Article/Location.svelte";

    const User = fnGetUser();
    let aWritersCategories=[
        {name:"Tee Times",checked:false,get hideWhen(){return !jPanelData.courseid},get canAdd(){ return User.isA("writer")}},
        {name:"Corrections",checked:false,get hideWhen(){return !User.isLoggedIn},get canAdd(){ return jPanelData.courseid && User.isA("writer") }},
        {name:"Golf News",checked:false,get canAdd(){ return User.isA("writer")}},
        {name:"Golf Tour",checked:false,get canAdd(){ return User.isA("writer")}},
        {name:"Golf History",checked:false,get canAdd(){ return User.isA("writer")}},
        {name:"Golf Fiction",checked:false,get canAdd(){ return User.isA("writer")}},
        {name:"Pod Casts",checked:false,get canAdd(){ return User.isA("writer")}},
        {name:"Destinations",checked:false,get canAdd(){ return User.isA("writer")}},
        {name:"Players",checked:false,get canAdd(){ return User.isA("writer")}},
        {name:"Equipment",checked:false,get canAdd(){ return User.isA("writer")}},
        {name:"Fly Overs",checked:false,get canAdd(){ return User.isA("writer")}}
    ];
    let jNewArticle = undefined;
    let jArticles = { };
    let DropContainer, previousPosition=0;
    let jPanelData={section:"World",link:"Country",jCourseTypes:{}};
    let jSectionData, overDrop="";
    let jCountry,jRegion,jCity;
    let jLocationData={
        stopShowingAt:9,
        aLocations:[],
        set Locations(jData){
            let self = this;
            self.stopShowingAt=9;
            self.title = `${(jData.city?(jData.city+", "):"")}${(jData.region?(jData.region+" "):"")}${(jData.country?jData.country:"The World")}`;
            self.courses        = jData.courses;
            self.jCourseTypes   = jData.jCourseTypes;
            self.aByHoles       = jData.aByHoles;
            self.aLocations     = jData.jCourses.sort((a,b)=>{ return a.courses > b.courses?-1:a.courses < b.courses?1:0});
            self.count          = self.aLocations.length-1;
            jLocationData= jLocationData;
        },
        get Locations(){ return this.aLocations}
    }
    onMount(()=>{
        // Local initialization
        fnLoadDemographics(jPanelData).then((jData)=>{
            console.log(jPanelData,jWorld);
            jSectionData = jData;
            jPanelData = {...jPanelData,jData:undefined};
            jLocationData.Locations = jPanelData;
        }).then(()=>{
            fnSetBackgrountImages();
        });
    })
    onDestroy(()=>{
        // Local clean up        
    });
    function onClickCountry(ev){
        onDrop(ev);
    }
    function onDragStart(ev){
        ev.dataTransfer.setData("transfer-data",ev.target.getAttribute("data-transfer"));
    }
    function onDragOver(ev){
        overDrop="OVER";
        return false;
    }
    function onDragLeave(ev){
        overDrop="";
        return false;
    }
    function onDrop(ev){
        overDrop="";
        if(ev.dataTransfer){
            jPanelData = JSON.parse(ev.dataTransfer.getData("transfer-data")||"{}");
        }
        else{
            jPanelData = JSON.parse(
                ev.target.getAttribute("data-transfer")
                || ev.currentTarget.getAttribute("data-transfer")
                ||"{}"
            );
        }
        aWritersCategories=aWritersCategories;
        if(jPanelData.courseid){
            jPanelData = {...jPanelData,...jSectionData[jPanelData.courseid]};
            jPanelData = jPanelData;
            return
        } 
        if(jPanelData.section == "World") jCountry = jRegion = jCity = undefined;
        if(jPanelData.section == "Country")   jRegion = jCity = undefined;
        if(jPanelData.section == "Region")    jCity = undefined;  
        let jQuery = jPanelData;
        fnLoadDemographics(jQuery).then((jData)=>{
            jLocationData.Locations = jQuery;
            if(jPanelData.courseid){jPanelData.link="Course";} 
            else if(jPanelData.cityid){jCity = jPanelData;jPanelData.section="City";jPanelData.link="Course";} 
            else if(jPanelData.regionid){jRegion = jPanelData;jPanelData.section="Region";jPanelData.link="City";}
            else if(jPanelData.countryid){jCountry = jPanelData;jPanelData.section="Country";jPanelData.link="Region";}
            else{jPanelData.section="World";jPanelData.link="Country";}
            jPanelData = {...jQuery,jData:undefined};
            jSectionData=jData;
        }).then(()=>{
            fnSetBackgrountImages();
        })
    }
    function jStrSectionSansData(section,jObj){
        return JSON.stringify({section, ...jObj, jData:undefined});
    }
    function fnFocusArticle(ev){
        if( ev.target.parentNode.classList.contains("OPENED") ){
            ev.target.parentNode.classList.toggle("OPENED");
            DropContainer.scrollTo(0,previousPosition);
            previousPosition=0;
        }
        else {
            if(document.querySelector(".OPENED"))
                document.querySelector(".OPENED").classList.remove("OPENED");
            previousPosition = DropContainer.scrollTop;
            ev.target.parentNode.classList.toggle("OPENED");
            DropContainer.scrollTo(0,0);
        }
        if(ev.target.parentNode.classList.contains("Location")){
            jLocationData.opened = ev.target.parentNode.classList.contains("OPENED")?"OPENED":"";
            jLocationData= jLocationData;
        }
        if(ev.target.parentNode.classList.contains("NEW-ARTICLE")){
            jNewArticle._class = ev.target.parentNode.classList.contains("OPENED")?"OPENED":"";
            jNewArticle=jNewArticle;
        }
        return false;
    }
    function fnAddArticle(ev){
        let category=ev.target.getAttribute("data-category");
        if(document.querySelector(".OPENED")) document.querySelector(".OPENED").classList.remove("OPENED");
        jNewArticle=undefined;
        setTimeout(()=>{
            jNewArticle = {
                _class:"OPENED",
                category:category,
                jTarget:{...jPanelData}
            };
        },100);
    }
    function fnSetBackgrountImages(){
        let I = setInterval(()=>{
            let nodes=0;
            document.querySelectorAll("[data-background-image]").forEach((node)=>{
                if(++nodes > 30) return; 
                node.style.backgroundImage = "url('"+node.getAttribute("data-background-image")+"')";
                node.removeAttribute("data-background-image")
            });
            if( !nodes) clearInterval(I);
        },100);
    }
</script>
<h1 class="text-align-center">USGolfers World View</h1>
<div class="grid WorldView">
    <div class="Directory">
        <div class="sticky Header"> 
            <a href class="World Flag"
                on:click|preventDefault="{onClickCountry}"
                data-transfer="{jStrSectionSansData("World",jWorld)}" 
                on:dragstart="{onDragStart}"
                style="background-image:url('/dist/images/icons/globe.png');"
                draggable="true" 
                    >Countries
                    <small>
                        {(jWorld.courses||0).withCommas()} courses
                    </small>
                <br>
            </a>
{#if jCountry}
        <a href class="Country Flag"
                style="background-image:url('/dist/images/flags/{jCountry.country}.png');"
                on:click|preventDefault="{onClickCountry}"
                data-transfer="{jStrSectionSansData("Country",jCountry)}"
                on:dragstart="{onDragStart}"
                draggable="true" 
                    >
                <div>{jCountry.ctry}
                    <small>
                        {@html `<br>${jCountry.country}`}
                        <br>{jCountry.order.withCommas()} course{jCountry.order >1?"s":""}
                    </small>
                </div>
            </a>
{/if}
{#if jRegion}
            <a href class="Region"
                on:click|preventDefault="{onClickCountry}"
                data-transfer="{jStrSectionSansData("Region",jRegion)}" 
                on:dragstart="{onDragStart}"
                draggable="true" 
                    >
                <div>{jRegion.region}
                    <small>
                        {jRegion.order.withCommas()} courses
                    </small>
                </div>                
            </a>
{/if}
{#if jCity}
            <a href class="City"
                on:click|preventDefault="{onClickCountry}"
                data-transfer="{jStrSectionSansData("Region",jCity)}" 
                on:dragstart="{onDragStart}"
                draggable="true" 
            >
                <div>
                    {jCity.city}
                    {jCity.order.withCommas()} courses
                </div>
            </a>
{/if}
        </div>
{#if !jSectionData}
        <div>Loading ..Article.</div>
{:else}
        <div class="List {jPanelData.section}">
    {#each Object.entries(jSectionData) as [section,Data]}
            <a href 
                class="{jPanelData.link}" 
                on:click|preventDefault="{onClickCountry}"
                data-transfer="{jStrSectionSansData(jPanelData.section,Data)}" 
                on:dragstart="{onDragStart}"
                draggable="true"
                data-background-image="{jPanelData.link=="Country"?`/dist/images/flags/${Data.country}.png`:""}"
                style="{Data.courseid?"":`order:${-Data.order};`}"
            >
            {#if Data.jCourse}
            <div>
                {Data.jCourse.name.replace(/�/g," ")}
                <br>
                {Data.jCourse.holes||"?"} Hole, 
                Par {Data.jCourse.par||"?"},
                {Data.jCourse.type}
            </div>
            {:else}
                <div>{section}
                    <small>
                    {@html jPanelData.link=="Country"?`<br>${Data.country}`:""}
                    <br>{Data.order.withCommas()} course{Data.order >1?"s":""}
                    </small>
                </div>
            {/if}
            </a>
    {/each}
        </div>    
{/if}
    </div>
    <div class="DropContainer {overDrop}" aria-dropeffect="drop" role="article"
        on:drop|preventDefault="{onDrop}"
        on:dragover|preventDefault   ={onDragOver}
        on:dragleave|preventDefault   ={onDragLeave}
        bind:this={DropContainer}
        >
        <div class="Panel  {jPanelData.section}"> 
            <ul class="Header">
                <li>
                    <span>{jPanelData.city||""}</span>
                    <span>{jPanelData.region||""}</span>
                    <span>{jPanelData.country||"The World"}</span>
                </li>
{#if jPanelData.courseid }
                <li>
                    <div>{jPanelData.name}</div>
                </li>
{:else}
                <li class="SubHeader">
    {#each Object.entries(jPanelData.jCourseTypes) as [type,courses]}
                <div>{type} {courses.withCommas()}</div>
    {/each}
                </li>
{/if}
{#if jPanelData.country }
                <li class="Flag"><img src='/dist/images/flags/{jPanelData.country}.png'/></li>
{:else}
                <li class="Flag"><img src='/dist/images/icons/globe.png'/></li>
{/if}
            </ul>
            <div class="Articles" >
{#if jPanelData.courseid }
                <article class="OPENED" >
                    <button class="Focus toggle-open"  on:click|stopPropagation|preventDefault="{fnFocusArticle}" />
                    <Course jData={jPanelData} jCourse={jPanelData.jCourse} />
                </article>
{/if}
{#if jLocationData.aByHoles}
                <article class="Location ">
                    <button class="Focus toggle-open"  on:click|stopPropagation|preventDefault="{fnFocusArticle}" />
                    <LocationArticle jLocationData="{jLocationData}" viewBy="holes" />
                </article>
{/if}
{#if jLocationData.Locations.length}
                <article class="Location ">
                    <button class="Focus toggle-open"  on:click|stopPropagation|preventDefault="{fnFocusArticle}" />
                    <LocationArticle jLocationData="{jLocationData}" viewBy="courses">
                    </LocationArticle>
                </article>
{/if}
{#each aWritersCategories as Category, idx}
    {#if Category.checked}
                <article>
                    <button class="Focus toggle-open"  on:click|stopPropagation|preventDefault="{fnFocusArticle}" />
{#if true}
                        <div class="flex Rating">
                            <span>Rate:</span>
                            <label>1 <input name="rating{Category.name}" type="radio" value={1} bind:group={Category.rating} /></label>
                            <label>2 <input name="rating{Category.name}" type="radio" value={2} bind:group={Category.rating} /></label>
                            <label>3 <input name="rating{Category.name}" type="radio" value={3} bind:group={Category.rating} /></label>
                            <label>4 <input name="rating{Category.name}" type="radio" value={4} bind:group={Category.rating} /></label>
                            <label>5 <input name="rating{Category.name}" type="radio" value={5} bind:group={Category.rating} /></label>
                        </div>
{/if}
                    <div class="Verbiage">
                        Retrieved a <b>{Category.name}</b> article<br> 
        {#if jPanelData.courseid}
                        specifically for <br><b>{jPanelData.name}</b>
        {:else}
                        relative to 
                        <b>{jPanelData.city||""}</b>
                        <b>{jPanelData.region||""}</b>
                        <b>{jPanelData.country||"The World"}</b>
        {/if}
                    </div>
                </article>
    {/if}
{/each}
{#if jNewArticle}
                <article class="OPENED NEW-ARTICLE">
                    <button class="Focus toggle-open"  on:click|stopPropagation|preventDefault="{fnFocusArticle}" />
                    <Article 
                        OPENED="{jNewArticle._class}" jArticle={jNewArticle} 
                        onCancel={()=>{jNewArticle=undefined;}}/>
                </article>
{/if}
            </div>
        </div>
    </div>
    <div class="Guide grid">
        {#if User.isLoggedIn}
        <div class="Actions">
            <label><span>Ideas</span><input type="checkbox"/></label>
            <label><span>Review</span><input type="checkbox"/></label>
        </div>
        {/if}
{#each aWritersCategories as Category, idx}
            <div >
                {#if !Category.hideWhen }
                <label><span>{Category.name}</span><input type="checkbox" bind:checked={Category.checked}/></label>
                    {#if Category.canAdd }
                        <button data-category={Category.name} on:click|preventDefault={fnAddArticle}>Add</button>
                    {/if}
                {/if}
            </div>
{/each}
    </div>
</div>
<style>
    .Rating{
        position:absolute;
        opacity:.3;
        right:0px;
        bottom:0px;
        background-color:white;
    }
    .Rating:hover,.Rating:active,.Rating:focus{
        background-color:rgb(198, 255, 238);
        opacity:1;
    }
    .NEW-ARTICLE.OPENED .toggle-open{
        opacity:.2;
        pointer-events: none;
    }
    .Guide{
        align-content:start;
    }
    .Guide > *{
        display: grid;
        margin:.5em 0em;
        gap: .2em;
        justify-items: stretch;
        grid-template-columns: 1fr auto;
        width: 90%;
    }
    .Guide .Actions{
        margin-top:0em;
        grid-template-columns: unset;
        grid-auto-flow: column;
        justify-content: center;
        align-content: center;
        width: 100%;
        height:2em;
        outline:1px solid black;
    }
</style>
    