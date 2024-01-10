import {postPacketPromise} from "../forms.js";
import {content} from "./afeed.js"; 
export class Feed{
    #src;
    #nodeTag="item";
    //aDescriptors: [{tag:tag,query:list|string|date}]
    // isList performs a queryAll and return field as an array of  
    #Root = {
        tag:"item",
        aDescriptors:[
            {name:"id",tag:"guid"},
            {tag:"title"},
            {tag:"link"},
            {name:"author",tag:"dc_creator"},
            {name:"published",tag:"pubDate"},
            {name:"aCategories",tag:"category",isList:1},
            {tag:"description"}
        ]
    };
    #length=-1;
    #content=""
    #parsed=false;
    #aItems=[];
    #aNodes=[];
    constructor(url,options={}){
        this.#Root.tag = options.nodeTag || "item";
        this.#src = url;
        this.open();
    }
    set source(src){
        // Clean Up
        this.#src = src;
    }
    open(){
        this.#content = new window.DOMParser().parseFromString(content, "text/xml");
        return;
        var jPacket = {
            url : "/api/submit.asp",
            method : "POST",
            action : "external-feed",
            jForm : {
                action : "external-feed",
                userid:1,
                url:this.#src
            }
        };
        postPacketPromise(jPacket).then((jResp)=>{
            this.#content = jResp.content;
            console.log("fetch:",jResp.content);
        });
    }
    fnNodes(){
        if(this.#length >= 0) return this.#aNodes;
        this.#aItems = [];
        this.#aNodes = this.#content.querySelectorAll(this.#Root.tag);
        this.#length = this.#aNodes.length;
        return this.#aNodes;
    }
    fnData(){
        if(this.#length < 0) this.fnNodes();
        if(this.#length == 0) return this.#aItems;
        // Already retrieved the root Nodes
        let aDescriptors = this.#Root.aDescriptors;
        this.#aItems;
        this.#aNodes.forEach((Node)=>{
            let Item = {};
            aDescriptors.forEach(Descriptor=>{
                if(Descriptor.isList){
                    let aList = Item[Descriptor.name || Descriptor.tag] = [];
                    Node.querySelectorAll(Descriptor.tag).forEach(C=>aList.push(C.textContent));
                }
                else{
                    let Child = Node.querySelector(Descriptor.tag);
                    if(Child) Item[Descriptor.name || Descriptor.tag] = Child.textContent;
                }
            });
            this.#aItems.push(Item);
        });
        this.#parsed = true;
    }
    get content(){
        return this.#length;
    }
    get content(){
        return this.#content;
    }
    get Items(){
        if(!this.#parsed) this.fnData();
        return this.#aItems;
    }
    get Nodes(){
        if(!this.#parsed) this.fnNodes();
        return this.#aNodes;
    }
}
