import Vue from 'vue'

import Vuex from 'vuex'

Vue.use(Vuex)

import singList from './singList.js'
import playlist from './playlist.js'
import Login from './Login.js'
import comment from './comment.js'
import sublist from './sublist.js'

export default new Vuex.Store({
    modules:{
        singList,
        playlist,
        Login,
        comment,
        sublist
    }
})