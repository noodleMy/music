import {reqCategoryList,reqNewsong,reqCheck, reqSong} from "../api"
let state ={
    personalized:{},
    newSong:[],
    check:{}
}
let actions ={

    async CategoryList({commit},limit){
        let result = await reqCategoryList(limit)
        if(result.status == 200){
            commit("CATEGORYLIST",result.data)
            
        }
    },
    async Newsong({commit},limit){
        let result = await reqNewsong(limit)
        if(result.status == 200){
            commit("NEWSONG",result.data)
        }
    },
    async Check({commit},id){
        let result = await reqCheck(id)
        if(result.status == 200){
            commit("CHECK",result.data)
            return result.data.success
        }else{
            return Promise.reject(new Error('faile'))
        }
    },
    async Song({commit},id){
        let result = await reqSong(id);
        if(result.status == 200){
            return result.data
        }else{
            return Promise.reject(new Error('faile'))
        }
    }
}
let mutations ={
    CATEGORYLIST(state,CategoryList){
        state.personalized = CategoryList
    },
    NEWSONG(state,Newsong){
        let newSong = Newsong.result.filter(element => {
            return (element.song.fee != 4) && (element.song.fee != 1)
        });
        state.newSong = newSong
    },
    CHECK(state,Check){
        state.check = Check
    }

}
let getters ={
    personalizedResult(state){
        return state.personalized.result
    }
}

export default{
    state,
    actions,
    mutations,
    getters
}