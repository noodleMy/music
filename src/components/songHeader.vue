<template>
        <div class="header">
          <div class="header_top">
              <div class="hamburg iconfont icon-menu" @click="FFF">
              </div>

              <p>Music Player</p>
          </div>

          <div class="header_nav">
              <router-link to="/singlist" active-class="line"><div>推荐音乐</div></router-link>
              <router-link to="/sublist" active-class="line"><div>热歌榜</div></router-link>
              <router-link to="/search" active-class="line"><div>搜索</div></router-link>
          </div>
          <div class="sidebar" ref="dis">
              <div class="glass" @click="FF" ref="glass"></div>
              <div class="fixed">
                <a @click="pushLogin" v-if="account.profile"><div><img :src="account.profile.avatarUrl" alt=""></div><span>{{account.profile.nickname}}</span><span class="arrows"></span></a>
              <a @click="pushLogin" v-else><div><img src="" alt=""></div><span>立即登录</span><span class="arrows"></span></a>
              <div class="content">
                <ul>
                  <li>功能</li>
                  <li>设置</li>
                  <li>夜间模式</li>
                  <li>定时关闭</li>
                  <li>音乐黑名单</li>
                </ul>
              </div>

              <div class="footer" @click="quit"><span>退出登录/关闭音乐</span></div>
            </div>
          </div>
      </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name:"songHeader",
    data(){
        return{
            isActive:1
        }
    },
    methods: {
        FF(){
            this.$refs.glass.style.display="none"
            this.$refs.dis.style.transform="translateX(-100%)"
        },
        FFF(){
            this.$refs.glass.style.display="block"
            this.$refs.dis.style.transform="translateX(0)"
        },
        pushLogin(){
            this.$router.push({path:"/login"})
        },
        async quit(){
            try{
               await this.$store.dispatch("Logout")
                this.$router.push('/singList')
            }catch(error){
                console.log(error)
            }
            
        },
        changeClass(i){
            this.isActive = i
        }
    },
    computed:{
        ...mapState({
            account:state=>state.Login.account
        })
    }
}
</script>

<style lang="less" scoped>
.header{
    width:100%;
    position: fixed;
    height:3.5rem;
    box-sizing: border-box;
    z-index: 1000;
    overflow: hidden;
    .header_top{
        width: 100%;
        height: 2rem;
        position: relative;    
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #2ebbf3;
        .hamburg{
            width:1.3rem;
            height: 1rem;
            font-size: .9rem;
            position: absolute;
            left:.5rem;
            display: flex;
            flex-direction:column;
            justify-content: space-around;
            color:aliceblue
        }    
        &>p{
            color: aliceblue;
            font-size: 0.9rem;
        }
    };
    
    .header_nav{
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: white;
        a{
            width: 30%;
            height: 1.5rem;
            text-align: center;
            font-size: 0.7rem;
            position: relative;
            div{
                display: inline-block;
                height: 1.5rem;
                line-height: 1.5rem;
                color:black;
                padding:0px 5px;
            };

                
        }
        .line::after{
                content:"";
                display: block;
                position: absolute;
                left: 0;
                bottom:0;
                width: 100%;
                height: 0.1rem;
                background: #2ebbf3;
                z-index: 10;
        }
        &::after{
            display: block;
            content:"";
            width: 100%;
            position: absolute;
            height: 1px;
            bottom:0;
            left: 0;
            background: rgba(22, 22, 22, 0.1);
        }
    }

    &>.sidebar{
        position: fixed;
        top:0;
        left:0;
        width:100%;
        height: 100%;
        transition: .5s;
        z-index: 1000;
        transform:translateX(-100%);
        box-sizing: border-box;
        .glass{
            width:100%;
            height: 100%;
            background: #5252524f;
            position: absolute;
            z-index: 0;
            display: none;
        }
        .fixed{
            z-index: 1;
            padding: 10px 20px 0px;
            background-color: #2ebbf3;
            width: 80%;
            height: 100%;
            overflow: auto;
            box-sizing: border-box;
            position: relative;
            &>a{
                width: 100%;
                box-sizing: border-box;
                padding:2rem 20px 5px;
                display: flex;
                align-items: center;
                position: absolute;
                background-color: #ffffff;
                z-index: 20;
                top: 0;
                left: 0;
                div{
                    width:1.8rem;
                    height:1.8rem;
                    background: rgb(196, 196, 196);
                    margin-right:.3rem;
                    border-radius: 50%;
                    overflow: hidden;
                    img{
                        width:100%
                    }
                }
                span{
                    font-size: 1rem;
                    color: rgb(83, 83, 83);
                }
                .arrows{
                    margin-left: .2rem;
                    width:.5rem;
                    height: .5rem;
                    border-top:.15rem solid rgb(83, 83, 83);
                    border-right: .15rem solid rgb(83, 83, 83);
                    transform: rotate(45deg);
                }
            } 
            .content{
                ul{
                    margin-top:1rem;
                    background-color:#ffffff;
                    border-radius:1rem;
                    padding:.4rem 0;
                    li{
                        box-sizing: border-box;
                        width: 100%;
                        height: 2.5rem;
                        line-height: 2.5rem;
                        padding:0 .5rem;
                        position: relative;

                        
                    }
                    li::after{
                        position:absolute;
                        display: block;
                        width:.6rem;
                        height: .6rem;
                        border-top:.15rem solid rgb(182, 182, 182);
                        border-right: .15rem solid rgb(182, 182, 182);
                        content: "";
                        transform: rotate(45deg);
                        z-index: 2;
                        right: 1rem;
                        top:.95rem;
                    }
                }
                
            }
            .footer{
                width: 100%;
                position:relative;
                top:30px;
                display: flex;
                justify-content: center;
                box-sizing: border-box;
                span{
                    color: rgb(235, 235, 235);
                    padding: .5rem 1rem;
                    background: #df6b6b;
                    border-radius: 2rem;
                }
            }
        }

    }
}
</style>