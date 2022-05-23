<template>
  <div class="lyrice">
      <ul ref="ull" :style="{transform:'translateY('+translateY+')'}">
        <li v-for="(lyr,index) in lyrice" :key="index" :class="{active:isIndex==index}">{{lyr}}</li>
      </ul>
  </div>
</template>

<script>
export default {
  name:"lyrice",
  data(){
    return{
      lyrice:[],
      time:[],
      isIndex:-1,
      translateY:'8.5rem'
    }
  },
  mounted() {
    console.log(this.$refs.ull.offsetHeight)
    this.translateY = this.$refs.ull.offsetWidth*(0.5)
    this.$bus.$on("lyrice",(value)=>{
      //接收歌词,
      //把带有时间但没歌词的部分替换掉
      let result = value.replace(/\[.*?\]\n/g,"")
      //console.log(result)
      //匹配有效时间
      this.time = result.match(/\d+:\d+\.\d/g)
      //匹配歌词
      this.lyrice = result.replace(/\[.*?\]\s|\[.*?\]/g,"").split("\n")
    })
    this.$bus.$on("playProgress",(Mcurrent,Mduration)=>{
      
      let result;
      //console.log(Mcurrent)
      let time = Mcurrent.toFixed(1)
      if(time<60)result=time<10?`00:0${time}`:`00:${time}`
      else{
        result = parseInt(time/60)<10?`0${parseInt(time/60)}`:`${parseInt(time/60)}`
        result = result+(time%60<10?`:0${(time%60).toFixed(1)}`:`:${(time%60).toFixed(1)}`)
        //console.log(result)
      }
      //判断，防止歌词颜色一闪而过，this.time.indexOf(result)再不是一个有效值的时候this.isIndex就不再改变
      //这样歌词就能一直高亮，直到下一个有效值
      if(this.time.indexOf(result)===-1){
        return
      }else{
        //console.log(result)
        this.isIndex = this.time.indexOf(result)
        this.translateY = this.$refs.ull.offsetWidth*(0.5) -(this.isIndex+1)*(this.$refs.ull.offsetHeight/this.time.length)*1+'px'
      }
    })
  }
}
</script>

<style lang="less" scoped>
    .lyrice{
      width:100%;
      height: 17rem;
      box-sizing:border-box;
      text-align: center;
      overflow: hidden;
      ul{
        color:rgba(218, 218, 218, 0.6);
        font-size:.8rem;
        transition: .5s ease;
      }
      li{
        margin-bottom:.2rem;
      }
      .active{
        color: aliceblue;
      }
  }

</style>