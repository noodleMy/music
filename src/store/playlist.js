import { reqDetail, reqPlaylistTrack } from "../api"

let state = {
    detail:{},
    track:{}
}
let actions = {
    async Detail({commit},id){
        let result = await reqDetail(id)
        if(result.status == 200){
            commit("DETAIL",result.data)
        }
    },
    async Track({commit},params){
        let result = await reqPlaylistTrack(params)
        if(result.status == 200){
            commit("TRACK",result.data)
        }else{
            return Promise.reject(new Error('faile'))
        }
    }
}
let mutations = {
    DETAIL(state,Detail){
        state.detail = Detail
    },
    TRACK(state,Track){
        state.track = Track
    }
}
let getters = {
    playlist(state){
        return state.detail.playlist || {}
    },
    creator(state){
        let playlist = state.detail.playlist || {}
        return playlist.creator || {}
    },
    songs(state){
        return state.track.songs || []
    }
}

export default{
    state,
    actions,
    mutations,
    getters
}