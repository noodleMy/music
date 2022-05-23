<template>
  <div class="playlist">
      <div class="playContent">
          <div class="header"><span class="iconfont icon-fanhui" @click="goSingList"></span><span>歌单</span><span class="iconfont icon-gengduo1"></span></div>
          <div class="songlist">
              <div class="person">
                    <div class="personImg"><img :src="playlist.coverImgUrl" alt=""></div>
                    <div class="personText">
                        <p>{{playlist.name}}</p>
                        <p>
                            <span><img :src="creator.avatarUrl" alt=""></span>
                            <span>{{creator.nickname}}</span>
                            <span class="iconfont icon-shoucang"></span>
                        </p>
                        <p>{{playlist.description}}</p>
                    </div>
              </div>
              <div class="commentsPlaylist">
                  <div>
                      <ul>
                        <li><span class="iconfont icon-tianjiadao"></span><span>{{playlist.subscribedCount}}</span></li>
                        <li @click="comments"><span class="iconfont icon-pinglun"></span><span>{{playlist.commentCount}}</span></li>
                        <li><span class="iconfont icon-fenxiang"></span><span>{{playlist.shareCount}}</span></li>
                      </ul>
                  </div>
              </div>
              <div class="fixed">
                  <span class="iconfont icon-iconset0481"></span>
                  <span>播放全部<span style="font-size:.8rem;color:rgb(202,202,202)">(共{{playlist.trackCount}}首)</span></span>
              </div>
              <div class="songContent">
                    <ul class="sing">
                        <li v-for="(song,index) in songs" :key="song.id" @click="changeSong(index)">
                            <a>
                            <div class="serial"><span>{{index+1>9?index+1:"0"+(index+1)}}</span></div>
                            <div class="serialSing fn-line">
                                <div class="left">
                                    <div class="singName">{{song.name}}</div>
                                    <div class="singAuthor">
                                        <span></span>{{song.ar[0].name}}-{{song.name}}
                                    </div>
                                </div>
                                <audio src=""></audio>
                                <div class="right"></div>
                            </div>

                            </a>
                        </li>
                    </ul>
              </div>
              <div class="pageBottom">
                  到底了(-_-)~~
              </div>
          </div>
          
      </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
    name:'playlist',
    data(){
        return{
            songsId:[],
            songUrl:[],
            urldata:[]
        }
    },
    mounted() {
        this.$store.dispatch('Detail',this.$route.query.id);
    },
    computed:{
        ...mapState({
            detail:state=>state.playlist.detail
        }),
        ...mapGetters(["playlist"]),
        ...mapGetters(["creator"]),
        ...mapGetters(["songs"])
    },
    methods: {
        goSingList(){
            this.$router.push('/singling')
        },
        changeSong(index){
            this.$bus.$emit('change',index)
        },
        comments(){
            this.$router.push({path:"/comments",query:{id:this.$route.query.id}})
        }
    },
    watch:{
        playlist:{
            handler(){
                //派发任务获取歌单中的歌曲信息
                try{
                    this.$store.dispatch('Track',{id:this.$route.query.id,limit:this.playlist.trackCount,offset:1});
                }catch(error){
                    console.log(error)
                }
            }
        },
        //监测songs挂载，挂载后就发请求获取url
        songs:{
            async handler(){
                this.songsId = []
                this.songs.forEach((element)=>{
                    this.songsId.push(element.id)
                })
                try{
                    this.songUrl =await this.$store.dispatch('Song',this.songsId.join())
                    this.urldata = []
                    if(this.songUrl.code == 200){
                        //获取到的url顺序有问题，这里重排一下
                        for(let i =0 ; i<this.songs.length;i++){
                            for(let g=0; g<this.songs.length;g++){
                                if(this.songsId[i]==this.songUrl.data[g].id){
                                    
                                    this.urldata.push(this.songUrl.data[g])
                                }
                            }
                        }
                       this.$bus.$emit("songsUrl",this.urldata,this.songs) 
                    }
                }catch(error){
                    console.log(error)
                }
            }
        }
    }
}
</script>

<style lang="less" scoped>
    .playlist{
        width:100%;
        height: 100%;
        overflow:hidden;
        position: absolute;
        top:0;
        left:0;    
        .playContent{
            width:100%;
            height: 100%;
            box-sizing: border-box;
            overflow: auto;
            .header{
                width:100%;
                height:3rem;
                background-color: rgba(255, 255, 255, 0);
                position: absolute;
                font-size:1.1rem;
                color:rgb(255, 255, 255);
                span:nth-child(1){
                    position: absolute;
                    left:.5rem;
                    bottom:.5rem;
                    font-size:1.3rem;
                }
                span:nth-child(2){
                    position: absolute;
                    left:2rem;
                    bottom:.5rem;
                }
                span:nth-child(3){
                    position: absolute;
                    right:.5rem;
                    font-size:1.3rem;
                    bottom:.5rem;
                }
            }
            .songlist{
                height: 100%;
                .person{
                    padding-top: 2.5rem;
                    width:100%;
                    height:8.5rem;
                    background-color: #2ebbf3;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    .personImg{
                        width:5rem;
                        height:5rem;
                        border-radius: .5rem;
                        background-color: aliceblue;
                        margin-right: .4rem;
                        box-shadow:0rem -.5rem .1rem -.1rem rgba(0, 0, 0, 0.5);
                        overflow:hidden;
                        img{
                            width:100%;
                        }
                    }
                    .personText{
                        width: 9.6rem;
                        height: 5rem;
                        display:flex;
                        flex-direction: column;
                        justify-content: space-between;
                        p:nth-of-type(1){
                            font-size: .8rem;
                            letter-spacing: .1rem;
                            overflow:hidden;
                            text-overflow: ellipsis;
                            display:-webkit-box;
                            -webkit-line-clamp: 2;
                            -webkit-box-orient:vertical;
                            color:white;
                        }
                        p:nth-of-type(2){
                            font-size: .7rem;
                            letter-spacing: .05rem;
                            display: flex;
                            align-items: center;
                            color: rgba(248, 248, 248, 0.8);
                            span:nth-child(1){
                                width: 1.2rem;
                                height: 1.2rem;
                                border-radius:50%;
                                overflow: hidden;
                                img{
                                    width:100%;
                                }
                            }
                            span:nth-child(2){
                                margin:0 .1rem 0 .2rem;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
                            span:nth-child(3){
                                font-size: 1rem;
                            }
                        }
                        p:nth-of-type(3){
                            font-size: .7rem;
                            letter-spacing: .05rem;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space:nowrap;
                            color: rgba(248, 248, 248, 0.8);
                        }
                    }
                }
                .commentsPlaylist{
                    width: 100%;
                    height:2rem;
                    position: relative;
                    div{
                        position: absolute;
                        top:-1.15rem;
                        left:1.5rem;
                        width: 13rem;
                        height: 2.3rem;
                        border-radius: 1.5rem;
                        background-color: rgb(255, 255, 255);
                        box-shadow: -2px 2px 10px rgba(163, 163, 163, 0.5);
                        ul{
                            width: 13rem;
                            height: 2.3rem;                        
                            display: flex;
                            font-size: .8rem;
                            color:#888888;
                            li{
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                height: 2.3rem;
                                width: 4.3rem;
                            }
                            li:nth-child(2){
                                position:relative;
                                width: 4.4rem;
                            }
                            li:nth-child(2)::before{
                                position: absolute;
                                left: 0;
                                top:.5rem;
                                content: "";
                                background-color: #cacaca;
                                width: .12rem;
                                border-radius: .1rem;
                                height: 1.2rem;
                            }
                            li:nth-child(2)::after{
                                position: absolute;
                                right: 0;
                                top:.5rem;
                                content: "";
                                background-color: #cacaca;
                                width: .12rem;
                                border-radius: .1rem;
                                height: 1.2rem;
                            }
                            li span:nth-child(1){
                                font-size: 1.1rem;
                            }  
                        }

                    }
                }
                .fixed{
                    width: 100%;
                    height:2rem;
                    background-color: rgb(255, 255, 255);
                    font-size: 1rem;
                    box-sizing:border-box;
                    padding:0 .5rem;
                    display: flex;
                    align-items: center;
                    span:nth-child(1){
                        font-size: 1.2rem;
                        margin-right: .3rem;
                    }
                }
                .songContent{
                    .sing{
                        box-sizing: border-box;
                        width: 100%;
                        li{
                            position: relative;
                            padding: .2rem 0rem;
                            a{  
                                display: flex;
                                align-items: center;
                                .serial{
                                    text-align: center;
                                    font-size:.7rem;
                                    width:2rem;
                                }
                            .serialSing{
                                    width: 13.5rem;
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;                   

                                .left{
                                    width: 85%;
                                    .singName{
                                        font-size: .75rem;
                                        margin-bottom: .1rem;
                                         overflow: hidden;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                    }
                                    .singAuthor{
                                        span{
                                            display: inline-block;
                                            width:.6rem;
                                            height:.37rem;
                                            background: url(./images/index_icon_2x.png) no-repeat;
                                            background-size:7rem;
                                        }
                                        font-size:.6rem;
                                        color:rgb(168, 168, 168);
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                    }
                                }
                                .right{
                                    width:1.1rem;
                                    height: 1.1rem;
                                    background: url(./images/index_icon_2x.png) no-repeat;
                                    background-position:-1.14rem 0rem;
                                    background-size:8rem;
                                }
                                &::after{
                                content: "";
                                position: absolute;
                                width:100%;
                                height:100%;
                                bottom: 0;
                                border: 0 solid rgba(0,0,0,.1);
                                z-index: 2;
                                } 
                                }
        
                                .fn-line::after{
                                border-bottom-width:1px;
                                }
                            }
            

                        }

                    }
                }
                .pageBottom{
                    width: 100%;
                    height: 5.5rem;
                    background: rgb(240, 240, 240);
                    line-height:3rem;
                    text-align:center;
                    font-size:.7rem;
                    color:rgb(143, 143, 143);
                }
            }
        }
    }

</style>