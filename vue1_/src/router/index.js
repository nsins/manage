import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Home from '@/components//home/Home'
// 引入组件的页面

import Login from '@/components/Login'
import Users from '@/components/Users'
import Roles from '@/components/Roles'
import Rights from '@/components/Rights'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      name:'home',
      component:Home,
      children:[
     
        { path:'/users', name:'users',component:Users},
        {path:'/rights',name:'rights',component:Rights},
        {path:'/roles',name:'roles',component:Roles},
         ]
    },
    {  //配置路由
      path:'/login',
      name:'login',
      component:Login
    },
 
 
  ]
})
