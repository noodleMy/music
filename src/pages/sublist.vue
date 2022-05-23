<template>
  <div class="content1" :style="{'overflow-y':show?'none':'hidden'}">
      <div class="banner">
          <div class="text"></div>
          <div class="data">更新日期：03月15日</div>
      </div>

        <ul class="sing" v-show="show">
            <li v-for="(song,index) in songs" :key="song.id" @click="changeSong(index)">
                <a>
                <div class="serial"><span>{{index+1}}</span></div>
                <div class="serialSing fn-line">
                    <div class="left">
                        <div class="singName">{{song.al.name}}</div>
                        <div class="singAuthor">
                            <span></span>{{song.ar[0].name}}-{{song.al.name}}
                        </div>
                    </div>
                    <audio src=""></audio>
                    <div class="right"></div>
                </div>

                </a>
            </li>
        </ul>

        <spinner v-show="!show"></spinner>
  </div>
</template>

<script>
import{mapGetters, mapState} from 'vuex'
import spinner from '../components/Spinner.vue'
export default {
    name:"sublist",
    components:{
        spinner
    },
    data(){
        return{
            music:[],
            songsId:[],
            songUrl:[],
            urldata:[],
            show:false
        }
    },
    mounted() {
        //派发获取歌单id信息的任务
        this.$store.dispatch("topMusic")
    },
    computed:{
        //整合歌单的id信息
        ...mapState({topListIds:state=>state.sublist.topMusicListIds.list}),
        //整合音乐的id信息
        ...mapGetters(["songs"])
    },
    methods: {
        changeSong(index){
            this.$bus.$emit('change',index)
        },
    },
    watch:{
        //歌单id获取到后就派发任务获取歌曲的id
        topListIds:{
            handler(){
                this.music = this.topListIds[0]
                let {id,trackCount} = this.music
                this.$store.dispatch("Track",{...{id,trackCount},offset:1})
            }
        },
        //监测songs挂载，挂载后就发请求获取url
        songs:{
            async handler(){
                this.show = true
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

<style scoped lang="less">
    .content1{
        width:100%;
        padding-top:3.5rem;
        box-sizing: border-box;
        overflow-x: hidden;
        margin-bottom: 5.6rem;
        .banner{
            width:100%;
            height: 7rem;
            background:#2ebbf3;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding-left: .6rem;
            .text{
                width:6rem;
                height:3.11rem;
                background: url(./images/index_icon_2x.png) no-repeat;
                background-position:-1rem -1rem;
                background-size:7rem;
                margin-bottom: .5rem;
            }
            .data{
                font-size: .5rem;
                color:rgb(236, 236, 236);
            }
        }
            .sing{
            box-sizing: border-box;
            width: 100%;
                li{
                    position: relative;
                    padding: .2rem 0rem;
                    a{  
                        padding-right: .5rem; 
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        color:#616161;

                        .serial{
                            width:12%;
                            text-align: center;
                            font-size:.7rem;
                        }
                        .serialSing{
                            width: 88%;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        .left{
                            width:calc(100% - 2rem);
                            .singName{
                                font-size: .75rem;
                                margin-bottom: .1rem;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space:nowrap;
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
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space:nowrap;
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
</style>