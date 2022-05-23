<template>
  <div class="comments">
      <div class="commentsInner">
          <div class="nav4">
              <div><span class="iconfont icon-fanhui" @click="back"></span><span>评论({{playlist.commentCount}})</span></div>
              <div class="iconfont icon-fenxiang"></div>
          </div>
          <div class="commentsCon">
                <div class="headercom">
                    <div><img :src="playlist.coverImgUrl" alt=""></div>
                    <div>
                        <p>{{playlist.name}}</p>
                        <p><span>by</span>{{nickname}}</p>
                    </div>
                    <div @click="back">
                        <span></span>
                    </div>
                </div>
                <div class="white"></div>
                <div class="title">
                    <p>评论区</p>
                    <p><span>推荐</span><span>最热</span><span>最新</span></p>
                </div>
                <div class="commentList">
                    <ul>
                        <li v-for="(ele,index) in comments">
                            <div class="top">
                                <div>
                                    <img :src="ele.user.avatarUrl" alt="" srcset="">
                                </div>
                                <div class="message">
                                    <div>
                                        <p>{{ele.user.nickname}}</p>
                                        <p>2022-03-20</p>
                                    </div>
                                    <div>
                                        <span>{{ele.likedCount}}</span>
                                        <span class="iconfont icon-zan"></span>
                                    </div>
                                </div>
                            </div>

                            <div class="bottom">
                                <div>{{ele.content}}</div>
                                <div v-show="ele.beReplied.length">{{ele.beReplied.length}}条回复<span></span></div>
                            </div>
                        </li>
                    </ul>
                </div>
          </div>
          <div class="commentsFloor">
              <div>
                 <input type="text" v-model="comment">
              </div>
              <input type="button" value="发送" :disabled="comment?false:true" @click="sendcom">
          </div>
      </div>
  </div>
</template>

<script>
import { mapState,mapGetters } from 'vuex'
import { sendComment } from '../api'
export default {
    data(){
        return{
           comment:"",
           comments:[],
        }
        
    },
    name:"comments",
    mounted() {
        this.$store.dispatch("comment",{id:this.$route.query.id});
        this.$store.dispatch('Detail',this.$route.query.id);
    },
    computed:{
        ...mapState({commentAll:state=>state.comment.comment.comments}),
        ...mapGetters(["playlist"]),
        nickname(){
            let result = this.playlist.creator || {}
            return result.nickname
        }
    },
    methods:{
        back(){
            this.$router.back()
        },
        async sendcom(){
            const param={
                t:1,
                type:2,
                id:this.playlist.id,
                content:this.comment
            }
         
            try{
                let value = await sendComment(param)
                if(value.status == 200){
                    await this.$store.dispatch("comment",{id:this.$route.query.id});
                    this.comments= this.$store.state.comment.comment.comments; 
                }
            }catch(error){
                console.log(error)
            }
                    
            this.comment=""
            
        }
    },
    watch:{
        commentAll:{
            immediate:true,
            handler(){
                this.comments = this.commentAll
            }
        }
    }
}
</script>

<style lang="less" stoped>
.comments{
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    position: absolute;        
    top: 0;
    left:0;
    .commentsInner{
        width: 100%;
        height: 100%;
        box-sizing:border-box;
        .nav4{
            width: 100%;
            box-sizing: border-box;
            height:3rem;
            padding: 0 .5rem;
            background-origin:content-box;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 1rem;
            color:rgb(0, 0, 0);
            div:first-child{
                display: flex;
                align-items: center;
                span:first-child{
                    margin-right: .2rem;
                    font-size:1.3rem;
                }
            }
            div:last-child{
                font-size:1.3rem;
            }
        }
        .commentsCon{
            height:calc(100% - 2.3rem);
            overflow: auto;
            .headercom{
                width:100%;
                display: flex;
                box-sizing: border-box;
                padding: 0 .5rem;
                height: 4rem;
                div:nth-child(1){
                    width:3.5rem;
                    height: 3.5rem;
                    background-color: aqua;
                    border-radius: .5rem;
                    overflow: hidden;
                    img{
                        width: 100%;
                    }
                }
                div:nth-child(2){
                    width: 10.5rem;
                    height:3.5rem;
                    padding-left: .5rem;
                    box-sizing: border-box;
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                    font-size:.8rem;
                    p:first-child{
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp:2;
                        -webkit-box-orient:vertical;
                    }
                    p:last-child{
                        font-size:.7rem;
                        color:rgb(0, 162, 226);
                        span{
                            color:rgb(129, 129, 129);
                            margin-right: .2rem;
                        }
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
                div:nth-child(3){
                    width: 1rem;
                    height: 3.5rem;
                    line-height: 3.5rem;
                    text-align: center;
                    span{
                        display: inline-block;
                        width: .5rem;
                        height: .5rem;
                        border-top:.1rem solid rgb(129, 129, 129);
                        border-right:.1rem solid rgb(129, 129, 129);
                        transform: rotate(45deg);
                    }
                }
            }
            .white{
                width:100%;
                height: .5rem;
                background-color: rgb(240, 240, 240);
            }
            .title{
                width:100%;
                box-sizing: border-box;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size:.9rem;
                height: 2rem;
                padding: 0 .5rem;
                background-color: white;
                p:first-child{
                    font-weight: 600;
                }
                p:last-child{
                    font-size:.7rem;
                    color:rgb(126, 126, 126);
                    
                    span:nth-child(2){
                        display: inline-block;
                        margin: 0 .25rem;
                        padding:0 .25rem;
                        border-right:.1rem solid rgb(158, 158, 158);
                        border-left: .1rem solid rgb(158, 158, 158);
                    }
                }
            }
            .commentList{
                width: 100%;
                padding:0 .5rem;
                box-sizing: border-box;
                margin-bottom: 3rem;
                li{
                    width:100%;
                    
                    .top{
                        width:100%;
                        height: 3.2rem;
                        display: flex;
                        align-items: center;
                        font-size: .7rem;
                        color:rgb(156, 156, 156);
                        &>div:nth-child(1){
                            width: 2rem;
                            height: 2rem;
                            border-radius:50%;
                            overflow: hidden;
                            img{
                                width: 100%;
                            }
                        }
                        .message{
                            width: 12.5rem;
                            height: 2rem;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            margin-left:.3rem;
                            div:first-child{
                                color:rgb(133, 133, 133);
                                p:nth-child(2){
                                    font-size:.6rem;
                                    color:rgb(187, 187, 187);
                                }
                            }
                            div:last-child{
                                span:nth-child(2){
                                    margin-left: .2rem;
                                    font-size:1rem;
                                }
                            }
                        }
      
                    }                  
                    .bottom{
                        width: 12.5rem;
                        margin-left: 2.5rem;
                        position: relative;
                        padding: .5rem 0;
                        font-size:.9rem;
                        div:nth-child(1){
                            width: 100%;
                            color:rgb(80, 80, 80);
                        }
                        div:nth-child(2){
                            color:rgb(0, 171, 238);
                            font-size: .8rem;
                            display: flex;
                            align-items: center;
                            span{
                                display: inline-block;
                                width: .4rem;
                                height: .4rem;
                                border-top:.1rem solid rgb(0, 171, 238);
                                border-right:.1rem solid rgb(0, 171, 238);
                                transform: rotate(45deg);
                            }
                        }
                    }
                    .bottom::after{
                        content:"";
                        height: 1px;
                        width:100%;
                        background-color: rgb(218, 218, 218);
                        position: absolute;
                        bottom: 0;
                    }
                }
            }
        }
        .commentsFloor{
            width:100%;
            height: 2.3rem;
            background-color: rgb(243, 243, 243);
            position: fixed;
            bottom:0;
            left: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            input{
            outline:none;
            border:none;
            background: none;      
            }
            &>div{
                display: flex;
                align-items: center;
                margin-right:.5rem;
                input{
                    width: 10rem;
                    height:1.5rem;
                    background-color: white;
                    font-size:.7rem;
                    padding:0 .75rem;
                    border-radius: .8rem;
                }
            }
            &>input{
                padding: .3rem .5rem;
                font-size:.7rem;
                color:rgb(124, 124, 124)
            }
        }
    }
}
</style>