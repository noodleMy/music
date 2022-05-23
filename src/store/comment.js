import {reqComment} from "../api"

let state = {
    comment:{}
}
let actions = {
    async comment({commit},params){
        let result = await reqComment(params)
        if(result.status==200){
            commit("COMMENT",result.data)
        }
    }
}
let mutations = {
    COMMENT(state,comment){
        state.comment = comment
    }
}
let getters = {}

export default {
    state,
    actions,
    mutations,
    getters
}