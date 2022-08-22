import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

import VueRouter from 'vue-router'
Vue.use(VueRouter);

import LoginVue from './components/LoginVue'
import UserTres from './components/UserTres'
import RegistrarVue from './components/RegistrarVue'
import AdminDos from './components/AdminDos'
import AdminUser from './components/AdminUser'
import RegistrarDos from './components/RegistrarDos'
import PruebaVue from './components/PruebaVue'

const usuariologeado = true;

const router = new VueRouter({
  mode : 'history',
  base: __dirname,
  routes:[{
    path:'/login',
    component:LoginVue
  },
  {
    path:'/test',
    component:PruebaVue
  },
  {
    path:'/registrar',
    component:RegistrarVue,
    meta:{ requiresAuth:true }
  },
  {
    path:'/reg2',
    component:RegistrarDos
  },
  {
    path:'/user3',
    component:UserTres,
    meta:{ requiresAuth:true }
  },
  {
    path:'/admin2',
    component:AdminDos,
    meta:{ requiresAuth:true }
  },
  {
    path:'/administrar',
    component:AdminUser,
    meta:{ requiresAuth:true }
  }
]
})

router.beforeEach((to,from,next)=>{
  if((to.meta.requiresAuth)){
    if(usuariologeado){
      next();
    }
    else{
      next("/login");
    }
   
  }
  else{
    next();
  }
})

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
