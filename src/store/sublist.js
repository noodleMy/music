import {topList} from '../api'

let state = {
    topMusicListIds:[]
}
let actions = {
    async topMusic({commit}){
        let result = await topList()
        if(result.status == 200){
            commit("TOPMUSIC",result.data)
        }else{
            console.log("sublist出错了")
        }
    }
}
let mutations = {
    TOPMUSIC(state,topMusic){
        state.topMusicListIds = topMusic
    }
}
let getters = {}

export default{
    state,
    actions,
    mutations,
    getters
}