import { postPacketPromise } from "/lib/forms";
import { User } from "./User";
export const Articles = {
    jAllArticles : undefined,
    loading:0,
    async LoadArticles(){
        if(!Articles.jAllArticles){
            if(Articles.loading) return;
            Articles.loading=1;
            var jPacket = {
                url : "/api/submit.asp",
                method : "POST",
                action : "get-user-articles",
                jForm : {
                    action : "get-user-articles",
                    pageSize : 500,
                    userid:User.userid,
                }
            };
            await postPacketPromise(jPacket)
            .then( (jResp)=>{
                Articles.jAllArticles = jResp
                console.log("Articles:",jResp);
                Articles.loading=0;
                return Articles.jAllArticles;
            });
        }
        return Articles.jAllArticles;
    },
    get pending(){
        if(Articles.jAllArticles) return Articles.jAllArticles.pending;
        Articles.LoadArticles();
        return -1;        
    },
    get rejected(){
        if(Articles.jAllArticles) return Articles.jAllArticles.rejected;
        Articles.LoadArticles();
        return -1;
    }
}
