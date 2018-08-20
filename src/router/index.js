import Vue from 'vue'
import Router from 'vue-router'
import blocksList from '@/pages/blocksList'
import transactionList from '@/pages/transactionList'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            redirect:'blocksList'
        },
        {
            path: '/blocksList',
            name: 'blocksList',
            component: blocksList
        },
        {
            path: '/transactionList',
            name: 'transactionList',
            component: transactionList
        }
    ]
})
