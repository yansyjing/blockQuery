import Vue from 'vue'
import Router from 'vue-router'
import blocksList from '@/pages/blocksList'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'blocksList',
            component: blocksList
        }
    ]
})
