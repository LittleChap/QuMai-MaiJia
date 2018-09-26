<template>
    <div class="tan-pane-wrap">
        <el-form ref="form" class="form-wrap" :inline="true" :model="form" label-width="84px">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="售后单号：">
                        <el-input v-model="form.returnOrderCode" style="width: 180px;"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="订单类型：">
                        <el-select v-model="form.orderType" placeholder="请选择订单类型" style="width: 180px;">
                            <el-option label="全部" value="" checked></el-option>
                            <el-option label="普通订单" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="支付类型：">
                        <el-select v-model="form.payType" placeholder="请选择支付类型" style="width: 180px;">
                            <el-option label="全部" value="" checked></el-option>
                            <el-option label="微信支付" value="0"></el-option>
                            <el-option label="银联支付" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="订单编号：">
                        <el-input v-model="form.orderCode" style="width: 180px;"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="申请时间：" class="time-box">
                        <el-date-picker type="datetime" placeholder="选择开始时间" v-model="form.createTimeStart"
                                        style="width: 180px;" @change="timeChoose"></el-date-picker>
                        -
                        <el-date-picker type="datetime" placeholder="选择结束时间" v-model="form.createTimeEnd"
                                        style="width: 180px;" @change="timeChoose"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="买家账号：">
                        <el-input v-model="form.username" style="width: 180px;"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="售后状态：">
                        <el-select class="selectBox" v-model="form.handleStatus" placeholder="请选择售后进度" style="width: 180px;">
                            <el-option label="全部" value="" checked></el-option>
                            <el-option v-if="type===1 || type === 0" label="退款待审核" value="0"></el-option>
                            <el-option v-if="type===1 || type === 0" label="同意退款申请" value="1"></el-option>
                            <el-option v-if="type===2 || type === 0" label="退款成功" value="2"></el-option>
                            <el-option v-if="type===3 || type === 0" label="退款关闭" value="3"></el-option>

                            <el-option v-if="type===1 || type === 0" label="退货待审核" value="4"></el-option>
                            <el-option v-if="type===1 || type === 0" label="同意退货申请" value="5"></el-option>
                            <el-option v-if="type===1 || type === 0" label="卖家已签收-退货" value="6"></el-option>
                            <el-option v-if="type===2 || type === 0" label="退货成功" value="7"></el-option>
                            <el-option v-if="type===3 || type === 0" label="退货关闭" value="8"></el-option>

                            <el-option v-if="type===1 || type === 0" label="换货待审核" value="9"></el-option>
                            <el-option v-if="type===1 || type === 0" label="同意换货申请" value="10"></el-option>
                            <el-option v-if="type===1 || type === 0" label="卖家已签收-换货" value="11"></el-option>
                            <el-option v-if="type===1 || type === 0" label="换货商品寄出" value="12"></el-option>
                            <el-option v-if="type===2 || type === 0" label="换货成功" value="13"></el-option>
                            <el-option v-if="type===3 || type === 0" label="换货关闭" value="14"></el-option>

                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row class="btn-box">
                <el-form-item >
                    <el-button type="primary" @click="onSubmit">搜 索</el-button>
                    <el-button type="primary" @click="handleDownload">导出售后单</el-button>
                </el-form-item>
            </el-row>
        </el-form>
        <el-table
                ref="multipleTable"
                :data="returnOrderArray"
                border
                tooltip-effect="dark"
                v-loading="loading"
                element-loading-text="拼命加载中"
                style="width: 100%"
                @selection-change="handleSelectionChange">
            <el-table-column
                    type="selection"
                    align="center"
                    width="55">
            </el-table-column>
            <el-table-column
                    prop="returnOrderCode"
                    align="center"
                    label="售后单号">
            </el-table-column>
            <el-table-column
                    prop="orderCode"
                    align="center"
                    label="订单编号">
            </el-table-column>
            <el-table-column
                    align="center"
                    width="280"
                    label="商品名称">
                <template scope="scope">
                    <div class="scope-img">
                        <img width="60" height="60" :src="scope.row.goodsImage" alt="">
                        <span>{{ scope.row.goodsName }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="specName"
                    align="center"
                    label="规格">
            </el-table-column>
            <el-table-column
                    prop="username"
                    align="center"
                    label="买家">
            </el-table-column>
            <el-table-column
                    align="center"
                    width="100"
                    label="订单总额">
                <template scope="scope">￥{{ scope.row.orderAmountTotal }}</template>
            </el-table-column>
            <el-table-column
                    align="center"
                    width="100"
                    label="退款金额">
                <template scope="scope">￥{{ scope.row.returnMoney || 0 }}</template>
            </el-table-column>
            <el-table-column
                    align="center"
                    width="110"
                    label="申请时间">
                <template scope="scope">{{ scope.row.applyTime }}</template>
            </el-table-column>
            <el-table-column
                    prop="returnStatus"
                    align="center"
                    label="售后状态">
                <template scope="scope">
                    <span v-if="scope.row.returnStatus == 0">退款待审核</span>
                    <span v-if="scope.row.returnStatus == 1">同意退款申请</span>
                    <span v-if="scope.row.returnStatus == 2">退款成功</span>
                    <span v-if="scope.row.returnStatus == 3">退款关闭</span>

                    <span v-if="scope.row.returnStatus == 4">退货待审核</span>
                    <span v-if="scope.row.returnStatus == 5">同意退货申请</span>
                    <span v-if="scope.row.returnStatus == 6">卖家已签收</span>
                    <span v-if="scope.row.returnStatus == 7">退货成功</span>
                    <span v-if="scope.row.returnStatus == 8">退货关闭</span>

                    <span v-if="scope.row.returnStatus == 9">换货待审核</span>
                    <span v-if="scope.row.returnStatus == 10">同意换货申请</span>
                    <span v-if="scope.row.returnStatus == 11">卖家已签收</span>
                    <span v-if="scope.row.returnStatus == 12">换货商品寄出</span>
                    <span v-if="scope.row.returnStatus == 13">换货成功</span>
                    <span v-if="scope.row.returnStatus == 14">换货关闭</span>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    label="操作">
                <template scope="scope">
                    <router-link class="blue" :to="{path:'/aftersalesmanage/aftersalesDetail', query:{'returnOrderId': scope.row.returnOrderId}}">查 看</router-link>
                </template>
            </el-table-column>
        </el-table>
        <div class="page-box"   v-if="listQuery.totalResult">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.currentPage"
                           :page-sizes="[10,20,30,50]" :page-size="listQuery.showCount"
                           layout="total, sizes, prev, pager, next, jumper" :total="listQuery.totalResult">
            </el-pagination>
        </div>
    </div>


</template>

<script type="text/ecmascript-6">
    import {getReturnOrderList, exportOrder} from '@/api/aftersalesmanage';
    import {parseTime} from '@/utils/index';
    export default{
        props: {
            type: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                form: {
                    returnOrderCode: '', // 售后单号
                    orderCode: '', // 订单编号
                    username: '', // 买家账号
                    orderType: '', // 订单类型
                    payType: '', // 支付类型
                  handleStatus: '', // 售后状态
                    createTimeStart: '', // 申请时间开始
                    createTimeEnd: '' // 申请时间结束
                },
                returnOrderArray: [],
                listQuery: {
                    totalResult: 0,
                    showCount: 10,
                    currentPage: 1
                },
                multipleSelection: [],
                loading: false
            }
        },
        created() {
            this.getList();
        },
        methods: {
            getList() {
              let data = {
                shopId: this.$store.getters.shopId,
                token: this.$store.getters.token,
                returnOrderCode: this.form.returnOrderCode,  // 售后单号
                orderCode: this.form.orderCode,  // 订单号
                createTimeStart: this.form.createTimeStart ? parseTime(this.form.createTimeStart) : '', // 申请时间开始
                createTimeEnd: this.form.createTimeEnd ? parseTime(this.form.createTimeEnd) : '',   // 申请时间结束
                payType: this.form.payType,   // 付款方式
                username: this.form.username,  // 买家账号
                orderType: this.form.orderType, // 订单类型
                returnOrderStatus: this.type, // 售后状态
                handleStatus: this.form.handleStatus,
                showCount: this.listQuery.showCount || 10,
                currentPage: this.listQuery.currentPage || 1
              };
                this.loading = true;
                let _this = this;
                getReturnOrderList(data).then(response => {
                    this.returnOrderArray = response.returnOrderArray;
                    this.listQuery.totalResult = response.totalResult;
                    this.isAllChecked = false;
                    _this.loading = false;
                }).catch(error => {
                    _this.loading = false;
                })

            },
            onSubmit() {
                console.log('submit!');
                this.getList();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            timeChoose() {
                if (this.form.createTimeStart && this.form.createTimeEnd){
                    if (this.form.createTimeEnd < this.form.createTimeStart){
                        this.$alert('开始时间不能晚于结束时间', {
                            confirmButtonText: '确 定',
                            type: 'warning',
                            callback: () => {
                                this.form.createTimeStart = '';
                                this.form.createTimeEnd = ''
                            }
                        });
                    }
                }
            },
            handleDownload() {
                let selectArr = [];
                for (let i = 0; i < this.multipleSelection.length; i++) { // 获取选中的列表
                    let obj = {
                        returnOrderNo: this.multipleSelection[i].returnOrderCode
                    };
                    selectArr.push(obj)
                }
                let data = {
                    shopId: this.$store.getters.shopId,
                    token: this.$store.getters.token
                };
                if (this.multipleSelection.length) { // 导出选中的订单
                    data.returnOrderArray=JSON.stringify(selectArr)
                    exportOrder(data).then(response => {
                        console.log(response.url)
                        window.location.href = response.url
                    }).catch(() => {
                        return;
                    });
                } else { // 全部导出
                    data.returnOrderCode = this.form.returnOrderCode;  // 售后单号
                    data.orderCode = this.form.orderCode;  // 订单号
                    data.createTimeStart = this.form.createTimeStart ? parseTime(this.form.createTimeStart) : ''; // 申请时间开始
                    data.createTimeEnd = this.form.createTimeEnd ? parseTime(this.form.createTimeEnd) : '';   // 申请时间结束
                    data.payType = this.form.payType;   // 付款方式
                    data.username = this.form.username;  // 买家账号
                    data.orderType = this.form.orderType; // 订单类型
                    data.returnOrderStatus = this.form.returnOrderStatus || (this.type < 0 ? '' : this.type); // 售后状态
                    exportOrder(data).then(response => {
                      window.location.href = response.url
                    }).catch(() => {
                        return;
                    });
                }
            },
            handleSizeChange(val) { // 每页显示条数
                this.listQuery.showCount = val;
                this.listQuery.currentPage = 1;
                this.getList();
            },
            handleCurrentChange(val) { // 修改当前页数
                if (val){
                    this.getList();
                }
            }
        }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
    .time-box {
        .line {
            /*width: 80px;*/
            text-align: center;
        }
    }
    .btn-box{
        text-align: right;
        .el-form-item{
            margin-right: 0;
        }
        button{
            width: 100px;
        }
    }
    .blue{
        color: #20A0FF;
    }
    .scope-img{
        display: table;
        text-align: left;
        img{
            margin: 10px 10px 10px 0;
            vertical-align: middle;
        }
        span{
            display: table-cell;
            vertical-align: middle;
        }
    }
    .page-box{
        text-align: right;
        padding: 10px;
        border: 1px solid #dfe6ec;
        margin-top: -1px;
    }
</style>
<style lang="scss" rel="stylesheet/scss">
    .form-wrap{
        .el-form-item{
            margin-bottom: 10px;
        }
    }

    .el-select-dropdown__wrap{
        max-height: 320px;
    }
    .el-time-panel__content{
        height: 190px;
    }
</style>

