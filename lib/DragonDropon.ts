const NONE     = "none";
const ALL      = "all";
const MOVE     = "move";
const COPY     = "copy";
const LINK     = "link";

const COPYLINK = "copylink";
const COPYMOVE = "copymove";
const LINKMOVE = "linkmove";

const EMPTY   = undefined;
const ENTERED = 1;
const EXITED  = 2;
const STARTED = 3;
const OVER    = 5;
export const DROPPED = 4;
export const HOME    = 6;
export const THROWN   = 7;


export class Drag{
    effectAllowed  = MOVE;
    #state         = 0;
    targetId       = "";
    #data          = undefined;
    #draggable      =true;
    Element = {
        x:0,
    }
    constructor(id,options={}){
        this.#data = options.data || [];
        const self = this;
        switch(options.effectAllowed){
            case NONE:      this.effectAllowed = NONE;break;
            case ALL:       this.effectAllowed = ALL;break;
            case MOVE:      this.effectAllowed = MOVE;break;
            case COPY:      this.effectAllowed = COPY;break;
            case LINK:      this.effectAllowed = LINK;break;
            case COPYLINK:  this.effectAllowed = COPYLINK;break;
            case COPYMOVE:  this.effectAllowed = COPYMOVE;break;
            case LINKMOVE:  this.effectAllowed = LINKMOVE;break;
            default:        this.effectAllowed = MOVE;
        }
        this.dragstart=(e)=>{
            this.Element.x=e.clientX;
            this.#state=STARTED;
            if(options.image){
                e.dataTransfer.setDragImage(options.image, 0, 0);
            }
            e.dataTransfer.dropEffect = this.effectAllowed;
            e.dataTransfer.setData("text", e.target.getAttribute('id'));
            if(options.dragstart) options.dragstart(e);
        }
        this.dragend=(e)=>{
            let result = e.dataTransfer.dropEffect;
            if(e.dataTransfer.dropEffect == NONE){
                this.#state = (Math.abs(e.clientX-this.Element.x) > e.target.clientWidth) ? THROWN : HOME;
                if(this.#state==HOME && options.nochange) options.nochange(e,self.#data);
                if(this.#state==THROWN && options.thrown) options.thrown(e,self.#data);
            }
            else{
                this.#state = DROPPED;
                if(options.dropped) options.dropped(e,self.#data);
            }
            if(options.Dropon) options.Dropon.dropped(e,self.#data);
            if(options.dragend) options.dragend(e,result,self.#data);
        }
    }
    get draggable(){return this.#draggable;}
    set draggable(v){this.#draggable = v ? true:false;}
    get state(){
        return this.#state;   
    }
    set clear(v){
        return this.#state=EMPTY;   
    }
    get status(){
        switch(this.#state){
            case ENTERED: return `Sure, hand me off!`;
            case EXITED:  return `I'm in limbo, man!`;
            case STARTED: return `I'm off for a ride!`;
            case DROPPED: return `Gone to my new abode!`;
            case OVER:    return `Still Over Here!`;
            case HOME:    return `That was uneventful!`;
            case THROWN:  return `Hey! you tossed me!`;
            default:      return "";
        }         
    }
    drag=undefined;
}
export class Drop{
    dropEffect;
    id;
    targetId;
    #state;
    constructor(id,options = {}){
        this.id=id;
        switch(options.dropEffect){
            case NONE:      this.dropEffect = NONE;break;
            case MOVE:      this.dropEffect = MOVE;break;
            case COPY:      this.dropEffect = COPY;break;
            case LINK:      this.dropEffect = LINK;break;
            default:        this.dropEffect = MOVE;
        }
        this.dragover=(e)=>{
            if(options.dragenter) options.dragenter(e); 
            return false;
        }
        this.dragenter=(e)=>{
            if(this.#state !== ENTERED){
                console.log("Drag Enter event:",e);
                this.targetId = e.target.getAttribute('id');
                e.dataTransfer.setData("state", this.#state = ENTERED);
                if(options.dragenter) options.dragenter(e);
            }
        }
        this.dragleave=(e)=>{
            console.log("Drag Leave event:",e);
            this.targetId = e.target.getAttribute('id');
            e.dataTransfer.setData("state", this.#state=EXITED);
            if(options.dragleave) options.dragleave(e);
        }
        this.drop=(e)=>{
            console.log("Drag Drop event:",e);
            const id = e.dataTransfer.getData("text");
            e.dataTransfer.setData("state", this.#state=DROPPED);
            e.preventDefault();
            if(options.drop) options.drop(e);
        }
        this.dropped=(e,data)=>{ 
            if(options.dropped) options.dropped(e,data);
        }
    }
}
