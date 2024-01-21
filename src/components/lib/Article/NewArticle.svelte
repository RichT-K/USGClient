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

        get tag(){ return jEdits._tag;},
        get cardTitle(){return jEdits.Card.title;},
        get title(){return jEdits.Full.title;},
        get cardContent(){return jEdits.Card.content;},
        get content(){return jEdits.Full.content;},
    }
    function fnAddTag(ev){
        if(ev.code !== "Enter") return;
        let tag = jEdits.tag.toLowerCase().replace(/[^a-z ]|(  )/g,"").trim();
        if( tag.length > 5 && jEdits.aTags.findIndex((t)=>{ return t == tag;}) < 0){
            jEdits.aTags.push(tag);
            jEdits.tag="";
            jEdits = jEdits;
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
        get canSave(){ 
            return User.isA("author") ? true : false;
        },
        fnToggle(){ 
            if(View._size=="Card"){ jEdits.cardContent = editor.getHTML(); }
            else if(View._size=="Full"){ jEdits.content = editor.getHTML(); }
            View._size = View.nextSize; View._sizeIndex++; View = View;
            jEdits=jEdits;
            fnNewEditor();
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
    function fnToggleSeries(){
        jEdits.jSeries = jEdits.jSeries?undefined:{};
        jEdits=jEdits; 
    }
    function fnAddSeries(){

    }
</script>
<div class="Article">
    <div class="Editor {View.size}" >
        <div>
            <span>Series: <input type="checkbox" checked="{jEdits.jSeries}" on:change="{fnToggleSeries}"/></span>
            {#if jEdits.jSeries}
                <input class="Series" 
                    type="text" 
                    placeholder="Series:{jEdits.Series}" 
                    bind:value={jEdits.series}
                /> 
                {#if jEdits.series}
                <button >&gt;&gt;</button>
                {/if}
                <select name="Series" bind:value="{jEdits.series}">
                    <option value="">(Synopsis & Intro)</option>
                    {#each Object.entries(jEdits.jSeries) as [name,jArticle]}
                    <option value="{name}">{name}</option>
                    {/each}
                </select>
                <div>The unnamed component in the series is considered to be representative of the synoposis and the introdution. 
                    Named components are Chapters, Segments, etc. 
                </div> 
            {:else}
                <div>You are composing a singular piece. It can be made a series if you like.</div> 
            {/if}
        </div>
        <div class="CardArticle">
            <div><input class="cardTitle" minlength=6 maxlength=32 type="text" 
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
            </div>
            <div><input class="Tags" type="text" 
                placeholder="Tags:{jEdits.aTags.join(",")}" 
                bind:value={jEdits.tag}
                on:keypress={fnAddTag}
                /> 
            </div>
{#if OPENED}
            <div class="wrapper">
                <EditorMenu {editor} >
                    <div class="flex float-right">
                        <button on:click={View.fnCancel}>Cancel</button>
                        <button class:size={View.size} on:click={View.fnToggle}>{View.nextSize}</button>
                    </div>
                </EditorMenu>
                <div class="element-wrapper" bind:this={cardElement}></div>
            </div>
{/if}
        </div>
{#if OPENED}
        <div class="FullArticle">
            <div><input 
                class="Title" type="text"  minlength=16 maxlength=64 
                placeholder="{jEdits.series||""} Full Title:{jArticle.title||""}" bind:value="{jEdits.title}"/></div>
            <div class="Author">
                <span>by {jArticle.author}</span>
                <span>{jEdits.date}</span>
            </div>
            <div class="wrapper">
                <EditorMenu {editor} >
                    <div class="flex float-right">
    {#if View.canSave }
                        <button on:click={View.fnSave}>Save</button>
    {/if}
                        <button on:click={View.fnCancel}>Cancel</button>
                        <button class:size={View.size} on:click={View.fnToggle}>{View.nextSize}</button>
                    </div>
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
    width:50em;    
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
    