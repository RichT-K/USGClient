<svelte:options customElement="usg-latest-component" />
<script>
    import { onMount, onDestroy } from 'svelte';
    onMount(()=>{
        // Local initialization
        console.log("CustomElement: usg-template-component");
    })
    onDestroy(()=>{
        // Local clean up        
    });
</script>
<div>
    <h1>Next Up</h1>
    <p>
    </p>
    <h4>USGClient:</h4>
        <ul>
            <li>Save/Get/Edit Article</li>
            <li></li>
            <li>meta:property="usg-o" content="user's unique id"</li>
            <li>meta:property="usg-o-author" content="name or pseudonym"</li>
            <li>meta:property="usg-o-date" content="date associated with the article"</li>
            <li>meta:property="usg-o-length" content="integer - must be equal to the character length of the innerHTML of the body"</li>
            <li>meta:property="usg-o-category" content="a singular phrase"</li>
            <li>meta:property="usg-o-tags" content="comma delimited set"</li>
            <li>meta:property="usg-o-rating" content="1 to 100 where 1 is benign 100 is horrific"</li>
            <li>meta:property="usg-o-series" content="numeric ordinal value 1 through n"</li>
            <li>meta:property="usg-o-previous" content="link to a prior article"</li>
            <li>meta:property="usg-o-next" content="link to another article"</li>
            <li>meta:property="usg-o-group" content="the article's group name"</li>
            <li>meta:property="usg-o-groupid" content="identifier associated with the group"</li>
            <li>meta:property="usg-o-geo" content="lng,lat"</li>
            <li>meta:property="usg-o-radius" content="numeric km"</li>
            <li>meta:property="usg-o-bounds" content="[[n,w],[s,e]]"</li>
            <li></li>
            <li>All element attributes will be removed: style, class, etc</li>
            <li>The structure of the body</li>
            <li><pre>{
`<article>
    <section>
        Content Preview (html okay)
    </section>
    <section>
        Full Content (html okay)
    </section>
</article>`
}
</pre>
</li>
            <li>Server: Validation Prototypes</li>
        </ul>
    <h4>USGServer:</h4>
        <ul>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li>Validation Prototypes</li>
        </ul>
    <h4>USGAPI:</h4>
        <ul>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
        </ul>
</div>
<style>
    ul{
        list-style: none;;
    }
    p{
        max-width:600px;
        margin:2em;
    }
</style>
    