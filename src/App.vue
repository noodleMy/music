<template>
  <div id="app">
    <songHeader v-show="$route.meta.show"></songHeader>
    <router-view></router-view>
    <songFooter v-show="$route.meta.fail"></songFooter>
    <songDetail></songDetail>
  </div>
</template>

<script>
import songHeader from './components/songHeader.vue'
import songFooter from './components/songFooter.vue'
import songDetail from './components/songDetail.vue'
export default {
  name: 'App',
  components: {
    songHeader,
    songFooter,
    songDetail
  },
}
</script>

<style lang="less">
*{
  margin:0px;
  padding:0px;
}
ul,ol{
  list-style: none;
}
a{
  text-decoration: none;
}
  @rem:750/16rem;
</style>
