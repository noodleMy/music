import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import store from '../store'

let originPush = VueRouter.prototype.push
let originReplace = VueRouter.prototype.replace

VueRouter.prototype.push = function(location,resolve,reject){
    if(resolve&&reject){
        originPush.call(this,location,resolve,reject)
    }else{
        originPush.call(this,location,()=>{},()=>{})
    }
}
VueRouter.prototype.replace = function(location,resolve,reject){
    if(resolve&&reject){
        originReplace.call(this,location,resolve,reject)
    }else{
        originReplace.call(this,location,()=>{},()=>{})
    }
}

import routes from './routes.js'

let router =  new VueRouter({
    //配置路由
    routes
})

router.beforeEach(async (to,form,next)=>{
    let token = store.state.Login.token
    let name = store.state.Login.account.profile
    
    if(token){
        if(to.path == '/login'){
            next('/singlist')
        }else{
            if(name){
                next()
                console.log("name")
            }else{
                try{
                    await store.dispatch('Account')
                    console.log("Account")
                    next();  
                }catch(error){
                    await store.dispatch('Logout');
                    next('/login');
                }

            }
        }
    }else{
        console.log("啥都没有")
        next()
    }
})

export default router