<svelte:options customElement="usg-worldview" />
<script>
    import "/public/styles/worldview.css";
    import { onMount, onDestroy } from 'svelte';
    import {jWorld,fnLoadDemographics} from "/context/Courses";
    import Course from "./lib/Course.svelte";

    let aWritersCategories=[
        {name:"Golf News",checked:true},
        {name:"Golf Tour",checked:true},
        {name:"Pod Casts",checked:false},
        {name:"Destinations",checked:false},
        {name:"Players",checked:true},
        {name:"Equipment",checked:false},
        {name:"Fly Overs",checked:false}
    ];
    let DropContainer, previousPosition=0;
    let jPanelData={section:"World",link:"Country",jCourseTypes:{}};
    let jSectionData, overDrop="";
    let jCountry,jRegion,jCity;
    onMount(()=>{
        // Local initialization
        fnLoadDemographics(jPanelData).then((jData)=>{
            console.log(jPanelData,jWorld);
            jSectionData = jData;
            jPanelData = {...jPanelData,jData:undefined};
            jWorld.courses = jWorld.courses;
        })
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
            if(jPanelData.courseid){jPanelData.link="Course";} 
            else if(jPanelData.cityid){jCity = jPanelData;jPanelData.section="City";jPanelData.link="Course";} 
            else if(jPanelData.regionid){jRegion = jPanelData;jPanelData.section="Region";jPanelData.link="City";}
            else if(jPanelData.countryid){jCountry = jPanelData;jPanelData.section="Country";jPanelData.link="Region";}
            else{jPanelData.section="World";jPanelData.link="Country";}
            jPanelData = {...jQuery,jData:undefined};
            jSectionData=jData;
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
        return false;
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
                <br>
                {jWorld.courses}
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
                <br>
                {jCountry.order}
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
                <br>
                {jRegion.order}
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
                <div>({jCity.order}) {jCity.city} </div>                
            </a>
{/if}
        </div>
{#if !jSectionData}
        <div>Loading ..Template.</div>
{:else}
        <div class="List {jPanelData.section}">
    {#each Object.entries(jSectionData) as [section,Data]}
            <a href 
                class="{jPanelData.link}" 
                on:click|preventDefault="{onClickCountry}"
                data-transfer="{jStrSectionSansData(jPanelData.section,Data)}" 
                on:dragstart="{onDragStart}"
                draggable="true"
                style="{Data.courseid?"":`order:${-Data.order};`}{jPanelData.link=="Country"?`background-image:url('/dist/images/flags/${Data.country}.png');`:""}"
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
                <div>{section}<br>{Data.order}</div>
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
                <div>{type} {courses}</div>
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
{#each aWritersCategories as Category, idx}
    {#if Category.checked}
                <article>
                    <button class="Focus toggle-open"  on:click|stopPropagation|preventDefault="{fnFocusArticle}" />
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
            </div>
        </div>
    </div>
    <div class="Guide grid">
        <div class="Actions">
            <label><span>Review</span><input type="checkbox"/></label>
        </div>
    {#if jPanelData.courseid}
        <div >Tee Times</div>
        {/if}
        {#each aWritersCategories as Category, idx}
            <div >
                <label><span>{Category.name}</span><input type="checkbox" bind:checked={Category.checked}/></label>
                <button>Add</button>
            </div>
        {/each}
    </div>
</div>
<style>
    .Guide{
        align-content:start;
        gap:2em;
    }
    .Guide > *{
        display: grid;
        gap: .2em;
        justify-items: stretch;
        grid-template-columns: 1fr auto;
        width: 90%;
    }
    .Guide .Actions{
        grid-template-columns: unset;
        grid-auto-flow: column;
        justify-content: center;
        align-content: center;
        width: 100%;
        height:2em;
        outline:1px solid black;
    }
</style>
    