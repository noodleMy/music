import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false


import store from './store'
import router from './router'

// 引入ui组件库
import 'element-ui/lib/theme-chalk/index.css';
import { Button, Form ,FormItem,Input,InputNumber} from 'element-ui';
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(InputNumber)
new Vue({
  router,
  store,
  beforeCreate(){
    Vue.prototype.$bus = this;
  },
  render: h => h(App),
}).$mount('#app')
