<template>
  <div class="footer" :style="{bottom:$route.meta.show?0:-2.6+'rem'}">
      <div class="footerMusice" @click="goDetail">
          <div class="pic"><img :src="myMusic.picUrl" alt=""></div>
          <div class="disc"></div>
          <div class="control" >
              <div class="text"><span>{{myMusic.songname}}</span> <span v-show="myMusic.songname">-</span><span v-show="!myMusic.songname">无播放的歌曲</span> <span>{{myMusic.songsing}}</span></div>
              <!-- 确保有资源才能获取元素，防止报错 -->
              <audio v-if="myMusic.musicurl" :src="myMusic.musicurl" ref="myli"></audio>
              <div @click="on_off" class="iconfont play" :class="{'icon-zanting':pause,'icon-bofangzhong':play}"></div>
              <div class="iconfont icon-bofangduilie list"></div>
          </div>
      </div>
      <div class="footerDetail">
          <div>
              <div :class="{bj:true}">
                  <div class="iconfont icon-home"></div>
                  <span>首页</span>
              </div>
                <div>
                  <div class="iconfont icon-eye"></div>
                  <span>直播</span>
              </div>
                <div>
                  <div class="iconfont icon-live"></div>
                  <span>MV</span>
              </div>
                <div>
                  <div class="iconfont icon-me"></div>
                  <span>我的</span>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import {reqLyric} from '../api'
import throttle from "lodash/throttle"
export default {
    name:"songFooter",
    data(){
        return{
            pause:true,
            play:false,
            myMusic:{
                picUrl:"",
                songsing:"",
                songname:"",
                musicurl:''
            },
            double:0,
            playlistUrls:[],
            songsContent:[],
            songIndex:-1,
            contrast:0,
            //定时器
            time:"",
            //现在的时间
            Mcurrent:"",
            //音乐的总时间
            Mduration:"",
            //声音的大小
            Maudio:0.6,
            //进度条的定时器
            timeProgress:"",
            //歌词
            lyrice:""
        }
    },
    computed:{
        songC(){
            return this.song.artists || {}
        },
        itemData(){
            return {pause:this.pause,play:this.play,Mduration:this.shiftMduration}
        },
        // 时间毫秒转换正常显示时间
        shiftMduration(){
            let seconds = Math.floor(this.Mduration%60)
            if(seconds <10){
                seconds = "0"+seconds
            }
            let minute = parseInt(this.Mduration-seconds)/60
            if(minute <10){
                minute = "0"+minute
            }
            return minute+":"+seconds
        }
    },
    mounted() {
        this.$bus.$on("message",(id,myMusic)=>{
            if(id =="one"){
                this.double = 0
            }else{
                this.myMusic = {...this.myMusic,...myMusic}
                this.double++
            }
            
        })
        this.$bus.$on("songsUrl",(urls,songsContent)=>{
            this.playlistUrls = urls
            this.songsContent = songsContent
        })
        this.$bus.$on("change",(index)=>{
            this.songIndex = index
            this.contrast++
        })
        this.$bus.$on("suspend",(data)=>{
            if(this.pause != data.pause){
                this.$nextTick(()=>{
                    this.on_off()
                })
            }
        })
        this.$bus.$on("switchSong",(data)=>{
            this.songIndex+=data;
            if(this.songIndex==-1){
                this.songIndex = this.playlistUrls.length-1
            }
            if(this.songIndex>=this.playlistUrls.length){
                this.songIndex = 0
            }
            this.contrast++
        })
        this.$bus.$on("audioVoice",(data)=>{
            this.Maudio = data
        })
    },
    methods:{
        goDetail(){
            if(this.$route.path!='/playlist'){
                return
            }
            this.$bus.$emit("detail",true,this.myMusic,this.itemData)
        },
        async on_off(){
            //阻止冒泡
            if(event){
                event.stopPropagation()
            }
            if(this.myMusic.musicurl === ''){
                console.log("请选择要播放的音乐")
                return undefined
            }
            let audio = this.$refs.myli;
            audio.control = false
            this.playProgress()
            if(audio){
                //由于回调函数是匿名函数，所以this指向有问题，应该用箭头函数
                
                if(audio.ended || audio.paused){

                    if(this.$route.path != '/singlist'){
                        clearInterval(this.time)
                        //这个promise完全是解决下方automate()所尝试方法的一个，也不知是否有用
                        let promise = new Promise((resolve,reject)=>{
                             this.time =  setInterval(this.automate,1000)
                            resolve(this.time)
                        })
                        this.time = await promise
                        //console.log(this.time,"123")
                    }

                    audio.play()
                    this.pause = false;
                    this.play = true;
                }else{
                    this.pause = true;
                    this.play = false;
                    audio.pause()
                    if(this.$route.path != '/singlist'){
                        console.log("清除")
                        //console.log(this.time,"234")
                        clearInterval(this.time)
                        clearInterval(this.timeProgress)
                    }
                }
                if(this.$route.path != '/singlist'){
                    this.Mduration=this.songsContent[this.songIndex].dt/1000
                }
                
            }

        },
        //首页的暂停键
        img(){
            let audio = this.$refs.myli;
            if(audio.ended){
            this.pause = true;
            this.play = false;
            }

        },
        //自动播放下一首
        automate(){
            let audio = this.$refs.myli;
            //console.log(audio,"1")
            if(this.contrast!=-1&&audio.ended){
            //console.log(audio,"2")
            this.img()
            //下标增加
            this.songIndex++
            //修改监测对象，触发函数
            this.contrast = this.contrast == 1?0:1
            //就是因为下面这句话，弄了半天一直报错play()被pause()打断。原因是上一句话
            //用play()开启新音乐，但还没完全开启就被下面这句话直接用pause()打断
            //this.on_off()
            if(this.songIndex >= this.playlistUrls.length){
                this.songIndex = 0
        }}  
        },
        //音乐音量控制
        sound(){
            let audio = this.$refs.myli;
            if(audio==undefined){
                return
            }
            audio.volume = this.Maudio
        },
        //音乐进度条显示
        playProgress(){
            let audio = this.$refs.myli
            this.timeProgress=setInterval(()=>{
                this.Mcurrent = audio.currentTime;
            },100)
        }
        //
    },
    watch:{
        //首页音乐监测
        double:{
            handler(){
                this.$nextTick(()=>{
                    //开启定时器监测音乐是否播放结束，结束后自动变为暂停图片
                    let time = setInterval(this.img,1000)
                    let audio = this.$refs.myli;
                    
                    audio.control = false;
                    if(audio.ended || audio.paused){
 
                        this.pause = false;
                        this.play = true;
                        
                        //如果把这放到mounted中的话，会因找不到播放资源而报错，这是因为mounted没结束就没完全渲染完，
                        //而这句话就在mounted中，就是还没渲染完资源就播放，所以找不到资源
                        audio.play()
                    }else{
                        this.pause = true;
                        this.play = false;
                        audio.pause()
                        clearInterval(time)
                    }
                })
            }
        },
        //歌单的播放监测
        contrast:throttle(function(){
                if(this.songIndex != -1){
                    let musicurl = this.playlistUrls[this.songIndex].url
                    let songsing=""
                    let songname=""
                    let picUrl=""
                    if(this.$route.path === '/search'){
                       songsing = this.songsContent[this.songIndex].artists[0].name
                       songname = this.songsContent[this.songIndex].name
                       picUrl = this.songsContent[this.songIndex].artists[0].img1v1Url
                    }else{
                        songsing = this.songsContent[this.songIndex].ar[0].name
                        songname = this.songsContent[this.songIndex].name
                        picUrl = this.songsContent[this.songIndex].al.picUrl
                    }
                    let myMusic={musicurl,songsing,songname,picUrl}
                    this.myMusic = {...this.myMusic,...myMusic}
                    //这里的异步函数还是为了等 this.on_off()函数完全完成后在执行后面的语句
                    //这个函数正在执行，数据还没渲染完就执行下方的语句，会造成下面的语句拿不到最新的数据
                    this.$nextTick(async ()=>{
                        // 在歌曲播放之前就修改掉音量大小
                        await this.sound()
                        try{
                            let lyrice = await reqLyric({id:this.songsContent[this.songIndex].id})
                            this.lyrice = lyrice.data.lrc.lyric
                        }catch(error){
                            console.log(error)
                        }

                        clearInterval(this.time)
                        clearInterval(this.timeProgress)
                        await this.on_off()
                        //返回undefined
                        //console.log(result)
                        //刷新歌曲数据
                        this.$bus.$emit("transform",this.myMusic,this.itemData)
                        this.$bus.$emit("lyrice",this.lyrice)
                        this.contrast == 0
                        
                    })
                }
               
            },200),
        //修改音量大小
        Maudio:{
            //开始就进行监测
            immediate: true,
            handler(){
                this.$nextTick(()=>{
                     this.sound()
                })

            }
        },
        //进度条进程
        Mcurrent:{
            handler(){
                this.$bus.$emit("playProgress",this.Mcurrent,this.Mduration)
            }
        }
    }
    
}
</script>

<style stoped lang="less">
.footer{
    width: 100%;
    position: fixed;
    z-index:100;
    transition: bottom .5s;
    .footerDetail{
        width: 100%;
        height: 4.3rem;
        background-color:#f3f3f3;
        position: relative;
        &>div{
            position: absolute;
            bottom: 0;
            width:100%;
            display: flex;             
            &>.bj{
                color: #2ebbf3 !important;
            }
            &>div{
                color:rgb(119, 119, 119);
                .iconfont{
                    font-size: 1.5rem;
                    padding-bottom: .1rem;
                    
                }
                text-align: center;
                width:25%;
                height: 3rem;
                display: flex;
                justify-content: center;
                flex-direction: column;
                font-size: .6rem;

            }
        }
    }
    .footerMusice{
        width:100%;
        position: absolute;
        height: 3rem;
        top:-1.75rem;
        .control{
            width:15rem;
            height: 2.5rem;
            position: absolute;
            bottom:0rem;
            left: .5rem;
            border-radius:2rem;
            background-color: #2ebbf3;
            z-index: 1;
            display: flex;
            align-items: center;
            .text{
                position: absolute;
                left: 3.8rem;
                width: 6rem;
                color: #ffffff;
                font-size: .8rem;
                white-space: nowrap;
                overflow: hidden;
                span:nth-child(2){
                    font-size: .6rem;
                    color: #f0f0f0;
                }
            }
            .play{
                width:2rem;
                height:2rem;
                position: absolute;
                right:2.7rem;
                font-size: 1.8rem;
                display: flex;
                align-items: center;
                justify-content: center;
                color:#eeeeee;
            }
            .list{
                width:1.5rem;
                height:1.5rem;
                position: absolute;
                right:1rem;
                font-size: 1.2rem;
                display: flex;
                align-items: center;
                justify-content: center;
                color:#eeeeee;
            }
        }
        .disc{
            width: 1rem;
            height: 2.5rem;
            position: absolute;
            bottom:0rem;
            left: 3.3rem;
            z-index: 2;
            background: url(../pages/images/index_icon_2x.png) no-repeat;
            background-size:12rem;
            background-position:-.15rem -2.6rem ;
        }
        .pic{
            width: 2.8rem;
            height: 2.8rem;
            position: absolute;
            bottom:-1px;
            left: .5rem;
            border-radius:.2rem;
            z-index: 2;
            overflow: hidden;
            background-color: #2ebbf3;
            img{
                display: block;
                position:absolute;
                width: 100%;
            }
        }
    }
}
</style>