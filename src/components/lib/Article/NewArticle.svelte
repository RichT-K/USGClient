<svelte:options customElement="usg-article" />
<script>
    import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
    import EditorMenu from '../Tiptap/Menu.svelte';
    import {fnGetUser} from "/context/User";
    //import {jWorld,fnLoadDemographics} from "/context/Courses";
    let User = fnGetUser();
    export let jArticle={}, OPENED="", onSave=undefined, onCancel=undefined;
    jArticle.author   = jArticle.author || User.pseudoname || User.alias;
    jArticle.aTags    = [jArticle.category.toLowerCase()];

    let jEdits = {
        _tag:"",
        _date : new Date(jArticle.date||Date()).toGMTString().substr(0,16),
        _approved:"",
        ordinal:1,
        series:"",
        jSeries: jArticle.jSeries?{...jArticle.jSeries}:undefined, 
        aTags: [...(jArticle.aTags||[])],
        Card:{
            title:jArticle.cardTitle,
            content:jArticle.cardContent
        },
        Full:{
            title:jArticle.title,
            content:jArticle.content
        },
        get status(){
            return jEdits._approved ? "APPROVED" : "PENDING";
        },
        get date(){ return new Date(jEdits._date).toGMTString().substr(0,16);},
        set date(val){ 
            jEdits._date = new Date(val).toISOString().substr(0,10);
        },
        get dateISO(){ 
            return new Date(jEdits._date).toISOString().substr(0,10);
        },
        set dateISO(val){ 
            jEdits.date = val;
        },
        set tag(tag){ jEdits._tag = tag;},
        set cardTitle(title){jEdits.Card.title = title;},
        set title(title){jEdits.Full.title = title;},
        set cardContent(content){jEdits.Card.content = content;},
        set content(content){jEdits.Full.content = content;},

        get hasPriorApproval(){
            let priorApproval = false;
            for(let s in jEdits.jSeries){
                if(s == jEdits.series) break;
                priorApproval = jEdits.jSeries[s]._approved;
            }
            return priorApproval;
        },
        get tag(){ return jEdits._tag;},
        get cardTitle(){return jEdits.Card.title;},
        get title(){return jEdits.Full.title;},
        get cardContent(){return jEdits.Card.content;},
        get content(){return jEdits.Full.content;},
        fnAddTag(ev){
            if(ev.code !== "Enter") return;
            let tag = jEdits.tag.toLowerCase().replace(/[^a-z ]/g,"").trim();
            if( tag.length > 3 && jEdits.aTags.findIndex((t)=>{ return t == tag;}) < 0){
                jEdits.aTags.push(tag);
                jEdits.tag="";
                jEdits = jEdits;
            }
        },
        fnNewInSeries(ev){
            let jTemp = jEdits.jSeries[jEdits.series]||{};
            console.log("fnNewInSeries:",jTemp)
            jEdits.seriesid = jEdits.articleid;
            jTemp.ordinal = jEdit.ordinal++;
            jTemp.date  = jEdits.date;
            jTemp.aTags = [...jEdits.aTags];
            jTemp.Card  = {...jEdits.Card};
            jTemp.Full  = {...jEdits.Full};
            jEdits.jSeries[jEdits.series] = jTemp;
            jEdits = jEdits;
            fnNewEditor();
        },
        fnSeriesChange(){
            let jTemp = jEdits.jSeries[jEdits.series];
            console.log("fnSeriesChange:",jTemp)
            jEdits._approved  = jTemp._approved || "";
            jEdits.articleid  = jTemp.seriesid;
            jEdits.date  = jTemp.date;
            jEdits.aTags = [...jTemp.aTags];
            jEdits.Card  = jTemp.Card;
            jEdits.Full  = jTemp.Full;
            jEdits = jEdits;
            fnNewEditor();
        },
        fnToggleSeries(){
            if(!jEdits.jSeries){
                jEdits.jSeries = {};
                jEdits.fnNewInSeries();
            }
            else{
                jEdit.ordinal = 1;
                jEdits.articleid = jEdits.jSeries[""].seriesid;
                jEdits.aTags = jEdits.jSeries[""].aTags;
                jEdits.Card  =jEdits.jSeries[""].Card;
                jEdits.Full  =jEdits.jSeries[""].Full;
                jEdits.jSeries = undefined;
            }
            jEdits=jEdits; 
        },
        get canSave(){ 
            return User.canSaveArticle
                    && jEdits.title 
                    && jEdits.cardTitle
                    && jEdits.content 
                    && jEdits.cardContent
                    ? true : false;
        },
        fnSave(){
            if( !User.isA("author") ) return View.fnCancel();
            if(!jArticle.id){
                jArticle.authorid = User.userid;                
                jArticle.author   = User.pseudoname || User.alias;
                jArticle.date     = jEdits.date;
                jArticle.jReviews = {mean:0,public:0,jUser:{}};
                jArticle.aEdits   = [];
            }
            else{
                jArticle.aEdits.push({
                    user:User.userid,
                    date:new Date().getTime(),
                    jArticle:JSON.parse(JSON.stringify({
                        title       : jArticle.title,
                        date        : jArticle.date,
                        content     : jArticle.content,
                        cardTitle   : jArticle.cardTitle,
                        cardContent : jArticle.cardContent,
                        aTags       : jArticle.aTags||[]
                    }))
                });
            }
            return onSave ? onSave(jArticle) : undefined;
        },
        fnCancel(){
            onCancel ? onCancel() : undefined;
        }
    }
	let cardElement,fullElement;
	let editor;
	let bubbleMenu;

    onMount(fnNewEditor);
    onDestroy(()=>{
        if(editor) editor.destroy();      
    });
    let View={
        _size:"Card",
        _sizeIndex:0,
        _aSizes:["Card","Full"],
        get size(){return View._size;},
        get nextSize(){return View._aSizes[(View._sizeIndex+1)%View._aSizes.length];},
        get editorOptions(){
            return View._size=="Card" 
                    ? {element:cardElement,content:jEdits.cardContent}
                    :  {element:fullElement,content:jEdits.content};
        },
        fnToggle(){ 
            if(View._size=="Card"){ jEdits.cardContent = editor.getHTML(); }
            else if(View._size=="Full"){ jEdits.content = editor.getHTML(); }
            View._size = View.nextSize; View._sizeIndex++; View = View;
            jEdits=jEdits;
            fnNewEditor();
        }
    }
    function fnNewEditor(){
        if(editor) editor.destroy();      

        editor = new Editor({
            ...View.editorOptions,
            extensions: [StarterKit],
            onTransaction:()=>{
                editor = editor;
            },
        });
        editor.on('update', ({ editor }) => {
            //console.log('editor html', editor.getHTML());
		});
    }
</script>
<div class="Article">
    <div class="Editor {View.size}" >
        <div>
            <span><b>{jEdits.status}</b> Series: <input type="checkbox" checked="{jEdits.jSeries}" on:change="{jEdits.fnToggleSeries}"/></span>
            {#if jEdits.jSeries}
                <input class="Series" 
                    type="text" 
                    placeholder="Series:{jEdits.series}" 
                    bind:value={jEdits.series}
                /> 
                {#if jEdits.series}
                    <button disabled="{!jEdits.hasPriorApproval}" on:click="{jEdits.fnNewInSeries}">&gt;&gt;</button>
                {/if}
                <select name="Series" bind:value="{jEdits.series}" on:change={jEdits.fnSeriesChange}>
                    {#if !jEdits.jSeries[""]}
                    <option value="">(Key Article)</option>
                    {/if}
                    {#each Object.entries(jEdits.jSeries) as [name,jArticle]}
                    <option value="{name}">#{jArticle.ordinal}) {name||"(Key Article)"}</option>
                    {/each}
                </select>
                <div>
                    {#if !jEdits.series} This is the first of the series, the
                        Key Article which the others in this series are linked to.
                    {:else}You are editing "{jEdits.series}" in the series. 
                    <br>WARNING: If you uncheck the series, only the Key Article will remain
                    and all other edits associated with the series will be lost.
                    {/if}
                </div> 
                <div>Each in a Series or its modification requires Editor approval before another may be added.
                    Save equates to a modification whether or not there are changes, thus requiring re-approval.
                    When Saving, only the one currently being edited in the Series is Saved.
                </div> 
            {:else}
                <div>You are composing a singular piece. It can be made a series at any time.
                    Articles auto-publish after Editor's approval. 
                    Save equates to a modification whether or not there are changes, thus requiring re-approval.
                    Modifications to an Article await Editor approval
                    before re-publication.
                </div> 
            {/if}
        </div>
        <div class="CardArticle">
            <div><input class="cardTitle" minlength=2 maxlength=32 type="text" 
                placeholder="{jEdits.series||""} Short Title:{jArticle.cardTitle||""}" bind:value="{jEdits.cardTitle}"/></div>
            <div class="Author">
                <span>by {jArticle.author||""}</span>
                <span>
                    {#if jArticle.date}
                        {jArticle.date}
                    {:else}
                    <input type="date" bind:value={jEdits.dateISO}/>
                    {/if}
                </span>
                <button class:size={View.size} on:click={View.fnToggle}>{View.nextSize}</button>
                <span class="float-right">
                    <button on:click={jEdits.fnCancel}>Cancel</button>
{#if jEdits.canSave }
                    <button on:click={jEdits.fnSave}>Save</button>
{/if}
                </span>
            </div>
            <div><input class="Tags" type="text" 
                placeholder="Tags:{jEdits.aTags.join(",")}" 
                bind:value={jEdits.tag}
                on:keypress={jEdits.fnAddTag}
                /> 
                <button on:click={()=>{jEdits.aTags.splice(1);jEdits=jEdits}}>Empty</button>
            </div>
{#if OPENED}
            <div class="wrapper">
                <EditorMenu {editor} >
                </EditorMenu>
                <div class="element-wrapper" bind:this={cardElement}></div>
            </div>
{/if}
        </div>
{#if OPENED}
        <div class="FullArticle">
            <div><input 
                class="Title" type="text"  minlength=2 maxlength=64 
                placeholder="{jEdits.series||""} Full Title:{jArticle.title||""}" bind:value="{jEdits.title}"/></div>
            <div class="Author">
                <span>by {jArticle.author}</span>
                <span>{jEdits.date}</span>
                <button class:size={View.size} on:click={View.fnToggle}>{View.nextSize}</button>
                <span class="float-right">
                    <button on:click={jEdits.fnCancel}>Cancel</button>
{#if jEdits.canSave }
                    <button on:click={jEdits.fnSave}>Save</button>
{/if}
                </span>
            </div>
            <div class="wrapper">
                <EditorMenu {editor} >
                </EditorMenu>
                <div  class="element-wrapper" bind:this={fullElement}></div>
            </div>
        </div>
        {/if}
    </div>
</div>
<style>
.flex.float-right{
    float:right;
    gap:1em;
}
.Rating label{
    margin:0em .1em;
    padding:.2em;
    outline: 1px solid black;
}
.wrapper {
    border: 1px solid #ccc;
    display: flex;
    flex-direction: column;
}
.CardTitle{
    width:10em;    
}
.Title{
    width:50em;    
}
.Tags{
    width:20em;    
}
.CardArticle .wrapper {
    font-size:.8em;
    height: 18em;
    width:22em;
}	
.FullArticle .wrapper {
    font-size:1rem;
    height: 40em;
    width:unset;
}
.CardArticle, .FullArticle{
    display:none;
    min-width:400px;
}
.Full .FullArticle,.Card .CardArticle{
    display:grid;
}	
.wrapper:focus-within {
    outline: 1px solid red;
}
.element-wrapper {
    padding: .2rem;
    flex: 1 1 0%;
    resize: none;
    overflow: auto;
    outline: 1px solid black;
}
.Full .element-wrapper {
    resize: all;
}
	
.element-wrapper :global(p:first-of-type) {
    margin-top: 0;
}
	
.element-wrapper :global(p:last-of-type) {
    margin-bottom: 0;
}
	
.element-wrapper > :global(.ProseMirror) {
    outline: 0;
}

</style>
    