<svelte:options customElement="usg-golfer" />
<script>
  import { onDestroy } from 'svelte';
  import {fnUpdateHandicap,fnGetUser} from '/context/User';
  let panelName="Golfer"
  let message="";
  let User = fnGetUser();
  let jGolfer = {
    ghin:"",
    handicap: 0,
    ...User.isaGolfer,
    set Handicap(value){
        let aValue = String(value).split("");
        aValue[0] = (aValue[0] == "+"?"-":aValue[0] == "-"?"":aValue[0]);
        this.handicap = parseFloat(aValue.join("")||"0");
    },
    get Handicap(){return (this.handicap < 0 ? "+":"")+Math.abs(this.handicap);}
  }
  if( jGolfer.ghin ){
    message= "Warning : You are already a Golfer on USGolfers!<br>You may adjust your handicap.";
  }
  onDestroy(()=>{
    if(jGolfer.ghin){
        fnUpdateHandicap(jGolfer);
    }
  });
  let typedValue="";
  function fnTypedEntry(ev){
    console.log(ev)
    if(ev.key==" "){typedValue="";}
    else if(ev.key=="+" && !typedValue){typedValue="+";}
    else if(".0123456789".indexOf(ev.key) >= 0){typedValue+=ev.key;}
    jGolfer.Handicap = typedValue;
  }
</script>
{#if message}
<div class="message-block">{@html message}</div>
{/if}
<div class="DOTTED">
    <div class="Verbiage">
        {@html User.fnChangesVerbiage(panelName)}
        {#if User.isaGolfer}
        <p>Adjust your handicap.</p>
        {:else}
        <p>Enter your GHIN and adjust your handicap.</p>
        {/if}
        <p>After focusing on the handicap field you may type in a value.</p>
        <p>+handicaps are supported. Space sets the handicap to 0.</p>
        {@html User.fnVerbiage(jGolfer)}
    </div>
    <label>
        <span>GHIN</span>
        <input 
            type="text" 
            required
            readonly={User.isaGolfer?true:false} 
            name="ghin" 
            placeholder="GHIN Number"
            bind:value="{jGolfer.ghin}"/>
    </label>
    <label>
        <span>Handicap ({jGolfer.Handicap})</span>
        <div class="range-slider">
            <div class="entry-field">
                <input 
                    type="range" name="handicap" required placeholder="Handicap" step=".1"
                    min={-12}
                    max={54}
                    on:keypress={fnTypedEntry}  
                    bind:value="{jGolfer.handicap}"
                />
                <div class="display">{jGolfer.Handicap}</div>
            </div>
        </div>
    </label>
</div>
<style>
    .DOTTED{
        max-width:500px;
        gap:2em;
    }
    .range-slider{
        display:grid;
        gap:.5em;
        grid-template-columns: 1fr;
    }
    .range-slider .entry-field{
        position:relative;
        display:grid;
        align-content: center;
        justify-items:center;
        height:2em;
    }
    label input{
        width:10em;
    }
    .range-slider .entry-field input{
        width:15em;
        height:2em;
        margin-right:5px;
        outline: 1px solid rgb(170, 170, 170);
    }
    .range-slider .display{
        position:absolute;
        pointer-events:none;
        padding:.1em .25em;
        opacity:0;
        top:.25em;
        border-radius:var(--input-radius);
        background-color:rgba(126, 126, 126, 0.295);
        outline:1px solid rgb(139, 139, 139);
        transform:all .3s ease;
    }
    .range-slider input:focus + .display{
        opacity:1;
    }
    .range-slider input:invalid, .range-slider input:invalid + .display{
        background-color:rgb(255, 214, 214);
        border:1px solid red;
    }

</style>