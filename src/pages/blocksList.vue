<template>
    <div class="container">
        <div class="content">
            <el-header>
                <el-row>
                    <el-col :span="8" :offset="6">
                        <el-input v-model="searcheValue" placeholder="请输入 区块号 / 区块hash" @keyup.enter.native="query"></el-input>
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
                            :data="blockData"
                            style="color:#8490c5;font-size: 16px;background:#221d44;text-align:center;"
                            :header-cell-style="headerCellStyle"
                            :row-style="rowStyle"
                            :cell-style="{'border-bottom':'none'}"
                    >
                        <el-table-column
                                prop="height"
                                label="区块高度">
                            <template slot-scope="scope">
                                <a style="color: #B9B4E8"
                                :title="scope.row.height"
                                href="javascript:void(0)"
                                @click.prevent="shwoDetail(scope.row)">
                                    {{ scope.row.height }}
                                </a>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="hash"
                                width="650"
                                label="区块hash">
                            <template slot-scope="scope">
                                <a style="color: #B9B4E8"
                                :title="scope.row.hash"
                                href="javascript:void(0)"
                                @click.prevent="shwoDetail(scope.row)">
                                    {{ scope.row.hash }}
                                </a>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="timeStamp"
                                label="时间"
                                width="200">
                        </el-table-column>
                        <!--<el-table-column-->
                        <!--prop="txn"-->
                        <!--label="txn">-->
                        <!--</el-table-column>-->
                        <el-table-column
                                prop="unclesReward"
                                label="叔块">
                        </el-table-column>
                        <el-table-column
                                prop="coinbase"
                                label="矿工"
                                min-width="300px">
                        </el-table-column>
                        <el-table-column
                                prop="gasUsed"
                                label="交易佣金">
                        </el-table-column>
                        <el-table-column
                                prop="gasLimit"
                                label="佣金上限">
                        </el-table-column>
                        <!--<el-table-column-->
                        <!--prop="Reward"-->
                        <!--label="奖励">-->
                        <!--</el-table-column>-->
                    </el-table>
                </div>
                <div class="tc">
                    <el-pagination
                            background
                            @size-change="sizeChange"
                            @current-change="currentChange"
                            :current-page="currentPage"
                            :page-size="times"
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
                title:'区块信息',
                language: '', // 语言
                blockData: [], // 表格数据
                // currentTimes: 0, //
                times: 20, // 每页显示数据条数
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
            /*dateFormate(row) {
                let date = new Date(row.timeStamp * 1000)//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                let Y = date.getFullYear() + '.';
                let M = this.fillZero(date.getMonth() + 1) + '.';
                let D = this.fillZero(date.getDate()) + ' ';
                let h = this.fillZero(date.getHours()) + ':';
                let m = this.fillZero(date.getMinutes()) + ':';
                let s = this.fillZero(date.getSeconds());
                return Y + M + D + h + m + s
            },            
            fillZero(time) {
                time = time < 10 ? "0" + time : time;
                return time;
            },*/
            /**
             * 查询
             */
            query() {
                if(isNaN(this.searcheValue)) {
                    this.$message.error("不正确的区块号或hash")
                    return
                }
                if(this.searcheValue.length === 66){
                     this.getData(this.searcheValue)
                } else {
                    this.getData(null, this.searcheValue)
                }       
            },
            shwoDetail(row) {
                this.title = '区块信息'
                this.showList = false
                this.detailList = row
                this.selectedPage = this.currentPage
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
                this.times = pageSize
                this.getData()
            },
            /**
             * currentPage 改变时会触发
             */
            currentChange(index) {
                this.currentPage = index
                this.getData()
            },
            getData(hash, blockNum) {
                this.$axios.post('/api/requestBlock.php', {                    
                    "pageSize": this.times,
                    "pageNum": this.currentPage,
                    "hash":hash || null,
                    "blockNum":blockNum || null
                }).then( res => {
                    if(res.data.code == 200) {
                        if(res.data.result.length) {
                            this.total = Number(res.data.dataCount)
                            this.blockData = []
                            this.blockData = this.blockData.concat(res.data.result)
                            if(hash || blockNum) {
                                this.detailList = res.data.result[0]
                                this.showList = false   
                                this.selectedPage = this.currentPage      
                            }
                        } else {
                            this.$message.error("没有相关数据")
                        }
                    }
                }, err => {
                    console.log(err)
                    this.$message.error(err)
                })
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
