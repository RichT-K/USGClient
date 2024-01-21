<svelte:options customElement="usg-profile-register" />
<script lang="ts">
  import {EmailAttempts,fnRegister,fnValidForRegistration,fnGetUser,aInputPatterns} from '/context/User';
  const User = fnGetUser();
  let U = {
    email:"",
    password:"",
    fullName:"",
    alias:"",
    social:"f",
    socialId:"",
    policy:0,
    answer:"",
    resp:"",
    question:"",
    secret:""
  }
  let message="";
  function onRegister(ev){
    if( U.resp !== U.answer ){
      message = "Try again!";
      return;
    }
    else if(!fnValidForRegistration(U)){
      message = "Invalid Form Values";
      return;
    }
    message = "";
    fnRegister(U).then((jResp)=>{
        console.log("jResp:",jResp);
        if(jResp.isRegistered){
          message="There's a problem Houston!"
        }
        else {
          U.resp="";  
          U.code = U.code || jResp.code ||"";
          U.answer = jResp.resp||"";
          U=U;  
        }
    })
  }
  let jSocials={
    f:"Facebook",
    x:"Xtwitter",
    i:"Instagram"
  }
  function fnCycleSocial(){
    U.social = U.social=="f"?"x":U.social=="x"?"i":"f";
  }
</script>
{#if User.isLoggedIn}
<div class="warning">Warning : Your current session will be reset!</div>
{/if}
<form class="DOTTED Verbiage" action="login" method="get" on:submit|preventDefault={onRegister}>
    <p>
      <b>Email</b>, <b>Password</b>, <b>Fullname</b>, <b>Alias</b>, <b>Question</b>, <b>Answer</b>
        and <b>Policy Acceptance</b> fields are <b>required</b>!
    </p>
    {#if message }
    <div><strong>{message}</strong></div>
    {/if}
    {#if U.answer !== ""}
      <div>Enter this value : {U.answer}</div>
      <input type="text" name="resp" bind:value="{U.resp}" placeHolder="Enter {U.answer} Here" /> 
    {/if}
    {#if true}
    <label><span>Email</span><input type="email" name="email" bind:value="{U.email}" placeHolder="Email" /></label> 
    <label title="Valid Chars: {aInputPatterns.password}" ><span>Password(8-16 chars)</span><input type="password" name="password" pattern="{aInputPatterns.password}" minlength=8 maxlength=16 bind:value="{U.password}" placeHolder="Password" /></label> 
    <label title="Valid Chars: {aInputPatterns.fullName}" ><span>Fullname(2+ names, A-Z,4-64 A-9\-)</span><input type="text" name="fullName" pattern="{aInputPatterns.fullName}" minlength=4 maxlength=64 bind:value="{U.fullName}" placeHolder="Full Name" /> </label>
    <label title="Valid Chars: {aInputPatterns.alias}"><span>Alias(1 name,1 A-Z,-16 A-9)</span><input type="text" name="alias" pattern="{aInputPatterns.alias}" minlength=2 maxlength=16 bind:value="{U.alias}" placeHolder="Alias" /> </label>
    <label title="Valid Chars: A-Za-z0-9.-">
      <span >
        <a href class="pointer" 
        title="Facebook, X-Twitter or Instagram"
          on:click|preventDefault="{fnCycleSocial}">
          <i>{jSocials[U.social||"f"]} ID</i>
          <i>(A-Za-z0-9.-)</i>
        </a>
      </span>
      <input type="text" name="socialId" pattern="{`[A-Za-z0-9\\.\\-]*`}" minlength=2 maxlength=32 bind:value="{U.socialId}" placeHolder="{jSocials[U.social||"f"]} Social ID" /> </label>
    <label title="Your question(max. 100 chars) to confirm it's you?">
      <span>Question(max. 100 chars) to confirm it's you?</span>
      <br><input type="text" name="question" maxlength="100" bind:value="{U.question}"/>
    </label>
    <label title="The answer(max. 50 chars) to your question.">
      <span>The answer(max. 50 chars) to your question.</span>
      <br><input type="text" name="secret" maxlength="50" bind:value="{U.secret}"/>
    </label>
    {/if}
    <label>
      <span>Check to Administrator Your Golf Courses</span>
        <input type="checkbox" bind:checked={U.courseadmin} />
    </label>
    {#if U.courseadmin}
    <p>
      While we still have considerable work on our end, by requesting Course Administration now
      you'll be notified when you can beta test the Admin section. When that time comes we'll 
      contact you at the email you provided today to come back to USGolfers and setup the <b>Handshake</b>.
      You'll provide <b>domain address</b> of your Course website where we can read meta content we make 
      available for you to place on your site. The content will be one simple HTML META-TAG containing 
      your unique Admin Identifier and your unique Course Identifier as it exists in our database.
      If and when the time comes when multiple courses with multiple administrators are needed, this simple 
      Handshake solution will suffice and will provide you immediate control, if necessary, over who can update your Course 
      on our databse.
    </p>
    <p>      
      Because domains are unique and because we'll check for that entry in our database when updates are
      made, having this file on your website ensures it is publically available with no additional 
      security adjustments necessary, and that you are the Administrator and can update your Course on our server. 
      It also indicates to us that your course is actively engaged on USGolfers Network.
      In addition, copying the data, altering it and placing it on another wesite will render it invalid.
    </p>
    {/if}

    <label><span>Policy Acceptance</span><input type="checkbox" value={1} bind:checked={U.policy} /></label>
    <div class="button-block">
      <button type="submit">Register</button>
      <button type="reset" on:click={()=>{U.answer="";}}>Reset</button>
    </div>
</form>
<style>
  .pointer{
    cursor:pointer;
  }
.Verbiage{
  max-width:500px;
}
</style>
