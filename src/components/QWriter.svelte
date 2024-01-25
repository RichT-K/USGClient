<svelte:options customElement="usg-quantum-writer" />
<script>
import { fnGetUser } from "/context/User";
import { postPacketPromise } from "/lib/forms";
const User = fnGetUser();
let userDomain = User.domain;
let panel="FORM";
let shortContent="";
let fullContent="";
const QW={
    authorid:User.userid,
    date:(new Date).toISOString().substr(0,10),
    _length:0,
    _rating:100,
    _author:"",
    _category:"",
    _keywords:"",
    _series:false,
    _path:"",
    _previous:"",
    _next:"",
    pathTested:"",
    previousTested:"",
    nextTested:"",
    group:"",
    groupid:0,
    point:"",
    radius:0,
    bounds:"",
    get length(){return this._length;},
    get rating(){return this._rating;},
    get author(){return this._author;},
    get category(){return this._category;},
    get keywords(){return this._keywords;},
    get series(){return this._series;},
    get path(){return this._path;},
    get previous(){return this._previous;},
    get next(){return this._next;},
    set length( val ){this._length  = Math.abs(val||0);},
    set rating( val ){this._rating = Math.abs(val||100);},
    set author( val ){this._author=val.substr(0,32);},
    set category( val ){this._category=val.substr(0,32);},
    set keywords( val ){this._keywords = val.substr(0,60);},
    set series( val ){this._series = val?true:false;},
    set path( val ){ if(this._path!==val) this.pathTested=""; this._path=val;},
    set previous( val ){ this._previous=val; this.previousTested="";},
    set next( val ){ this._next=val; this.nextTested="";},
}
$: QW.length = shortContent.length + fullContent.length;
function fnPanel(ev){
    panel = ev.target.getAttribute("data-panel");
}
function fnClearDistinguishingTags(){
    QW.author=QW.category=QW.keywords="";
}
function fnClearIdentifyingTags(){
    QW.series = QW.radius = QW.groupid=0;
    QW.previous=QW.next=QW.previousTested=QW.nextTested=QW.group=QW.point=QW.bounds="";
}
function fnCleanArticles(){

}
function fnCopyMeta(){
    
}
function fnCopyArticles(){
    
}
async function fnVerifyPath(ev){
    let key = ev.target.getAttribute("data-path");
    QW[key+"Tested"] = "";
    if(QW[key]){
        var jPacket = {
            url : "/api/submit.asp",
            method : "POST",
            action : "quantum-read",
            jForm : {
                action : "quantum-read",
                pageSize : 500,
                userid:User.userid,
                url:userDomain+"/"+QW[key]
            }
        };
        await postPacketPromise(jPacket)
        .then( (jResp)=>{
            console.log("Quantum Read:",jResp);
            if(!jResp.content) return;
            QW[key+"Tested"] = "Verified"; 
            if(key !== "path") return;
            try{
                let Doc = new window.DOMParser().parseFromString(jResp.content, "text/xml");
                let Tags = Doc.querySelectorAll("[ns=quantum]");
                Tags.forEach((Node)=>{
                    if(Node.tagName == "meta:property"){
                        let name = Node.getAttribute("name").substr(3);
                        if(QW[name] !== undefined){
                            QW[name] = Node.getAttribute("content");
                        }
                    }
                })
            }catch(e){
                console.error(e);
            }

        });
    }
}
</script>
<div class="MENU">
    <nav>
        <a href on:click|preventDefault="{fnPanel}" data-panel="FORM">Form</a>
        <a href on:click|preventDefault="{fnPanel}" data-panel="PREVIEW">Preview</a>
        <a href on:click|preventDefault="{fnPanel}" data-panel="METATAGS">Meta Tags</a>
        <a href on:click|preventDefault="{fnPanel}" data-panel="CONNECTIONS">Connections</a>
        <a href on:click|preventDefault="{fnPanel}" data-panel="INTRO">Intro</a>
    </nav>
</div>
<div class="Panel Form {panel}">
    <form class="grid DOTTED">
        <div>Required Tags for Quantum Content hosted at "{userDomain}"</div>
        <label>"qw-authorid"<input required readonly="true" type="text" size="35" pattern="{`[A-F0-9]{8,8}-[A-F0-9]{4,4}-[A-F0-9]{4,4}-[A-F0-9]{4,4}-[A-F0-9]{12,12}`}" bind:value={QW.authorid} /></label>
        <label>"qw-path"({QW.pathTested || QW.path.length})
            <span>
                <input type="text" minlength=2 maxlength=128 bind:value={QW.path} />
                <a href data-path="path" on:click|preventDefault={fnVerifyPath}>Verify</a>
            </span>
        </label>
        <label>"qw-date"<input required type="text" bind:value={QW.date} /></label>
        <label>"qw-length"({QW.length})<input required type="number" min=1 max=21050 step=1 bind:value={QW.length} /></label>
        <label class="rating" style="{`background-color:hsl(${(100-QW.rating)},100%,50%)`}">"qw-rating"({QW.rating})<input required type="range"  min=1 max=100 bind:value={QW.rating} /></label>

        <p>Distinguishing Tags <button on:click|preventDefault="{fnClearDistinguishingTags}">Clear</button></p>
        <label>"qw-author"({QW.author.length})<input type="text" minlength=2 maxlength=32 bind:value={QW.author} /></label>
        <label>"qw-category"({QW.category.length})<input type="text" minlength=2 maxlength=32 bind:value={QW.category} /></label>
        <label>"qw-keywords"({QW.keywords.length})<input type="text" minlength=2 maxlength=64 bind:value={QW.keywords} /></label>

        <p>Identifying Tags <button on:click|preventDefault="{fnClearIdentifyingTags}">Clear</button></p>
        <label>"qw-series"({QW.series})<input name="series" type="checkbox" bind:checked={QW.series} /></label>
        {#if QW.series}
        <label>"qw-previous"({QW.previousTested || QW.previous.length})
            <span>
                <input type="text" minlength=2 maxlength=128 bind:value={QW.previous} />
                <a href data-path="previous" on:click|preventDefault={fnVerifyPath}>Verify</a>
            </span>
        </label>
        <label>"qw-next"({QW.nextTested || QW.next.length})
            <span>
                <input type="text" minlength=2 maxlength=128 bind:value={QW.next} />
                <a href data-path="next" on:click|preventDefault={fnVerifyPath}>Verify</a>
            </span>
        </label>
        {/if}
        {#if QW.point}
        <label>"qw-radius"({QW.radius})<input type="range"  min=1 max=100 bind:value={QW.radius} /></label>
        {/if}
        <label class="hidden">"qw-group"({QW.group.length})<input type="hidden" minlength=2 maxlength=32 bind:value={QW.group} /></label>
        <label class="hidden">"qw-groupid"({QW.groupid})<input type="hidden" min=1 bind:value={QW.groupid} /></label>
        <label class="hidden">"qw-point"({QW.point.length})<input type="point" bind:value={QW.point} /></label>
        <label class="hidden">"qw-bounds"({QW.bounds.length})<input type="hidden" bind:value={QW.bounds} /></label>
    </form>
</div>
<div class="Panel Connections {panel}">
    <h1>Quantum Connections</h1>
    <div>
        Currently you have no connections. 
    </div>
</div>
<div class="Panel Preview {panel}">
    <article class="ShortContent" contenteditable="true" bind:innerHTML={shortContent} />
    <article class="FullContent" contenteditable="true" bind:innerHTML={fullContent} />
    <span class="Length">{shortContent.length} of 1000 characters</span>
    <span class="Length">{fullContent.length} of 20,000 characters 
        | Total:{QW.length} of 21050 
        <button on:click={fnCleanArticles}>Clean</button>
        <button on:click={fnCopyArticles}>Copy</button>
        <span class="rating" style="{`background-color:hsl(${(100-QW.rating)},100%,50%)`}">Rating : {QW.rating}</span>
    </span>
</div>
<div class="Panel MetaTags {panel}">
    <span><button on:click={fnCopyMeta}>Copy</button></span>
    <code class="pre-line">
&lt;!-- The following meta tags determine the fate of your exposure: --&gt;
&lt;meta:property ns="quantum" name="qw-authorid" content="{QW.authorid}"/&gt;
&lt;meta:property ns="quantum" name="qw-date" content="{QW.date}"/&gt;
<span style="{QW.length?"":`background-color:orange`}">&lt;meta:property ns="quantum" name="qw-length" content="{QW.length}"/&gt;</span>
<span style="{`background-color:hsl(${(100-QW.rating)},100%,50%)`}">&lt;meta:property ns="quantum" name="qw-rating" content="{QW.rating}"/&gt;</span>
<span style="{QW.pathTested?"":`background-color:orange`}">&lt;meta:property ns="quantum" name="qw-path" tested="{QW.pathTested}" content="{QW.path}"/&gt;</span><br/>

{#if QW.author || QW.category || QW.keywords}
&lt;!-- These meta tags will help in distinguishing your contributions : --&gt;<br/>
    {#if QW.author}
&lt;meta:property ns="quantum" name="qw-author" content="{QW.author}"/&gt;<br/>
    {/if}
    {#if QW.category}
&lt;meta:property ns="quantum" name="qw-category" content="{QW.category}"/&gt;<br/>
    {/if}
    {#if QW.keywords}
&lt;meta:property ns="quantum" name="qw-keywords" content="{QW.keywords}"/&gt;<br/>
    {/if}
{/if}

{#if QW.series || (QW.group && QW.groupid) || (QW.point && QW.radius) || QW.bounds}
&lt;!-- And these meta tags will help to identify and traverse your contributions : --&gt;<br/>        
    {#if QW.series}
&lt;meta:property ns="quantum" name="qw-series" content="{QW.series}"/&gt;<br/>
        {#if QW.previous}
<span style="{QW.previousTested?"":`background-color:orange`}">&lt;meta:property ns="quantum" name="qw-previous" tested="{QW.previousTested}" content="{QW.previous}"/&gt;</span><br/>
        {/if}
        {#if QW.next}
<span style="{QW.nextTested?"":`background-color:orange`}">&lt;meta:property ns="quantum" name="qw-next" tested="{QW.nextTested}" content="{QW.next}"/&gt;</span><br/>
        {/if}
    {/if}
    {#if QW.group && QW.groupid}
&lt;meta:property ns="quantum" name="qw-group" content="{QW.group}"/&gt;<br/>
&lt;meta:property ns="quantum" name="qw-groupid" content="{QW.groupid}"/&gt;<br/>
    {/if}
    {#if QW.point && QW.radius}
&lt;meta:property ns="quantum" name="qw-point"  content="{QW.point}"/&gt;<br/>
&lt;meta:property ns="quantum" name="qw-radius" content="{QW.radius}"/&gt;<br/>
    {/if}
    {#if QW.bounds}
&lt;meta:property ns="quantum" name="qw-bounds" content="{QW.bounds}"/&gt;<br/>
    {/if}
{/if}
    </code>
</div>
<div class="Panel Intro {panel}">
    <div class="MENU">
        <nav>
            <a href on:click|preventDefault="{false}" data-quantum="INTRO">Introduction</a>
            <a href on:click|preventDefault="{false}" data-quantum="READER">The Quantum Reader</a>
            <a href on:click|preventDefault="{false}" data-quantum="WRITER">The Quantum Writer</a>
            <a href on:click|preventDefault="{false}" data-quantum="STATES">Quantum States</a>
        </nav>
    </div>
    <div class="QUANTUM STATES">
        <h2>Quantum States</h2>
        <div>
            Quantum States should be a disconnected, third party, publically accessable database storing:
            <ul>
                <li>* Authorid</li>
                <li>* Quantumid</li>
                <li>* Pseudonym</li>
                <li>* Content Location</li>
                <li>* Content Point(geography point)</li>
                <li>* Content Keywords </li>
                <li>* Content Length </li>
                <li>** Verified</li>
                <li>** Last Modified</li>
                <li>*** Content Reads</li>
                <li>*** Public Rating(quantumid,mean)</li>
                <li>*** Reader Ratings(quantumid,readerid,authorid,content location, modified date, rating)</li>
                <li>*** Reader Veracity(quantumid,readerid,authorid,content location, modified date, veracity)</li>
                <li>*** Moderator Veracity(moderatorid,authorid,content location,modified date, veracity)</li>
                <li>*** Moderator Ratings(moderatorid,authorid,content location,modified date, rating)</li>
                <p>
                    * CREATE: new entry via "QUANTUM WRITER"
                    <br>** UPDATE: data push via QUANTUM STATES web crawler
                    <br>*** UPDATE: data push via QUANTUM READER 
                    <br>DELETE: archive via QUANTUM WRITER(quantumid,authorid,content location) 
                </p>
            </ul>
            with access by authorid to (output:JSON,HTML):
            <ul>
                <li>Author Rating</li>
                <li>Content Location</li>
                <li>Last Modified</li>
                <li>Content Rating</li>
                <li>Public Rating(mean)</li>
                <li>Reader Rating(mean)</li>
                <li>Moderator Rating(mean)</li>
            </ul>
            along with filterable report(verified, unarchived) data for (output:JSON,HTML):
            <ul>
                <li>Pseudonym</li>
                <li>Content (Location, Point(within KM radius), Keyword, Reads, Length)</li>
                <li>Last Modified ( Range)</li>
                <li>Ratings (Content,Public,Reader,Moderator)</li>
            </ul>
        </div>
    </div>
    <div class="QUANTUM READER">
        <h2>The Quantum Reader</h2>
        <div>
            <p>
            A Quantum Reader should consult with a Quantum State machine to provide the most accurate Quantum Content.
            That being said, the Quantum Reader relays content it deems worthy of its readership along with
            the current representation of the Quantum State and all means to record "reader reaction" aka ratings. 
            </p>
            <p>Some Quantum Readers may limit their offerings to specific categories of content and if so should notify their readership 
                of the limit of their offerings. The goal of the Quantum Project is to reduce censorship 
                and increase self-control. To achieve that end, the Quantum States machine hosts a robust rating 
                system separated from the QReader/QWriter with anonymous authorship(authorid GUID) and reporting.  
            </p>
        </div>
    </div>
    <div class="QUANTUM WRITER">
        <p>Stop, please! Empty your mind. Now, let's begin ...
        <br>You are embarking on a journey, an experiment of your own creation enhanced by others sharing your passion.</p>
        <p>Your thoughts of brilliance, become particles of inspiration on the connecting threads  
        in the reader's imagination.</p>
        <p>You are a Quantum Writer. There are no rules save those which connect you to this nebulous, ever-changing
            world of expression. Your words, your thoughts, your existence - are in your hands - to be molded at your will
            - shaped by influences only you can fashion.</p>
        <p>We are here merely to provide a conduit, connective tissue for your ideas to take hold, however briefly, and provide the 
            reader a passing glimpse into the recesses of your mind. While there are no rules there are a few requirements to gain 
            exposure in the world of TheQuantumReader.
        </p>
        <p>Requirements To Create A Quantum Connection: 
        </p>
        <ol>
            <li>* A publically accessable website with the ability to manipulate the meta tags within the header of a Quantum page</li>
            <li>* A verified Quantum Page containing your article and corresponding meta tags.</li>
            <li>* A willingness to tollerate the constraints of connectivity</li>
            <li>* An account on TheQuantumWriter.com</li>
            <div>* optional constraints  - Failure to meet any requirements may severely limit exposure
            </div>
        </ol>
        <p>
            Bear in mind the following constraints govern the ability for TheQuantumReader to represent 
            Quantum Writers' contributions. Other quantum readers may offer laxer constraints.
        </p>
        <p>Our generator will assist in creating the tags and content area your Quantum page may comprise 
            <br/>allowing you to copy and paste the meta tags within the <b>&lt;head&gt;&lt;/head&gt;</b> section of your page.
            <br/>The format of the body of the page is simple two article tags, each with html content:
        </p>
        <ul>
            <li>The first <b>&lt;article&gt; section</b>: presented along with others on the Reader, offers a more limited, 1000 character representation, a synopsis or introduction.</li>
            <li>The second <b>&lt;article&gt; section</b>: contains a larger 20,000 character limit for the contents of your piece - with or without the intro.</li>
            <li>Your resulting body will look similar to:
    <code>

        &lt;body&gt;
        &lt;article&gt;(Your Intro: Title, Content - what ever you decide)&lt;/article&gt;
        &lt;article&gt;(Your Work: Story, Chapter, Memoir, Opinion - again your inspiration)&lt;/article&gt;
    &lt;/body&gt;

    </code>
            </li>
        </ul>
        <p>
            <br/>For simplicity, you may place your page body content, the pair of articles, into our <b>Previewer</b> 
            to review the lengths and see how it may appear in the QuantumReader.
            Currently and after the length is calculated, script, style, media, video and all attributes will be 
            removed from content, meaning that styling based on attributes and elements with external content
            like: &gt;s, images, video, and the like will fail to render.
            <br/>While, you are unrestricted in creation in your world, we are not prevented from
            protecting ours.
            <br/>You are free to make any change you like - remembering that
            those changes may result in a lack of exposure.  
        </p>
        <p>
            The Quantum Page must be accessable - without limitation by credentials or session awareness.
            <br/>The following meta tags will determine the fate of your exposure:
        </p>
        <ul>
            <li>meta:property name="qw-authorid" content="author's unique id"</li>
            <li>meta:property name="qw-path" content="the path to the page, without the protocol and domain"</li>
            <li>meta:property name="qw-date" content="YYYY-MM-DD ISO date associated with your contribution"</li>
            <li>meta:property name="qw-length" content="integer - must be equal to the character length of the innerHTML of the body"</li>
            <li>meta:property name="qw-rating" content="1 to 100 where 1 is benign 100 is horrific"</li>
        </ul>
        <p>
            These meta tags will help in distinguishing your contributions :
        </p>
        <ul>
            <li>meta:property name="qw-author" content="name or pseudonym"</li>
            <li>meta:property name="qw-category" content="a singular phrase"</li>
            <li>meta:property name="qw-keywords" content="comma delimited 'quoted' set"</li>
        </ul>
        <p>
            And these meta tags will help to identify and traverse your contributions :
        </p>
        <ul>
            <li>meta:property name="qw-series" content="numeric ordinal value 1 through n"</li>
            <li>meta:property name="qw-previous" content="path to a prior article, without the protocol and domain"</li>
            <li>meta:property name="qw-next" content="path to a successive article, without the protocol and domain"</li>
            <li>meta:property name="qw-group" content="the article's group name"</li>
            <li>meta:property name="qw-groupid" content="identifier associated with the group"</li>
            <li>meta:property name="qw-point"  content="formatted - created from a lng,lat geographic point"</li>
            <li>meta:property name="qw-radius" content="numeric km"</li>
            <li>meta:property name="qw-bounds" content="formatted - created from a geographic polygon"</li>
        </ul>
    </div>
</div>
<style>
.hidden{
    visibility:hidden;
    max-height:0px;
    overflow:hidden;
}
.Panel{
    display:grid;
    justify-content: center;
    max-height:0px;
    min-width:30vw;
    max-width:60vw;
    overflow:hidden;
    transition:all .3sec ease-in-out;
}
.Intro .MENU{
    position:sticky;
    top:0em;
    padding:0em 5vw;
    z-index:1111;
}
.FORM form{
    max-width:40vw;
}
form button{
    font-size:unset;
}
.Form.FORM, 
.Preview.PREVIEW,
.MetaTags.METATAGS, 
.Intro.INTRO,
.Connections.CONNECTIONS {
    max-height:80vh;
    overflow:auto;
}
code{
    display:grid;
    white-space:pre;
}
code.pre-line{
    display:pre;
    white-space:pre-line;
}
.PREVIEW{
    display:grid;
    position:relative;
    gap:1em;
    height:48em;
    max-width:92em;
    grid-template-columns:30em auto;
    outline:1px solid rgb(201, 201, 201);
}
.ShortContent{
    outline:1px solid rgb(165, 24, 24);
    height:20em;
    width:30em;
    overflow:hidden;
}
.FullContent{
    outline:1px solid rgb(49, 163, 20);
    height:40em;
    width:60em;
    overflow:auto;
}
.Length{
    position:sticky;
    order:-1;
    margin-top:2em;
    outline:1px solid rgb(201, 201, 201);
}

</style>