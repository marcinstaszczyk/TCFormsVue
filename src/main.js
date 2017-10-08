import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'
import VueFire from 'vuefire'
import './stylus/main.styl'

import App from './App.vue'
import MainDashboard from './MainDashboard.vue'
import FormEdit from './FormEdit.vue'
import FormView from './FormView.vue'
import Login from './Login.vue'
import FormsList from './FormsList.vue'
import MessagesService from './MessagesService'

Vue.use(VueRouter)
Vue.use(VueFire)
Vue.use(Vuetify)

//Vue.component('tcf-main-dashboard', MainDashboard)
Vue.component('tcf-form-edit', FormEdit)
Vue.component('tcf-form-view', FormView)

const routes = [
  { path: '/', component: MainDashboard, props: { formId: -1 } },
  { path: '/login', component: Login },
  { path: '/list', component: FormsList },
  { path: '/edit', component: MainDashboard, props: { formId: -1 } },
  { path: '/edit/:formId', name:"edit", component: MainDashboard, props: true },
]
const router = new VueRouter({
  mode: 'history',
  routes,
  base: '/marcin/tcfdemovue/'
})

new Vue({
  el: '#app',
  data: {
    user: {},
    messagesService: new MessagesService()
  },
  computed: {
    isLogedIn() {
      return this.user.login !== undefined;
    }
  },
  render: h => h(App),
  router
})
