<template>
    <div class="tan-pane-wrap">
        <el-form ref="form" class="form-wrap" :inline="true" :model="form" label-width="100px">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="订单编号：">
                        <el-input v-model="form.orderSn" style="width: 180px;"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="支付方式：">
                        <el-select v-model="form.payType" placeholder="请选择付款方式" style="width: 180px;">
                            <el-option label="全部" value="" checked></el-option>
                            <el-option label="微信支付" value="0"></el-option>
                            <el-option label="银联支付" value="1"></el-option>
                        </el-select>
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
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="收货人手机：">
                        <el-input v-model="form.shipMobile" style="width: 180px;"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="会员账号：">
                        <el-input v-model="form.username" style="width: 180px;"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="发票：">
                        <el-select v-model="form.isInvoice" placeholder="请选择" style="width: 180px;">
                            <el-option label="全部" value="" checked></el-option>
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>

                <el-col :span="6">
                    <el-form-item label="收货人姓名：">
                        <el-input v-model="form.shipName" style="width: 180px;"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="下单时间：" class="time-box">
                        <el-date-picker type="datetime" placeholder="选择开始时间" v-model="form.createTimeStart"
                                        style="width: 180px;" @change="timeChoose"></el-date-picker>
                        -
                        <el-date-picker type="datetime" placeholder="选择结束时间" v-model="form.createTimeEnd"
                                        style="width: 180px;" @change="timeChoose"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row class="btn-wrap">
                <el-col :span="12">
                    <el-form-item>
                        <el-button :plain="true" type="info" @click="deliverBatchOrder">批量发货</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="12"  class="btn-box">
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">搜 索</el-button>
                        <el-button type="primary" @click="handleDownload">导出订单</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <table class="table el-table" cellspacing="0" cellpadding="0" border="1"
               v-loading="loading"
               element-loading-text="拼命加载中">
            <tr>
                <th width="80">
                    <el-checkbox class="check-box" v-model="isAllChecked" @change="toSelectAll">
                        全选
                    </el-checkbox>
                </th>
                <th width="300">商品名称</th>
                <th width="150">规格</th>
                <th width="100">单价</th>
                <th width="100">数量</th>
                <th width="150">买家</th>
                <th width="150">收件人</th>
                <th width="100">实付金额</th>
                <th width="100">订单状态</th>
                <th width="100">售后进度</th>
                <th width="80">操作</th>
            </tr>
            <template v-for="(itemDetail, key) in orderList">
                <tr>
                    <td colspan="11" class="content-title">
                        <el-checkbox class="check-box" v-model="itemDetail.checked">
                            订单号：{{itemDetail.orderSn}}
                        </el-checkbox>
                        <span>下单时间：{{itemDetail.createTime}}</span>
                    </td>
                </tr>
                <tr v-for="(item, key) in itemDetail.itemArray">
                    <td colspan="2">
                        <div class="scope-img">
                            <img :src="item.goodsImage" alt="">
                            <span>{{item.goodsName}}</span>
                        </div>
                    </td>
                    <td>{{item.specName}}</td>
                    <td>￥{{item.unitPrice}}</td>
                    <td>x {{item.num}}</td>
                    <td v-if="key===0" :rowspan="itemDetail.itemArray.length">{{itemDetail.nickname}}</td>
                    <td v-if="key===0" :rowspan="itemDetail.itemArray.length">{{itemDetail.shipName}}</td>
                    <td v-if="key===0" :rowspan="itemDetail.itemArray.length">￥{{itemDetail.price}}</td>
                    <td v-if="key===0" :rowspan="itemDetail.itemArray.length">
                        <span v-if="itemDetail.orderStatus===0">待付款</span>
                        <span v-if="itemDetail.orderStatus===2">待发货</span>
                        <span v-if="itemDetail.orderStatus===3">待收货</span>
                        <span v-if="itemDetail.orderStatus===4">待评价</span>
                        <span v-if="itemDetail.orderStatus===5">已完成</span>
                        <span v-if="itemDetail.orderStatus===6">已关闭</span>
                    </td>
                    <td>
                        <router-link
                                :to="{path:'/aftersalesmanage/aftersalesDetail', query:{'returnOrderId': item.returnOrderId}}"
                                class="blue">
                            <span v-if="item.returnOrderItemStatus===0">退款待审核</span>
                            <span v-if="item.returnOrderItemStatus===1">同意退款申请</span>
                            <span v-if="item.returnOrderItemStatus===2">退款成功</span>
                            <span v-if="item.returnOrderItemStatus===3">退款关闭</span>

                            <span v-if="item.returnOrderItemStatus===4">退货待审核</span>
                            <span v-if="item.returnOrderItemStatus===5">同意退货申请</span>
                            <span v-if="item.returnOrderItemStatus===6">卖家已签收</span>
                            <span v-if="item.returnOrderItemStatus===7">退货成功</span>
                            <span v-if="item.returnOrderItemStatus===8">退货关闭</span>

                            <span v-if="item.returnOrderItemStatus===9">换货待审核</span>
                            <span v-if="item.returnOrderItemStatus===10">同意换货申请</span>
                            <span v-if="item.returnOrderItemStatus===11">卖家已签收</span>
                            <span v-if="item.returnOrderItemStatus===12">换货商品寄出</span>
                            <span v-if="item.returnOrderItemStatus===13">换货成功</span>
                            <span v-if="item.returnOrderItemStatus===14">换货关闭</span>

                        </router-link>
                    </td>
                    <td v-if="key===0" :rowspan="itemDetail.itemArray.length">
                        <router-link
                                :to="{path:'/ordermanage/orderDetail', query:{'orderSn': itemDetail.orderSn}}"
                                     class="blue">
                            查 看
                        </router-link>
                    </td>
                </tr>
            </template>
            <tr v-if="listQuery.totalResult == 0">
                <td colspan="11" class="empty-box">
                    没有相对应搜索条件的订单！ <br>
                    换个条件搜索吧~
                </td>
            </tr>
            <tr  v-if="listQuery.totalResult">
                <td colspan="11" class="page-box">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                   :current-page.sync="listQuery.currentPage"
                                   :page-sizes="[10,20,30,50]" :page-size="listQuery.showCount"
                                   layout="total, sizes, prev, pager, next, jumper" :total="listQuery.totalResult">
                    </el-pagination>
                </td>
            </tr>
        </table>
    </div>


</template>

<script type="text/ecmascript-6">
    import {getOrderList,exportOrder, deliverBatchOrder} from '@/api/ordermanage';
    import {parseTime} from '@/utils/index';
    export default{
        props: {
            type: {
                type: Number,
                default: -1
            }
        },
        data() {
            return {
                form: {
                    orderSn: '',  // 订单号
                    createTimeStart: '', // 下单时间开始时间
                    createTimeEnd: '',   // 下单时间结束时间
                    payType: '',   // 付款方式
                    username: '',  // 用户账号
                    shipName: '',  // 收货人姓名
                    shipMobile: '',// 收货人手机号
                    isInvoice: '', // 是否有发票
                    orderType: '' // 订单类型
                },
                orderList: [],
                listQuery: {
                    showCount: 10,
                    currentPage: 1,
                    totalResult: 0
                },
                multipleSelection: [],
                isAllChecked: false,
                loading: false
            }
        },
        created() {
            this.getList();
        },
        methods: {
            getList() { // 获得订单列表
                let data = {
                    shopId: this.$store.getters.shopId,
                    token: this.$store.getters.token,
                    orderSn: this.form.orderSn,  // 订单号
                    createTimeStart: this.form.createTimeStart ? parseTime(this.form.createTimeStart) : '', // 下单时间开始时间
                    createTimeEnd: this.form.createTimeEnd ? parseTime(this.form.createTimeEnd) : '',   // 下单时间结束时间
                    payType: this.form.payType,   // 付款方式
                    username: this.form.username,  // 用户账号
                    shipName: this.form.shipName,  // 收货人姓名
                    shipMobile: this.form.shipMobile,// 收货人手机号
                    isInvoice: this.form.isInvoice, // 是否有发票
                    orderType: this.form.orderType, // 订单类型
                    orderStatus: (this.type < 0 ? '' : this.type),
                    showCount: this.listQuery.showCount || 10,
                    currentPage: this.listQuery.currentPage || 1
                };
                this.loading = true;
                let _this = this;
                getOrderList(data).then(response => {
                    for (let i = 0; i < response.orderArray.length; i++) { // 设置取消选中
                        response.orderArray[i].checked = false;
                    }
                    this.orderList = response.orderArray;
                    this.listQuery.totalResult = response.totalResult;
                    this.isAllChecked = false;
                    _this.loading = false;
                }).catch(error => {
                    _this.loading = false;
                })
            },
            onSubmit() { // 表单提交 搜索列表
                this.getList();
            },
            timeChoose() { // 时间比较
                console.log(parseTime(this.form.createTimeEnd))
                if (this.form.createTimeStart && this.form.createTimeEnd) {
                    if (this.form.createTimeEnd < this.form.createTimeStart) {
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
            toSelectAll(event) { // 全选
                let isCheck = event.target.checked;
                console.log(isCheck)
                for (let i = 0; i < this.orderList.length; i++) { // 获取选中的列表
                    let orderItem = this.orderList[i];
                    orderItem.checked = isCheck;
                    this.orderList.splice(i, 1, orderItem);
                }
            },
            handleDownload() { // 导出订单
                this.multipleSelection = [];
                for (let i = 0; i < this.orderList.length; i++) { // 获取选中的列表
                    if (this.orderList[i].checked) {
                        let obj = {
                            orderSn: this.orderList[i].orderSn
                        };
                        this.multipleSelection.push(obj)
                    }
                }
                let data = {
                    shopId: this.$store.getters.shopId,
                    token: this.$store.getters.token
                };
                let _this = this;
                if (this.multipleSelection.length) { // 导出选中的订单
                    data.orderSnArray=JSON.stringify(this.multipleSelection)
                    exportOrder(data).then(response => {
                        console.log(response.url)
                        window.open(response.url)
                    }).catch(() => {
                        return;
                    });
                } else { // 全部导出
                    data.orderStatus = (_this.type < 0 ? '' : _this.type);
                    data.orderSn = _this.form.orderSn;  // 订单号
                    data.createTimeStart = _this.form.createTimeStart ? parseTime(_this.form.createTimeStart) : ''; // 下单时间开始时间
                    data.createTimeEnd = _this.form.createTimeEnd ? parseTime(_this.form.createTimeEnd) : '';   // 下单时间结束时间
                    data.payType = _this.form.payType;  // 付款方式
                    data.username = _this.form.username;  // 用户账号
                    data.shipName = _this.form.shipName;  // 收货人姓名
                    data.shipMobile = _this.form.shipMobile;// 收货人手机号
                    data.isInvoice = _this.form.isInvoice; // 是否有发票
                    data.orderType = _this.form.orderType;// 订单类型
                    exportOrder(data).then(response => {
                        console.log(response.url)
//                        window.open(response.url)
                        window.location.href = response.url
                    }).catch(() => {
                        return;
                    });
                }
            },
            /*formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            },*/

            // 批量发货
            deliverBatchOrder() {
                this.multipleSelection = [];
                for (let i = 0; i < this.orderList.length; i++) { // 获取选中的列表
                    if (this.orderList[i].checked) {
                        let obj = {
                            orderSn: this.orderList[i].orderSn
                        };
                        this.multipleSelection.push(obj)
                    }
                }
                if (!this.multipleSelection.length) {
                    this.$message({
                        showClose: true,
                        message: '请选择数据',
                        type: 'error'
                    });
                    return false;
                }

                this.$confirm('执行批量发货默认按无物流发货处理，确认执行此操作？', '批量发货 ', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    let data = {
                        shopId: this.$store.getters.shopId,
                        token: this.$store.getters.token
                    };
                    data.orderSnArray=JSON.stringify(this.multipleSelection)
                    deliverBatchOrder(data).then(response => {
                        this.getList();
                        this.$message({
                            type: 'success',
                            message: response.num +' 个订单发货成功！'
                        });
                    }).catch(() => {
                        return;
                    });
                });
            },
            handleSizeChange(val) { // 每页显示条数
                this.listQuery.showCount = val;
//                this.listQuery.currentPage = 1;
                this.getList();
            },
            handleCurrentChange(val) { // 修改当前页数
                if (val){
                    this.listQuery.currentPage = val;
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
    .btn-wrap{
        margin: 10px 0 6px;
    }
    .btn-box {
        text-align: right;
        .el-form-item {
            margin-right: 0;
        }
        button {
            width: 100px;
        }
    }
    .blue {
        color: #20A0FF;
    }
    .table {
        th {
            text-align: center;
            &:first-child{
                padding-left: 16px;
                text-align: left;
                border-right: none;
                &+th{
                    border-left: none;
                }
            }
        }
        td {
            text-align: center;
        }
        .content-title {
            padding: 0 16px;
            text-align: left;
            .check-box {
                display: inline-block;
                width: 240px;
            }
            span {
                margin-left: 100px;
            }
        }
        td:first-child {
            padding: 0 16px;
            text-align: left;
        }
        td.page-box {
            padding: 10px;
            text-align: right;
        }
        .scope-img {
            display: table;
            img {
                width: 60px;
                height: 60px;
                margin: 10px 10px 10px 0;
                vertical-align: middle;
            }
            span {
                display: table-cell;
                vertical-align: middle;
            }
        }
        td.empty-box{
            text-align: center;
            padding: 50px ;
            line-height: 30px;
            font-size: 14px;
            color: #5e7382;
        }

    }

</style>

<style lang="scss" rel="stylesheet/scss">
    .form-wrap {
        .el-form-item {
            margin-bottom: 10px;
        }
    }
    .el-time-panel__content {
        height: 190px;
    }
</style>