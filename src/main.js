//开发环境（直连）
var baseurl="http://127.0.0.1:8080";
var socketurl="http://127.0.0.1:8080";
var uploadurl="http://127.0.0.1:7012";

//////////////////////////////////////////////////////////////////////////////////////////////

Vue.prototype.baseurl=baseurl;//后台接口
Vue.prototype.socketurl=socketurl;//socket服务器
Vue.prototype.uploadurl=uploadurl;

import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/common.css'

import axios from 'axios';
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VueClipboard from 'vue-clipboard2'
import VueUuid from 'vue-uuid'

import utils from './assets/js/utils.js'

Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(VueClipboard);
Vue.use(VueUuid);
Vue.use(utils);

import App from './App.vue';
import login from './vues/login.vue';
import index from './vues/index.vue';
import fileallindex from './vues/fileall/index.vue';

Vue.http.options.emulateJSON=true;
Vue.http.options.root=baseurl;

Vue.prototype.$axios = axios;

var router=new VueRouter({
	routes:[
		{path:'/',redirect:'/toLogin'},
		{path:"/toLogin",component:login},
		{path:"/main",component:index,children:[
			{path:'/main',redirect:'fileall/index'},
			{path:"fileall/index",component:fileallindex},
		]}
	]
});

new Vue({
  	el: '#app',
  	created(){
  	},
  	router:router,
  	render: h => h(App)
})
