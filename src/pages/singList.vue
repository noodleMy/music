<template>
      <div class="content">
          <h2>编辑推荐</h2>
          <div class="songList">
            <a @click="playlist(item.id)" v-for="(item,index) in personalizedResult" :key="item.id"><div class="single"><img :src="item.picUrl" alt=""><span></span></div><div class="ptext">{{item.name}}</div></a>
          </div>

          <h2>最新音乐</h2>
          <ul class="sing">
              <li class="fn-line"  @click="taggle(item.id,item.picUrl,item.song.artists[0].name,item.name)" v-for="(item,index) in newSong" :key="item.id">
                  <a>
                    <div class="left">
                        <div class="singName">{{item.name}}</div>
                        <div class="singAuthor">
                            <span></span>{{item.song.artists[0].name}}-{{item.name}}
                        </div>
                    </div>
                    <div class="right"></div>
                  </a>
              </li>
          </ul>
      </div>
</template>

<script>
import{mapGetters, mapState} from 'vuex'
export default {
    name:"singList",
    data(){
        return{
            isOne:'one'
        }
    },
    computed:{
        ...mapGetters(["personalizedResult"]),
        ...mapState({
            newSong:state=>state.singList.newSong,
            check:state=>state.singList.check
        })
    },
    methods: {
        //要做防抖
        async taggle(id,picUrl,songsing,name){

            if(this.isOne != id){
                
                try{
                    let result = await this.$store.dispatch('Check',id)
                    if(result){
                    let url = await this.$store.dispatch('Song',id)
                    url = url.data[0].url
                    //开关提前写
                    this.isOne = id
                    let myMusic = {picUrl,songsing,songname:name,musicurl:url}
                    this.$bus.$emit("message",this.isOne,myMusic)
                    
                    }else{
                        alert("音乐暂无版权")
                    }
                }catch(error){
                    alert(error.message)
                }
            }else{
                this.isOne = 'one'
                this.$bus.$emit("message",this.isOne)
            }
            
        },
        playlist(id){

            this.$router.push({path:"/playlist",query:{id}})
        }
    },
    mounted() {
        this.$store.dispatch("CategoryList",6),
        this.$store.dispatch("Newsong",10)
    },
}
</script>

<style lang="less" stoped>
.content{
    width: 100%;
    padding-top:3.5rem;
    box-sizing: border-box;
    h2{
        height: 2rem;
        line-height: 2rem;
        font-size: 0.8rem;
        padding-left:0.5rem;
        position: relative;
        font-weight: 500;
        &::after{
            content:"";
            display: block;
            position: absolute;
            width: .1rem;
            height: 1rem;
            top:.5rem;
            left:0;
            background-color: #2ebbf3;
        }
    }
    .songList{
        width:100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        box-sizing:border-box;
        a{
            width: 5.3rem;
            height: 7rem;
            margin-bottom:.3rem;
            .single{
                width: 5.3rem;
                height: 5.3rem;
                background: rgb(103, 186, 255);
                img{
                    display: block;
                    width: 100%;
                }

            }
            .ptext{  
                width:5rem;
                padding-left: .1rem;
                height: 1.7rem;
                font-size:.6rem;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }
        }
    }
    .sing{
        box-sizing: border-box;
        width: 100%;
        padding: 0px 0px 0px .5rem;
        li{
            position: relative;
            padding-right: .5rem;
            a{              
                padding: .4rem 0rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .left{
                    width: 85%;
                    .singName{
                        font-size: .75rem;
                        margin-bottom: .15rem;
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
                            margin-right:.2rem;
                            
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
                
            }
            &::after{
                content: "";
                position: absolute;
                width:100%;
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
</style>