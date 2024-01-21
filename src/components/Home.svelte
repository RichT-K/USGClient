<svelte:options customElement="usg-home-component" />
<script>
  import App from '../App.svelte';

  import { onMount } from 'svelte';
  import {fnGetUser} from '/context/User';
  import DropFeed from "./DropFeed.svelte";

  const aPath = location.pathname.substr(1).toLowerCase().split("/");
  const root = "/" +(aPath[0] || "");
  let pathtext = root=="/"?"Try a different path":"... or not :)";
  let You = fnGetUser();
  onMount(()=>{
    let F = document.querySelector(".Chapter-1");
    if(F){
      window.scrollTo(0,F.offsetTop-50);
    }
  })
</script>
<div class="Panel grid-auto-flow-row justify-items-center">
  <div class="grid  Verbiage">
    <h1>USGolfers Network</h1>
    <div class="text-align-justify">
      <div  class="Chapter-1">
        <span class="title">Green Beginnings</span>       
        <sub class="text-align-end">by Another Ignominious Golfer, I. F. Akers, F. Akers, I. T. Sallalie</sub>
      </div>

      <p>
        In the quaint village of St. Andrews, nestled along the rugged coastline of 18th century Scotland, lived two young men whose destinies were intricately woven into the fabric of a burgeoning sport – golf. Angus MacLeod and Ewan Sinclair, both sons of humble farmers, shared a deep fascination for the game that had been whispered about in the taverns and fields.
      </p>
      <p>
        It was a misty morning when the pair, armed with rudimentary clubs crafted from the sturdy branches of ancient oak trees, set out to the rugged terrain that would soon bear witness to their golfing adventures. The wind carried the salty scent of the North Sea, and the air was filled with the cries of seagulls.
      </p>
      <p>
        The course they had chosen, more a collection of natural obstacles than a manicured fairway, was a testament to the raw essence of the sport. Angus, with his unruly mop of red hair and freckled face, took the first swing. The wooden ball sailed through the air, propelled by a combination of skill and luck, landing somewhere in the distant heather.
      </p>
      <p>
        Ewan, with his darker complexion and a glint of determination in his hazel eyes, followed suit. The village folk, curious about this novel pursuit, gathered on the outskirts of the makeshift course, observing the unfolding spectacle with equal parts skepticism and intrigue.
      </p>
      <p>
        As the day progressed, Angus and Ewan honed their skills amidst the undulating landscape. They navigated sand dunes, avoided patches of bracken, and maneuvered around the remnants of ancient stone walls. Each stroke brought them closer to mastering the art of the game, a game that transcended social boundaries and connected them to the land they called home.
      </p>
      <p>
        Word of the young golfers' exploits spread like wildfire through St. Andrews, capturing the imagination of both young and old. The elders, who had witnessed the birth of this peculiar pastime, couldn't help but smile at the sight of tradition evolving into something entirely new.
      </p>
      <p>
        Little did Angus and Ewan know that their humble endeavors on that misty Scottish morning would lay the foundation for a legacy that would echo through the centuries. The game of golf, with its roots firmly planted in the rugged soil of St. Andrews, was about to embark on a journey that would take it from the windswept shores of Scotland to the grand fairways of the world.
      </p>
      <p>... to be continued</p>
    </div>
  </div>
 </div>
<style>
  .title{
    font-size:2em;
  }
  .Panel{
    max-width:1000px;
  }
  .Messages{
    overflow:auto;
    margin:0em 2em;
    min-height:1em;
  }
  .Verbiage{
    max-width:unset;
    text-shadow:.1em .1em .2em rgb(201, 201, 201);
  }
</style>
  