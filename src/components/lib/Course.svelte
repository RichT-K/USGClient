<svelte:options customElement="usg-course" />
<script>
    export let jData={},jCourse={},handlers={};
    let clickHandler = handlers.click || function (section,jData){console.log("NO Handler for ",section)};
</script>
<div class="Feature grid">
    <div class="title">{jCourse.name}</div>
    {#if jData.distance}
    <div class="subtitle">
        {Number(jData.distance).toFixed(2)} miles
    </div>
    {/if}
    <div class="subtitle">
        <span>{jCourse.type}</span>
        <span>{jCourse.holes} holes</span>
        <span>{jCourse.yearbuilt || "no date"} est.</span>
    </div>
    <div class="flex">
        <span class="{jData.partialDay?"warning":"OKAY"}">{jData.partialDay||"Normal Play"}</span>
        <span class="{jData.isClosed?"warning":"OKAY"}">{jData.isClosed?"CLOSED":"Open"}</span>
        <span class="{jData.inActive?"warning":"OKAY"}">{jData.inActive?"INACTIVE":"Active"}</span>
    </div>
    <div class="Block grid">
        <span>{jCourse.street}</span>
        <div>
            <span>{jData.city}</span> <span>{jData.region} <span>{jData.country}</span> <span>{jData.zipcode ||"no zip"}</span>
        </div>
    </div>
    <div class="grid Feature">
        <span>Email : {jCourse.email || "n/a"}</span>
        <span>Facility : {jCourse.facility || "n/a"}</span>
        <span>Shop Ph. : {jCourse.golfshop || "n/a"}</span>
        <span>Website : {jCourse.website || "n/a"}</span>
        <span>Course Ph. : {jCourse.phone|| "n/a"}</span>
        <div class="grid-4">
            <span>Par : {jCourse.par||"?"}</span>
            <span>Length : {jCourse.length||"?"}</span>
            <div><span>Rating / Slope  {jCourse.rating||"?"} / {jCourse.slope||"?"}</span></div>
        </div>
        <div class="Grasses grid-2">
            <span class="pre">Fairway Grass : {jCourse.fairwaygrass || "unspecified"}</span>
            <span class="pre">Green Grass : {jCourse.greengrass || "unspecified"}</span>
        </div>
        <div>Dress Code :<br/>{jCourse.dresscode || "unspecified"}</div>
        <div>Course Description :<br/>{jCourse.description || "unspecified"}</div>
    </div>
</div>
<style>
.Feature{
    gap:1em;
}
.grid,.flex{
    gap:1em;
}
</style>
    