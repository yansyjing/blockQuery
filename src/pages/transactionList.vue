<template>
    <div class="container">
        <div class="content">
            <el-header>
                <el-row>
                    <el-col :span="8" :offset="6">
                        <el-input v-model="searcheValue" placeholder="请输入 交易hash / 发送方 / 接收方" @keyup.enter.native="query"></el-input>
                    </el-col>
                    <el-col :span="3">
                        <el-button @click="query">搜索</el-button>
                    </el-col>
                    <el-col :span="3" v-show="!showList">
                        <el-button @click="backList">返回列表</el-button>
                    </el-col>
                </el-row>
            </el-header>
            <div class="table" v-show="showList">
                <div class="body-table">
                    <el-table height="100%"
                            :data="transactionsList"
                            style="color:#8490c5;font-size: 16px;background:#221d44;text-align:center;"
                            :header-cell-style="headerCellStyle"
                            :row-style="rowStyle"
                            :cell-style="{'border-bottom':'none'}"
                    >
                        <el-table-column
                                prop="txHash"
                                width="400"
                                label="交易hash">
                            <template slot-scope="scope">
                                <a style="color: #B9B4E8"
                                :title="scope.row.txHash"
                                href="javascript:void(0)"
                                @click.prevent="shwoDetail(scope.row)">
                                    {{ scope.row.txHash }}
                                </a>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="txFrom"
                                label="发送方"
                                min-width="350px">
                        </el-table-column>
                        <el-table-column
                                prop="txTo"
                                label="接收方"
                                min-width="350px">
                        </el-table-column>
                        <el-table-column
                                prop="txValue"
                                label="金额"
                                :formatter="valueFilter">
                        </el-table-column>
                        <el-table-column
                                prop="time"
                                label="时间"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="blockNum"
                                label="区块号">
                        </el-table-column>
                    </el-table>
                </div>
                <div class="tc">
                    <el-pagination
                            class="tc"
                            background
                            @size-change="sizeChange"
                            @current-change="currentChange"
                            :current-page="currentPage"
                            :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total">
                    </el-pagination>
                </div>
            </div>
            <div class="detail" v-show="!showList">
                <div class="tx-list">
                    <p>                        
                        <span>{{ title }}</span>
                    </p>
                    <el-row class="row" v-for="(value,key) in detailList" :key="key">
                        <el-col class="key" :span="5">{{ key }}</el-col>
                        <el-col class="value" :span="18">{{ value}}</el-col>
                    </el-row>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "blocks-list",
        data() {
            return {
                title:'交易明细',
                language: '', // 语言
                transactionsList: [], // 表格数据
                // currentTimes: 0, //
                pageSize: 20, // 每页显示数据条数
                searcheValue: '', //搜索的区块值
                showList: true,
                currentPage: 1, // 当前页
                selectedPage:1,
                total: 0, // 总条数
                detailList:[]
            }
        },
        methods: {
            /**
             * 时间格式化
             */
            // dateFormate(row) {
            //     let date = new Date(row.timeStamp * 1000)//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            //     let Y = date.getFullYear() + '.';
            //     let M = this.fillZero(date.getMonth() + 1) + '.';
            //     let D = this.fillZero(date.getDate()) + ' ';
            //     let h = this.fillZero(date.getHours()) + ':';
            //     let m = this.fillZero(date.getMinutes()) + ':';
            //     let s = this.fillZero(date.getSeconds());
            //     return Y + M + D + h + m + s
            // },            
            // fillZero(time) {
            //     time = time < 10 ? "0" + time : time;
            //     return time;
            // },
            /**
             * 查询
             */
            query() {
                if(isNaN(this.searcheValue)) {
                    this.$message.error("不正确的交易hash或账户地址")
                    return
                }
                if(this.searcheValue.length === 66){
                     this.getData(this.searcheValue)
                } else {
                    this.getData(null, this.searcheValue)
                }       
            },
            shwoDetail(row) {
                this.title = '交易详情'
                this.$web3.eth.getTransaction(row.txHash)
                    .then((data) => {
                        this.showList = false
                        this.selectedPage = this.currentPage
                        this.detailList = data
                        // delete data.datasourcecode
                        // this.transactionsData = data
                        // this.showSwitch = 'list'
                    })
            },
            /**
             * 返回表格
             */
            backList() {
                this.showList = true                
                this.currentPage  =  this.selectedPage 
                this.searcheValue = ''
                this.getData()
            },
            /**
             * pageSize 改变时会触发
             */
            sizeChange(pageSize) {
                this.pageSize = pageSize
                this.getData()
            },
            /**
             * currentPage 改变时会触发
             */
            currentChange(index) {
                this.currentPage = index
                this.getData()
            },
            getData(hash, addr) {
                this.$axios.post('/api/requestTx.php', {
                    "addr": addr || '',
                    "txHash": hash || '',
                    "pageSize": this.pageSize,
                    "pageNum": this.currentPage,
                }).then((res) => {
                    if (res.data.code == 200) {
                        if (res.data.result.length) {
                            this.total = Number(res.data.dataCount)
                            this.transactionsList = []
                            this.transactionsList = this.transactionsList.concat(res.data.result)
                            if(hash) {
                                this.detailList = res.data.result[0]
                                this.showList = false   
                                this.selectedPage = this.currentPage      
                            }
                        } else {
                            this.$message.error("没有相关数据")
                        }
                    }
                }).catch((error) => {
                    this.$message.error(String(error))
                })
            },
            valueFilter(row) {
                return this.$web3.utils.fromWei(row.txValue, 'ether');
            },
            headerCellStyle({row, rowIndex}) {
                return 'background:#342C67;border-bottom:0;font-size: 20px;color: #d3ceff;height:70px;text-align:center;'
            },
            rowStyle({row, rowIndex}) {
                if (rowIndex & 1) {
                    return 'background:#342C67;'
                } else {
                    return 'background:#221d44;'
                }
            }

        },
        mounted() {
            this.getData()
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
   @import "../assets/scss/list.scss";
</style>
