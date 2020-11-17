// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'; import 'element-ui/lib/theme-chalk/index.css';
import myaxios from './assets/js/myaxios'
import './assets/css/style.css'
Vue.use(ElementUI); 
Vue.use(myaxios)
Vue.config.productionTip = false


new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
