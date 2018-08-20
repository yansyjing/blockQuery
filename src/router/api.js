import Vue from 'vue'
import Web3 from 'web3'
import axios from 'axios'

const PRODUCT = 'http://39.104.81.103'
const TEST = 'http://120.79.88.105'
const LOCAL = '/url'

const HOST = 'http://39.104.81.103:8551'


axios.defaults.baseURL = PRODUCT  // 设置请求地址，后面的接口都将基于这个基本请求地址

// 设置请求头
axios.defaults.headers.post['Content-Type'] = 'application/json'

// Vue.prototype.$axios = (data) => {
//     if (typeof data === "object") {
//         return axios({
//             method: 'POST',
//             url: '/',
//             data: {"jsonrpc": "2.0", "method": data.method, "params": data.params, "id": data.id},
//         })
//     } else {
//         alert('参数不是对象')
//     }
// }
Vue.prototype.$axios = axios
Vue.prototype.$web3 = new Web3(HOST);
