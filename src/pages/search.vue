<template>
  <div class="content2">
      <div class="search fn-line">
          <div class="left"><img src="./images/下载.svg" alt=""></div>
          <input type="text" placeholder="搜索歌曲、歌手、专辑" ref="input" @keyup.enter="onEnter">
          <div class="right"></div>
      </div>

        <div class="bread">
            <p>{{show==1?"热门推荐":"单曲"}}</p>
            <div class="breadContent" v-show="show == 1">
                <div class="dreg" v-for="(bread,index) in breads" :key="index" @click="breadSearch(bread.first)">
                    <span>{{bread.first}}</span>
                </div>
            </div>
            <div class="musicList" v-show="show == 0">
                <ul class="sing">
                    <li v-for="(music,index) in searchList" :key="music.id" @click="changeSong(index)">
                        <a>
                            <div class="serial"><span>{{index+1}}</span></div>
                            <div class="serialSing fn-line">
                                <div class="left">
                                    <div class="singName">{{music.name+(music.alias.length==0?'':"("+music.alias[0]+")")}}</div>
                                    <div class="singAuthor">
                                        <span></span>{{music.artists[0].name}}-{{music.name}}
                                    </div>
                                </div>
                                <audio src=""></audio>
                                <div class="right"></div>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
  </div>
</template>

<script>
import {searchHot,reqSearch} from "../api"
export default {
    name:"search",
    data(){
        return{
            breads:[],
            searchList:[],
            show:1,
            songsIds:[],
            songUrl:[],
            urldata:[]
            
        }
    },
    async mounted(){
        try{
            let result = await searchHot()
            this.breads = result.data.result.hots
        }catch(error){
            console.log(error)
        }
        
    },
    computed:{
        mu(){
            //计算歌单id，有计算属性判断是否接收到数据，数据发生变化，然后被下面的watch检测
            //派发获取歌曲url的任务
            let arr = this.searchList[0] || {}
            return arr.id
        }
    },
    methods:{
        async breadSearch(keywords,change){
            if(change === true){
                keywords = this.$refs.input.value
            }else{
                this.$refs.input.value = keywords
            }
            if(keywords === ''){
                return
            }
            keywords = decodeURIComponent(keywords)
            try{
                
                let result = await reqSearch({keywords})
                //获取搜索结果的数组
                this.searchList = result.data.result.songs
                this.show = 0
            }catch(error){
                console.log(error)
            }
        },
        onEnter(){
            let keywords='';
            this.breadSearch(keywords,true)
        },
        changeSong(index){
            this.$bus.$emit('change',index)
        }
    },
    watch:{
        //检测到了
        mu:{
            async handler(){
                this.searchList.forEach(element => {
                    this.songsIds.push(element.id)
                });
                try{
                    this.songUrl =await this.$store.dispatch('Song',this.songsIds.join())
                    this.urldata = []
                    if(this.songUrl.code == 200){
                        //获取到的url顺序有问题，这里重排一下
                        for(let i =0 ; i<this.searchList.length;i++){
                            for(let g=0; g<this.searchList.length;g++){
                                if(this.songsIds[i]==this.songUrl.data[g].id){
                                    
                                    this.urldata.push(this.songUrl.data[g])
                                }
                            }
                        }
                        this.$bus.$emit("songsUrl",this.urldata,this.searchList) 
                    }
                }catch(error){
                    console.log(error)
                }
            }
        }
    }
}
</script>

<style stoped lang="less">
.content2{
    padding-top: 3.5rem;
    width:100%;
    overflow-x:hidden;
    .search{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 2.5rem;
        position: relative;
        .left{
            width: 1.5rem;
            height: 1.5rem;
            background-color:rgb(228, 228, 228);
            border-radius: 0.7rem 0 0 0.7rem;
            img{
                height: 1.5rem;
                line-height: 1.5rem;
                display: block;
                width: .8rem;
                margin: 0 auto;
            }
        }
        input{
            border:none;
            width: 12rem;
            height:1.5rem;
            background-color:rgb(228, 228, 228);
            outline: none;
            font-size:.7rem;
        }
        .right{
            width: 1.5rem;
            height: 1.5rem;
            background-color:rgb(228, 228, 228);
            border-radius: 0 0.7rem 0.7rem 0;
        }
        &::after{
                content: "";
                position: absolute;
                width:100%;
                bottom: 0;
                border: 0 solid rgba(109, 109, 109, 0.1);
                z-index: 2;
    }   
    }
    .fn-line::after{
        border-bottom-width:1px;
    }


    .bread{
        padding: .3rem .5rem;
        p{
            font-size:.6rem;
        }
        .breadContent{
            display: flex;
            flex-wrap: wrap;
            .dreg{
                padding:.2rem .5rem;
                background-color: rgb(236, 236, 236);
                font-size: .6rem;
                border: 1px solid rgb(161, 161, 161);
                border-radius: 2rem;
                margin:.3rem .3rem 0 0;
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
}
</style>