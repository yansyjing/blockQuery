<template>
    <div class="container">
        <el-container>
            <el-header height="140px">
                <el-row :gutter="20">
                    <el-col :span="9">
                        <div class="logo">汇尊区块链</div>
                    </el-col>
                    <el-col :span="9">
                        <el-input class="fr" v-model="blockNumber" placeholder="请输入区块编号">
                            <el-button slot="append" icon="el-icon-search" @click="query()"></el-button>
                        </el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-select class="fr" v-model="language" placeholder="请选择语言">
                            <el-option label="中文" value="中文"></el-option>
                            <el-option label="English" value="EN"></el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </el-header>
            <el-main v-if="showList">
                <el-table
                        stripe
                        height="600"
                        :highlight-current-row="true"
                        :data="blockData"
                        style="width: 100%">
                    <el-table-column
                            prop="number"
                            label="区块编号">
                        <template slot-scope="scope">
                            <a style="color: #f00"
                               :title="scope.row.txHash"
                               href="javascript:void(0)"
                               @click.prevent="query(scope.row.number)">
                                {{ scope.row.number }}
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="timestamp"
                            width="180"
                            label="存在时间">
                    </el-table-column>
                    <el-table-column
                            prop="txn"
                            label="txn">
                    </el-table-column>
                    <el-table-column
                            prop="uncles.length"
                            label="叔块">
                    </el-table-column>
                    <el-table-column
                            prop="miner"
                            label="矿工">
                    </el-table-column>
                    <el-table-column
                            prop="gasUsed"
                            label="交易佣金">
                    </el-table-column>
                    <el-table-column
                            prop="gasLimit"
                            label="佣金上限">
                    </el-table-column>
                    <el-table-column
                            prop="Avg.GasPrice"
                            label="平均佣金">
                    </el-table-column>
                    <el-table-column
                            prop="Reward"
                            label="奖励">
                    </el-table-column>
                </el-table>
                <div class="block tc">
                    <el-pagination
                            @size-change="sizeChange"
                            @current-change="currentChange"
                            :current-page="currentPage"
                            :page-size="times"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total">
                    </el-pagination>
                </div>
            </el-main>
            <el-main v-else>
                <div class="back tr"><a href="javascript:void(0)" @click="backList">显示区块列表 >></a></div>
                <div class="tx-list">
                    <p class="title">Block Information</p>
                    <el-row
                            :gutter="20"
                            v-for="(value,key) in blockData[0]"
                            :key="key">
                        <el-col :span="6" class="key">
                            <div>
                                {{ key }}
                            </div>
                        </el-col>
                        <el-col :span="18" class="value">
                            <div>
                                {{ value }}
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-main>
            <!--<el-footer>-->
            <!--深圳市汇尊区块链技术有限公司-->
            <!--</el-footer>-->
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "blocks-list",
        data() {
            return {
                language: '', // 语言
                blockData: [], // 表格数据
                currentTimes: 0, //
                times: 20, // 每页显示数据条数
                blockNumber: '', //搜索的区块值
                showList: true,
                currentPage: 0, // 当前页
                total: 0, // 总条数
                flag: false
            }
        },
        computed: {
            lastBlockNumber() {
                return this.$web3.eth.blockNumber
            }
        },
        methods: {
            /**
             *  传入区块号进行查询
             * @param bNum 区块号
             */
            getBlockList(bNum) {
                let param = {
                    method: 'eth_getBlockByNumber',
                    params: [this.$web3.toHex(bNum), true],
                    id: '1'
                }
                this.$axios(param)
                    .then((res) => {
                        if (res.data.result) {
                            res.data.result.number = this.toDec(res.data.result.number)
                            res.data.result.timestamp = this.dateFormate(res.data.result.timestamp)
                            res.data.result.gasUsed = this.toDec(res.data.result.gasUsed)
                            res.data.result.gasLimit = this.toDec(res.data.result.gasLimit)
                            delete res.data.result.logsBloom
                            this.blockData.push(res.data.result)
                            this.currentTimes++
                            bNum--
                            if (bNum < 0) {
                                this.flag = true
                            } else if (this.currentTimes < this.times) {
                                this.getBlockList(bNum)
                                this.flag = false
                            } else {
                                this.flag = true
                            }
                        } else {
                            this.$message({
                                showClose: true,
                                message: '未查到任何信息！',
                                type: 'error'
                            })
                        }
                    })
                    .catch((err) => {
                        this.$message.error(err)
                    })
            },
            /**
             * 时间格式化
             * @param time
             * @returns {string}
             */
            dateFormate(time) {
                let result = this.$web3.toDecimal(time)
                if (String(result).length === 10) {
                    result *= 1000
                }
                result = (Date.parse(new Date()) - result) / 1000
                if (result > (60 * 60 - 1)) {
                    result = Math.floor(result / 60 / 60) + ' hr ' + (Math.floor(result / 60)) % 60 + ' mins'
                } else if (result > 59) {
                    result = (result / 60).toFixed(0) + ' mins'
                } else {
                    result = result + ' secs'
                }
                return result + ' ago'
            },
            /**
             * 转十进制
             */
            toDec(hex) {
                return this.$web3.toDecimal(hex)
            },
            /**
             * 查询
             */
            query(blockNum) {
                if(blockNum){
                    this.times = 1
                    this.showList = false
                    this.blockData.length = 0
                    this.currentTimes = 0
                    this.getBlockList(blockNum)
                } else {
                    let reg = /^[0-9]*$/
                    if (this.blockNumber.trim() === '' || !reg.test(this.blockNumber)) {
                        this.$message({
                            showClose: true,
                            message: '请输入正确的区块编号！',
                            type: 'error'
                        })
                        return
                    }
                    this.times = 1
                    this.showList = false
                    this.blockData.length = 0
                    this.currentTimes = 0
                    this.getBlockList(this.blockNumber)
                }
            },
            /**
             * 返回表格
             */
            backList() {
                this.times = 20
                this.currentTimes = 0
                this.showList = true
                this.blockData.length = 0
                this.getBlockList(this.lastBlockNumber)
            },
            /**
             * pageSize 改变时会触发
             */
            sizeChange(pageSize) {
                this.times = pageSize
                this.currentTimes = 0
                this.blockData.length = 0
                this.getBlockList(this.lastBlockNumber)
            },
            /**
             * currentPage 改变时会触发
             */
            currentChange(index) {
                let timer = setInterval(() => {
                    if (this.flag) {
                        clearInterval(timer)
                        this.currentTimes = 0
                        this.blockData.length = 0
                        let bNum = this.lastBlockNumber - (this.times * (index - 1))
                        this.getBlockList(bNum)
                    }
                }, 1)
            },
        },
        mounted() {
            this.getBlockList(this.lastBlockNumber)
            this.total = this.lastBlockNumber
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    .el-header {
        padding: 0 20px;
        .logo {
            font-family: '\534E\6587\65B0\9B4F';
            font-size: 70px;
            color: #4DAD95;
            padding-top: 20px;
        }
        .el-input {
            margin-top: 35px;
        }
        .el-select {
            margin-top: 35px;
        }
    }

    .el-main {
        .back {
            height: 50px;
            line-height: 50px;
            a {
                color: #f00;
            }
        }
        .tx-list {
            border: 1px solid #4DAD95;
            border-radius: 10px;
            padding: 20px;
            .title {
                width: 100%;
                height: 50px;
                line-height: 50px;
                border-radius: 10px 10px 0 0;
                background: #D9EDF7;
                margin: -20px 0 10px -20px;
                padding: 0 20px;
                font-size: 20px;
            }
            .el-row {
                .key, .value {
                    height: 30px;
                    line-height: 30px;
                }
            }
        }
        .el-pagination {
            margin: 50px 0;
        }
    }

    .el-footer {
        text-align: center;
        background: #000;
        line-height: 60px;
        color: #fff;
    }
</style>