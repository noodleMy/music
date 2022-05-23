import { reqLogin,reqLoginOn,reqAccount,reqLogout } from "../api"
import {setToken,getToken, removeToken} from "../utiles/token.js"

let state = {
    token:getToken(),
    account:{}

}
let actions = {
    // 登录
    async Login({commit},data){
        let result = await reqLogin(data)
        if(result.status == 200){
            setToken(result.data.token) 
            commit("LOGIN",result.data)
            return result.data.code
        }
    },
    //登录状态
    async LoginOn({commit}){
       let result = await reqLoginOn()
    },
    //登录一次后，就能随时获取用户信息
    async Account({commit}){
       let result = await reqAccount()
       if(result.status == 200){
           commit("ACCOUNT",result.data)
       }
    },
    async Logout({commit}){
        let result = await reqLogout()
        if(result.status == 200){
            commit("CLEAR")
            return "ok"
        }else{
            return Promise.reject(new Error('faile'))
        }
    }
    
}
let mutations = {
    LOGIN(state,Login){
        state.token = Login.token
    },
    ACCOUNT(state,Account){
        state.account = Account
    },
    CLEAR(state){
        state.token="";
        state.account="";
        removeToken()
    }
}
let getters = {}

export default{
    state,
    actions,
    mutations,
    getters
}