<svelte:options customElement="usg-feed-article" />
<script>
    export let id="", thumb=false, xml=undefined, jData={}; 

</script>
{#if thumb == true}
<div class="Feed-Thumb">{jData.title}</div>
{:else}
<article class="Feed-Article Verbiage">
    <div class="title"><b>{@html jData.title}</b></div>
    <div class="subtitle">
      <span>By {@html jData.author}</span>
      <span>{@html jData.published}</span>
    </div>
    {#if jData.aCategories}
    <div class="categories">
        {@html `<span>${jData.aCategories.join("</span><span>")}</span>`}
    </div>
    {/if}
    <div class="description"><b>{@html jData.description}</b></div>
    <div class="readmore">
      <a href="{jData.link}" target="blank">read more</a>
    </div>
</article>
{/if}
<style>
.Feed-Thumb{
    display:grid;
    text-align: center;
    text-transform: capitalize;
    text-shadow:1px 1px 1px rgb(136, 136, 136);

}
article{
    display:grid;
    justify-content: center;
    padding:.1em;
    gap:.5em;
    max-height:100%;
    overflow:auto;
}
article .title{
    text-align: center;
    text-transform: capitalize;
}
article .subtitle{
    display:grid;
    padding:0em 1em;
    grid-template-columns: auto auto;
    justify-items: stretch;
}
article .categories{
    display:grid;
    padding:0em 1em;
    grid-template-columns: repeat(auto-fill, 30%);
    justify-items: stretch;
    text-transform: capitalize;
    justify-content: center;
}
</style>