import singList from "../pages/singList.vue"
import sublist from "../pages/sublist.vue"
import search from "../pages/search.vue"
import playlist from '../pages/playlist.vue'
import login from '../pages/login.vue'
import comments from '../pages/comments.vue'

export default[
    {
        path:'/comments',
        component:comments,
        meta:{fail:false}
    },
    {
        path:'/login',
        component:login,
        meta:{fail:false}
    },
    {
        path:'/playlist',
        component:playlist,
        meta:{show:false,fail:true}
    },
    {
        path:'/search',
        component:search,
        meta:{show:true,fail:true}
    },
    {
        path:'/singlist',
        component:singList,
        meta:{show:true,fail:true}
    },
    {
        path:'/sublist',
        component:sublist,
        meta:{show:true,fail:true}
    },
    {
        path:'*',
        redirect:"/singlist"
    }
]