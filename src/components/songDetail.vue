<template>
  <div class="groundGlass" :style="{transform:detail?'translateY(0)':'translateY(100%)'}">
      <div class="header">
          <span class="iconfont icon-xialacaidan" @click="back"></span>
          <div>
              <span>{{myMusic.songname}}</span>
              <span>{{myMusic.songsing}}</span>
          </div>
          <span class="iconfont icon-fenxiang"></span>
      </div>
      <div class="songDetail">
        <div v-show="!isShow" @click="lyriceShow()">
            <lyrice></lyrice>
        </div>
        <div v-show="isShow" @click="lyriceShow()">
            <div>
                <div class="ral" :style="{animation:star?'ral 10s infinite linear':'none'}">
                    <img :src="myMusic.picUrl" alt="">
                </div>
            </div>
        </div>
        <div>
            <div class="iconfont icon-yinliang">
                <div @click.prevent="getprogress" ref="parentHeight">
                    <span ref="sublevelHeight" style="height:60%"></span>
                </div>
            </div>
            <span class="iconfont icon-shoucang"></span>
            <span class="iconfont icon-xiazai"></span>
            <span class="iconfont icon-pinglun"></span>
            <span class="iconfont icon-gengduo2"></span>
        </div>
      </div>
      <div class="contorl">
          <div>
              <span>{{countMcurrent}}</span>
              <div @click="playTime" ref="totalwidth">
                  <div ref="lineTime" style="width:0%"></div>
                  <div ref="dotTime" style="left:calc(0% - .2rem);"></div>
              </div>
              <span>{{itemData.Mduration}}</span>
          </div>
          <div> 
            <span class="iconfont icon-liebiaoxunhuan"></span>
            <span class="iconfont icon-shangyiqu" @click="switchSong(-1)"></span>
            <span class="iconfont" :class="{'icon-zanting':itemData.pause,'icon-bofangzhong':itemData.play}" @click="suspend(itemData)"></span>
            <span class="iconfont icon-xiayiqu" @click="switchSong(1)"></span>
            <span class="iconfont icon-bofangliebiao"></span>
          </div>
      </div>
  </div>
</template>

<script>
import lyrice from './lyrice.vue'
export default {
    name:"songDetail",
    components:{
        lyrice
    },
    data(){
        return{
            detail:false,
            myMusic:{},
            itemData:{},
            audioVoice:0.6,
            Mcurrent:"",
            Mduration:"",
            star:"",
            isShow:true
        }
    },
    mounted() {
        this.$bus.$on("transform",(myMusic,itemData)=>{
            this.myMusic = myMusic
            this.itemData = itemData
            
        })
        this.$bus.$on("detail",(data,myMusic,itemData)=>{
            this.detail = data
            this.myMusic = myMusic
            this.itemData = itemData
        })
        this.$bus.$on("playProgress",(Mcurrent,Mduration)=>{
            this.Mduration = Mduration
            this.Mcurrent = Mcurrent
        })
        
    },
    computed:{
        countMcurrent(){
            let seconds = Math.floor(this.Mcurrent%60)
            if(seconds <10){
                seconds = "0"+seconds
            }
            let minute = parseInt(this.Mcurrent-seconds)/60
            if(minute <10){
                minute = "0"+minute
            }
            
            return minute+":"+seconds
        }
    },
    methods:{
        back(){
            this.detail=false
        },
        turn(){
            //图片旋转
            console.log(123)
            console.log(this.itemData.play)
            if(this.itemData.play){
                this.star = true
            }else{
                this.star = false
            }
        },
        //暂停，播放
        suspend(itemData){
            itemData.pause = !itemData.pause
            itemData.play = !itemData.play
            this.turn()
            let data = {pause:itemData.pause,play:itemData.play}
            this.$bus.$emit("suspend",data)
        },
        async switchSong(data){
            this.$bus.$emit("switchSong",data)
            this.star = false
            await new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    this.turn()
                },800)
            }) 
            
        },
        //音乐声音进度条控制
        getprogress(){
            let offsetY = event.offsetY;
            let height = this.$refs.parentHeight.offsetHeight
            this.$refs.sublevelHeight.style.height = (offsetY/height*100)+"%";
            this.$bus.$emit("audioVoice",offsetY/height)
        },
        //音乐进度条控制播放的时间
        playTime(Mcurrent,Mduration){
            let offsetX = event.offsetX
            let width = this.$refs.totalwidth.offsetWidth
            this.$refs.lineTime.style.width = Math.ceil(offsetX/width*100)+"%";
            this.$refs.dotTime.style.left = "calc("+Math.ceil(offsetX/width*100)+"%"+" - "+"0.2rem)"
        },
        //动态音乐进度条
        Timeplay(Mcurrent,Mduration){
            this.$refs.lineTime.style.width = Math.ceil(Mcurrent/Mduration*100)+"%";
            this.$refs.dotTime.style.left = "calc("+Math.ceil(Mcurrent/Mduration*100)+"%"+" - "+"0.2rem)"
        },
        //切换页面
        lyriceShow(){
            this.isShow = !this.isShow
        }
    },
    watch:{
        Mcurrent:{
            handler(){
                this.Timeplay(this.Mcurrent,this.Mduration)
                
            }
        },
        //为什么自动播放下一首没有触发这个检测呢？因为数据在传入过来时，这个pause并没改变
        "itemData.pause":{
            handler(){
                this.turn()
            }
        }
    }

}
</script>

<style lang="less" stoped>
    .groundGlass{
        position: fixed;
        top:0px;
        left: 0px;
        z-index:2000;
        transition: .5s ease-in-out;
        background-color: rgb(114, 114, 114);
        width: 100%;
        height:100%;
        box-sizing: border-box;
        overflow: hidden;
        padding: 0 .5rem;
        .header{
            width: 100%;
            height:4rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            color:white;
            box-sizing: border-box;
            padding-top:1.3rem;
            span:nth-child(1){
                font-size: 1.5rem;
                
            };
            div:nth-child(2){
                width:11rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                span:nth-child(1){
                    font-size:1rem;
                    white-space: nowrap;
                    
                }
                span:nth-child(2){
                    font-size:.7rem;
                    opacity: .7;
                }
            };
            span:nth-child(3){
                font-size:1.5rem
            }
        }
        .songDetail{
            width: 100%;
            height: 20rem;
            position: relative;
            div:nth-child(2){
                position: absolute;
                width:11rem;
                height:11rem;
                background-color: rgba(240, 248, 255, 0.2);
                border-radius: 50%;
                top:50%;
                left: 50%;
                transform: translate(-50%,-65%);
                display: flex;
                justify-content: center;
                align-items: center;
                .ral{

                    width: 6rem;
                    height: 6rem;
                    border-radius: 50%;
                    overflow: hidden;
                    transform: rotate(0deg);
                    img{
                        width: 100%;
                    } 
                    

                }   

            }
            div:nth-of-type(3){
                width: 100%;
                display: flex;
                justify-content: space-around;
                color:aliceblue;
                position: absolute;
                bottom:.2rem;
                span{
                    font-size:1.4rem;
                }
                div:nth-child(1){
                    position: relative;
                    font-size:1.4rem;
                    &>div{
                        width:.2rem;
                        height: 3rem;
                        position: absolute;
                        background-color: rgba(240, 248, 255, 0.5);
                        top:-120%;
                        left:50%;
                        transform: translate(-50%,-50%) rotate(180deg);
                        visibility: hidden;
                        &>span{
                            width: .2rem;
                            background: whitesmoke;
                            display: block;
                        }
                    }
                    &:hover>div{
                        visibility: inherit;
                    }
                }
            }
        }
        .contorl{
            width: 100%;
            height: 4rem;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content:flex-end;
            div:nth-child(1){
                width: 100%;
                display: flex;
                justify-content: center;
                align-items:center;
                height: 1rem;
                span{
                    font-size:.6rem;
                    color: rgba(255, 255, 255, 0.6);
                    margin: 0 .3rem;
                }
                div{
                    width: 10rem;
                    margin: 0px .2rem;
                    border: 1px solid rgb(150, 150, 150);
                    height: .08rem;
                    border-radius: .1rem;
                    position: relative;
                    display: flex;
                    align-items: center;
                    transition: 1.6s ease-in-out;
                    div:nth-child(1){
                        position: absolute;
                        left: -.2rem;
                        background-color: rgb(46, 46, 46);
                    }
                    div:nth-child(2){
                        position: absolute;
                        width:.3rem;
                        height: .3rem;
                        border-radius: 50%;
                        background: rgb(235, 235, 235);
                        
                    }

                }
            }
            div:nth-child(2){
                width: 100%;
                display: flex;
                justify-content: space-around;
                align-items: center;
                span{
                    color: aliceblue;
                    font-size: 1.7rem;
                }
                span:nth-child(3){
                    font-size:2.5rem;
                }
                span:nth-child(5){
                    font-size:1.5rem;
                }
            }
            
        }
    }
                        @keyframes ral{
                    from{
                        transform:rotate(0deg);
                    }
                    to{
                        transform:rotate(360deg);
                    }
                    }

</style>