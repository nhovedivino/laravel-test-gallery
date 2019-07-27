import './bootstrap'
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify, {iconfont: 'mdi'})
Vue.use(VueRouter)

// View Files
import App from '@/js/views/App'


import Home from '@/js/pages/Home'

const vuetifyOptions = { }
const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        }
    ]
})

const app = new Vue({
    el: '#app',
    components: {
        App,
    },
    router,
    vuetify: new Vuetify(vuetifyOptions)
})

export default app
