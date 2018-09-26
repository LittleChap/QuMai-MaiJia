<template>
  <div class="wrap orderDetailBox"
       v-loading="loading"
       element-loading-text="拼命加载中">
    <div class="el-card box-padding top-bar clearfix">
      <div class="content fl">
        <p v-if="orderDetail.orderStatus == 0">买家剩余
          <CountDown class="red" :endTime='orderDetail.waitPayTimeliness' :callback="finishEnd" endText=''
                     :isMin="true"></CountDown>
          付款，超时订单自动关闭
        </p>
        <div class="orderSn">
          <span>订单号：{{orderDetail.orderSn}}</span>
          <span>订单类型：
                        <i v-if="orderDetail.orderType==0">普通订单</i>
                        <i v-else>普通订单</i>
                    </span>
          <span>订单状态：
                        <i v-if="orderDetail.orderStatus === 0">待付款</i>
                        <i v-if="orderDetail.orderStatus === 2">待发货</i>
                        <i v-if="orderDetail.orderStatus === 3">待收货</i>
                        <i v-if="orderDetail.orderStatus === 4">待评价</i>
                        <i v-if="orderDetail.orderStatus === 5">已完成</i>
                        <i v-if="orderDetail.orderStatus === 6">已关闭</i>
                    </span>
        </div>
      </div>
      <div class="btn-wrap fr">
        <el-button type="primary" v-if="orderDetail.orderStatus != 0 && orderDetail.orderStatus != 2"
                   @click="toShowLogisticsView">查看物流
        </el-button>
        <el-button type="primary" @click="dialogDeliveryVisible=true; deliveryLoading = false;"
                   v-if="orderDetail.orderStatus == 2 || orderDetail.orderStatus == 9">确认发货
        </el-button>
        <el-button type="primary" @click="toCancel" v-if="orderDetail.orderStatus == 0">取消订单</el-button>
        <el-button @click="$router.go(-1)">返回</el-button>
      </div>
    </div>
    <div class="el-card">
      <h3 class="top">订单详情</h3>
      <div class="content">
        <el-row>
          <el-col :span="6">会员账号：{{orderDetail.username}}</el-col>
          <el-col :span="6">会员昵称：{{orderDetail.nickname}}</el-col>
          <!--<el-col :span="6">会员手机：{{orderDetail.mobile}}</el-col>-->
          <el-col :span="6">可得积分：{{orderDetail.point}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">下单时间：{{orderDetail.createTime}}</el-col>
          <el-col :span="6">成交时间：{{orderDetail.payTime || '暂无'}}</el-col>
          <el-col :span="6">发货时间：{{orderDetail.deliverTime || '暂无'}}</el-col>
          <el-col :span="6">完成时间：{{orderDetail.complateTime || '暂无'}}</el-col>
        </el-row>
        <el-row>
          <el-col>用户留言：{{orderDetail.memberRemark ||'无'}}</el-col>
        </el-row>
        <el-row>
          <el-col>
            卖家备注：<span v-show="orderDetail.shopRemark">{{orderDetail.shopRemark}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <el-button size="small" @click="toDialogRemark">{{orderDetail.shopRemark!==''?
              '修改卖家备注':'添加卖家备注'}}
            </el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="el-card box-padding">
      <el-row>
        <el-col :span="12">
                    <span>应付订单总额：<i :class="{lineThrough:orderDetail.isModifyPrice}">￥{{orderDetail.amountPrice}}</i>&nbsp;&nbsp;&nbsp;&nbsp;<i
                       v-if="orderDetail.isModifyPrice" class="red">￥{{orderDetail.newAmountPrice}}</i></span>
          <el-button v-if="orderDetail.orderStatus == 0" size="small" @click="toDialogPrice">修改价格</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">商品总额：￥{{orderDetail.goodsPrice}}</el-col>
        <el-col :span="6" v-if="orderDetail.orderType == 1">定金：￥{{orderDetail.deposit}}</el-col>
        <el-col :span="6" v-if="orderDetail.orderType == 1">尾款：￥{{orderDetail.retainage}}</el-col>
        <el-col :span="6" v-if="orderDetail.orderType !== 1">会员优惠：￥{{orderDetail.discountPrice}}</el-col>
        <el-col :span="6">运费：<i :class="{lineThrough:orderDetail.isModifyShipping}">￥{{orderDetail.shippingPrice}}</i>&nbsp;&nbsp;&nbsp;&nbsp;<i
           v-if="orderDetail.isModifyShipping" class="red">￥{{orderDetail.newShippingPrice}}</i></el-col>
      </el-row>
      <el-row>
        <el-col :span="6" v-if="orderDetail.couponPrice">优惠券抵扣：￥{{orderDetail.couponPrice}}</el-col>
        <!--<el-col :span="6" v-if="orderDetail.cardPrice">礼品卡抵扣：￥{{orderDetail.cardPrice}}</el-col>-->
      </el-row>
    </div>
    <div class="el-card">
      <h3 class="top">商品信息</h3>
      <el-table
         :data="orderDetail.orderItemArray"
         border
         align="center"
         style="width: 100%">
        <el-table-column
           width="300"
           label="商品信息">
          <template scope="scope">
            <div class="scope-img">
              <img width="60" height="60" :src="scope.row.goodsImage" alt="">
              <div>
                <p>{{ scope.row.goodsName }}</p>
                <p>{{ scope.row.specName }}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
           align="center"
           label="单价">
          <template scope="scope">
            ￥{{ scope.row.unitPrice }}
          </template>
        </el-table-column>
        <el-table-column
           prop="num"
           align="center"
           label="数量">
          <template scope="scope">
            x{{ scope.row.num }}
          </template>
        </el-table-column>
        <el-table-column
           prop="couponPrice"
           align="center"
           label="优惠券平摊">
          <template scope="scope">
            ￥{{ scope.row.couponPrice ||0 }}
          </template>
        </el-table-column>
        <el-table-column
           v-if="orderDetail.orderType !== 1"
           prop="discount"
           align="center"
           label="会员折扣">
        </el-table-column>
        <el-table-column
           prop="payPrice"
           align="center"
           label="实付金额">
          <template scope="scope">
            ￥{{ scope.row.payPrice }}
          </template>
        </el-table-column>
        <el-table-column
           v-if="orderDetail.orderStatus!=1&&orderDetail.orderType !== 2"
           prop="aftersaleStatus"
           align="center"
           label="售后状态">
          <template scope="scope">
            <span v-if="scope.row.isGift==1">赠品，无售后服务</span>
            <span v-else-if="!scope.row.returnOrderItemStatus && scope.row.returnOrderItemStatus!==0">
                            无
                        </span>
            <router-link v-else
                         :to="{path:'/aftersalesmanage/aftersalesDetail', query:{'returnOrderId': scope.row.returnOrderId}}"
                         class="blue">
              <span v-if="scope.row.returnOrderItemStatus===0">退款待审核</span>
              <span v-if="scope.row.returnOrderItemStatus===1">同意退款申请</span>
              <span v-if="scope.row.returnOrderItemStatus===2">退款成功</span>
              <span v-if="scope.row.returnOrderItemStatus===3">退款关闭</span>

              <span v-if="scope.row.returnOrderItemStatus===4">退货待审核</span>
              <span v-if="scope.row.returnOrderItemStatus===5">同意退货申请</span>
              <span v-if="scope.row.returnOrderItemStatus===6">卖家已签收</span>
              <span v-if="scope.row.returnOrderItemStatus===7">退货成功</span>
              <span v-if="scope.row.returnOrderItemStatus===8">退货关闭</span>

              <span v-if="scope.row.returnOrderItemStatus===9">换货待审核</span>
              <span v-if="scope.row.returnOrderItemStatus===10">同意换货申请</span>
              <span v-if="scope.row.returnOrderItemStatus===11">卖家已签收</span>
              <span v-if="scope.row.returnOrderItemStatus===12">换货商品寄出</span>
              <span v-if="scope.row.returnOrderItemStatus===13">换货成功</span>
              <span v-if="scope.row.returnOrderItemStatus===14">换货关闭</span>

            </router-link>
          </template>
        </el-table-column>
        <el-table-column
           align="center"
           label="售后完成数量">
          <template scope="scope">
            <span v-if="scope.row.returnOrderItemCompleteNum">x{{scope.row.returnOrderItemCompleteNum}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="el-card">
      <h3 class="top">收货人信息</h3>
      <div class="content">
        <el-row>
          <el-col :span="6">收货人姓名：{{orderDetail.shipName}}</el-col>
          <el-col :span="6">电话号码：{{orderDetail.shipMobile}}</el-col>
          <el-col :span="12">详细地址：{{orderDetail.shipAddress}}</el-col>
        </el-row>
        <el-row v-if="orderDetail.orderStatus!=1">
          <el-col :span="6">发票类型：&nbsp;&nbsp;
            <span v-if="orderDetail.invoiceType==0">个人</span>
            <span v-else-if="orderDetail.invoiceType==1">公司</span>
            <span v-else>无</span>
          </el-col>
          <el-col :span="6">发票抬头：{{orderDetail.invoiceTitle || '无'}}</el-col>
          <el-col :span="6">纳税人识别号：{{orderDetail.idNo || '无'}}</el-col>
        </el-row>
      </div>
    </div>
    <div class="el-card" v-if="orderDetail.paymentLogArray && orderDetail.paymentLogArray.length">
      <h3 class="top">收款信息</h3>
      <table class="receipt-table el-table" cellspacing="0" cellpadding="0" border="1">
        <tr>
          <th>支付类型</th>
          <th>支付订单编号</th>
          <th>流水号</th>
          <th>付款日期</th>
          <th>支付金额</th>
        </tr>
        <tr v-for="(item, index) in orderDetail.paymentLogArray">
          <td v-if="item.payType ==0">微信支付</td>
          <td v-if="item.payType ==1">银联支付</td>
          <td>{{item.payOrderSn}}</td>
          <td>{{item.paySn}}</td>
          <td>{{item.payTime}}</td>
          <td>￥{{item.payPrice}}</td>
        </tr>
      </table>
    </div>
    <div class="el-card">
      <h3 class="top">订单日志</h3>
      <div class="logbook">
        <p v-for="item in orderDetail.orderLogArray">{{item.content}}</p>
      </div>
    </div>
    <div class="bottom-btn">
      <el-button @click="$router.go(-1)">返回</el-button>
    </div>

    <el-dialog title="确认发货" :visible.sync="dialogDeliveryVisible" class="delivery-dialog">
      <div class="delivery-box">
        <el-table
           :data="waitOrderList"
           v-loading="waitOrderLoading"
           element-loading-text="拼命加载中"
           max-height="500"
           border
           class="table delivery-table">
          <el-table-column
             label="商品信息"
             min-width="300px">
            <template scope="scope">
              <div class="scope-img">
                <img :src="scope.row.goodsImage" alt="">
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
             prop="price"
             align="center"
             label="单价">
            <template scope="scope">
              ￥{{ scope.row.price }}
            </template>
          </el-table-column>
          <el-table-column
             prop="num"
             align="center"
             label="数量">
            <template scope="scope">
              X {{ scope.row.num }}
            </template>
          </el-table-column>
        </el-table>
        <div class="delivery-logistics">
          <el-form label-width="100px" class="sendGoodsForm">
            <el-form-item label="发货公司：">
              <el-radio class="radio" v-model="logisticsCompanyInfo.isCompany" :label="1">物流公司</el-radio>
              <el-radio class="radio" v-model="logisticsCompanyInfo.isCompany" :label="2">其他</el-radio>
            </el-form-item>
            <el-form-item label="物流公司：" v-show="logisticsCompanyInfo.isCompany === 1">
              <el-select placeholder="请选择" v-model="logisticsCompanyInfo.logistics_distribution_id">
                <el-option
                   v-for="item in logisticsCompanyList"
                   :key="item.logistics_id"
                   :label="item.logistics_name"
                   :value="item.logistics_id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="物流单号：" v-show="logisticsCompanyInfo.isCompany === 1">
              <el-input class="input" type="text" v-model="logisticsCompanyInfo.logistics_distribution_sn"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="deliveryLoading" @click="toDelivery">确 定</el-button>
        <el-button @click="dialogDeliveryVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="卖家备注" :visible.sync="dialogRemarkVisible" size="tiny" class="remark-dialog">
      <el-form class="remark-form">
        <el-form-item label="" :class="{'is-error': remarkNum>100}">
          <el-input type="textarea" v-model="remark" :rows="4" class="input"
                    placeholder="在此处可填写对订单的处理备注，买家无法查看卖家备注"></el-input>
          <span class="remark-num" :class="{red: remarkNum>100}">{{remarkNum}}/100</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRemarkVisible = false">取 消</el-button>
        <el-button type="primary" :loading="remarkLoading" @click="toRemark">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改价格" :visible.sync="dialogPriceVisible" size="large" class="price-dialog"
               @close="toDialogPriceClose">
      <div class="body">
        <el-table
           :data="orderChangePrice"
           max-height="500"
           border
           style="width: 100%; overflow-x: hidden;"
           class="table">
          <el-table-column
             prop="orderItemArray"
             label="商品"
             min-width="300px">
            <template scope="scope">
              <div class="content-rowspan">
                <div class="scope-con scope-img" v-for="value in scope.row.orderItemArray" v-if="value.isGift!=0">
                  <img :src="value.goodsImage" alt="">
                  <span>{{ value.goodsName }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
             prop="orderItemArray"
             align="center"
             label="规格">
            <template scope="scope">
              <div class="content-rowspan">
                <div class="scope-con" v-for="value in scope.row.orderItemArray" v-if="value.isGift!=0">{{
                  value.specName }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
             prop="orderItemArray"
             label="单价（元）">
            <template scope="scope">
              <div class="content-rowspan">
                <div class="scope-con" v-for="value in scope.row.orderItemArray" v-if="value.isGift!=1">{{
                  value.unitPrice }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
             prop="orderItemArray"
             label="数量">
            <template scope="scope">
              <div class="content-rowspan">
                <div class="scope-con" v-for="value in scope.row.orderItemArray" v-if="value.isGift!=1">{{ value.num
                  }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
             prop="orderItemArray"
             label="小计（元）">
            <template scope="scope">
              <div class="content-rowspan">
                <div class="scope-con" v-for="value in scope.row.orderItemArray" v-if="value.isGift!=1">{{
                  value.subtotalPrice
                  }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
             prop="orderItemArray"
             label="优惠券平摊">
            <template scope="scope">
              <div class="content-rowspan">
                <div class="scope-con" v-for="value in scope.row.orderItemArray" v-if="value.isGift!=1">{{
                  value.couponPrice || 0}}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
             prop="orderItemArray"
             label="会员优惠">
            <template scope="scope">
              <div class="content-rowspan">
                <div class="scope-con" v-for="value in scope.row.orderItemArray" v-if="value.isGift!=1">{{
                  value.discountPrice
                  }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
             prop="orderItemArray"
             label="会员折扣">
            <template scope="scope">
              <div class="content-rowspan">
                <div class="scope-con" v-for="value in scope.row.orderItemArray" v-if="value.isGift!=1">{{
                  value.discount }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
             prop="orderItemArray"
             label="实付"
             min-width="150px">
            <template scope="scope">
              <div class="content-rowspan">
                <div class="scope-con scope-input" v-for="(value, itemIndex) in scope.row.orderItemArray"
                     v-if="value.isGift!=1">
                  <div class="el-input el-input--small">
                    <input type="text" class="el-input__inner" v-model="value.payPrice"
                           @input="moneyInput(value.payPrice, value, 'payPrice')"
                           @blur="toSetNumber(value.payPrice, value, 'payPrice')">
                  </div>
                  <!--<el-input v-model="value.payPrice" size="small"
                            @blur="value.isNoNum =(value.payPrice !==''&&/^[0-9]+.?[0-9]*$/.test(value.payPrice))"></el-input>
                  <span class="error-tip red" v-show="value.payPrice===''">该内容不能为空</span>
                  <span class="error-tip red"
                        v-show="value.payPrice!==''&&!/^[0-9]+.?[0-9]*$/.test(value.payPrice)">该内容必须为数字值</span>-->
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
             prop="shippingPrice"
             label="运费（元）"
             min-width="150px">
            <template scope="scope">
              <div class="freight-input">
                <div class="el-input el-input--small">
                  <input type="text" class="el-input__inner" v-model="toShippingPrice"
                         @input="moneyInput(toShippingPrice)" @blur="toSetNumber(toShippingPrice)">
                </div>
                <!--<el-input v-model="toShippingPrice" value="number" size="small"
                          @change="toShippingPrice = toShippingPrice.replace(/[^\d\.]/g, '')"
                          @blur="isNoNum =(toShippingPrice!==''&&/^[0-9]+.?[0-9]*$/.test(toShippingPrice))"></el-input>
                <span class="error-tip red" v-show="toShippingPrice===''">该内容不能为空</span>
                <span class="error-tip red"
                      v-show="toShippingPrice!==''&&!/^[0-9]+.?[0-9]*$/.test(toShippingPrice)">该内容必须为数字值</span>
                <span v-if="orderDetail.cardShippingPrice">礼品卡已抵扣 {{ orderDetail.cardShippingPrice }} 元</span>-->
              </div>
            </template>
          </el-table-column>
        </el-table>
        <p class="total-num">
          卖家实付：
          <span v-for="(item, key) in orderChangePrice[0].orderItemArray" v-if="item.isGift!=1">{{Number(item.payPrice) || 0}} +</span>
          <span class="blue">{{Number(toShippingPrice)||0}}</span> =
          <span class="red">{{totalPrice || 0}}</span> 元
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="priceLoading" @click="toPrice">确 定</el-button>
        <el-button @click="dialogPriceVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!--  查看物流信息 -->
    <el-dialog title="查看物流信息" :visible.sync="dialogLogistics" size="small" class="logistics-dialog">
      <el-form :inline="true">
        <el-row>
          <el-form-item label="包裹：">
            <el-select placeholder="请选择" v-model="logisticsViewInfo.currentLogistics" @change="getNewViewLogistics">
              <el-option
                 v-for="(item, index) in logisticsPackage"
                 :key="index"
                 :label="'包裹'+(index+1)"
                 :value="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发货公司：">
            <span
               v-show="!logisticsViewInfo.changeLogistics">{{logisticsViewInfo.logistics_distribution_name || '无'}}</span>
            <el-select placeholder="请选择" v-model="logisticsViewInfo.logistics_distribution_id_change"
                       v-show="logisticsViewInfo.changeLogistics">
              <el-option
                 v-for="item in logisticsCompanyList"
                 @click.native="selectLogistics(item) "
                 :key="item.logistics_id"
                 :label="item.logistics_name"
                 :value="item.logistics_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="物流单号：">
            <span
               v-show="!logisticsViewInfo.changeLogistics">{{logisticsViewInfo.logistics_distribution_sn || '无'}}</span>
            <el-input type="text" v-model="logisticsViewInfo.logistics_distribution_sn_change"
                      v-show="logisticsViewInfo.changeLogistics"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item>
            <el-button @click="toChangeLogisticsInfo">{{logisticsViewInfo.changeLogistics? '确定修改': '修改物流信息'}}
            </el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <div class="content" v-loading="logisticsLoading">
        <p v-for="(item , index) in logisticsViewContent.data">
          {{item.time}} {{item.context}}
        </p>
        <p v-if="!logisticsViewContent.data.length && !logisticsViewInfo.logistics_distribution_name"
           style="text-align: center; margin-top: 20px;">该商品为无物流发货，无物流信息。</p>
        <p v-else style="text-align: center; margin-top: 20px;">快递单号异常！</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogLogistics=false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import {
    detailOrder,
    editRemark,
    editPrice,
    deliverOrder,
    cancelOrder,
    getWaitDeliveredOrder
  } from '@/api/ordermanage';
  import {getLogisticsCompanyList, viewLogistics, editOrderLogistics} from '@/api/freight';
  import CountDown from '@/components/CountDown'

  export default {
    components: {
      CountDown
    },
    data() {
      return {
        orderDetail: {},
        orderChangePrice: [{}],
        waitOrderList: [],
        remark: '',
        remarkLoading: false,
        priceLoading: false,
        deliveryLoading: false,
        logisticsLoading: false,
        dialogRemarkVisible: false,
        dialogPriceVisible: false,
        dialogDeliveryVisible: false,
        dialogLogistics: false,
        isNoNum: true,
        loading: false,
        waitOrderLoading: false,
        toShippingPrice: 0,
        logisticsCompanyList: [], // 物流公司列表
        logisticsCompanyInfo: {
          isCompany: 1,   // 是否选择物流公司
          logistics_distribution_id: '',  // 物流公司id
          logistics_distribution_sn: ''  // 物流单号
        },
        logisticsPackage: [], // 物流的包裹
        logisticsViewInfo: { // 查看物流的信息
          currentLogistics: -1,  // 当前选择的包裹
          changeLogistics: false,   // 是否修改
          logistics_distribution_id: '',  // 物流公司id
          logistics_distribution_name: '',  // 物流公司名称
          logistics_distribution_sn: '',  // 物流单号
          logistics_distribution_id_change: '',  // 物流公司id
          logistics_distribution_sn_change: ''  // 物流单号
        },
        logisticsViewContent: {data: []} // 物流的详细信息
      }
    },
    computed: {
      remarkNum() {
        return this.remark.length
      },
      totalPrice() {
        let total = 0;
        total += (Number(this.toShippingPrice) || 0)
        let data = this.orderChangePrice
        if (this.orderChangePrice[0].orderItemArray) {
          let items = this.orderChangePrice[0].orderItemArray;
          for (let i = 0; i < items.length; i++) {
            total += (Number(items[i].payPrice) || 0)
          }
        }
        return total.toFixed(2)
      }
    },
    created() {
      this.getOrderDetail();
    },
    methods: {
      // 获取订单详情
      getOrderDetail() {
        let data = {
          shopId: this.$store.getters.shopId,
          token: this.$store.getters.token,
          orderSn: this.$route.query.orderSn
        };
        let _this = this;
        _this.loading = true;
        detailOrder(data).then(response => {
          this.orderDetail = response;
          if (response.orderStatus == 2) {  // 待发货状态 去获得可发货的商品
            this.getWaitDeliveredOrderList();
          }
          if (response.orderStatus > 0) {
            // 获得物流公司列表
            _this.getLogisticsCompanyList()
          }
          if (response.logistics && response.logistics.length) {
            this.logisticsPackage = response.logistics
          }
          if (response.orderStatus > 2) {
            // 获得物流详情
            if (response.logistics && response.logistics.length) {
              this.logisticsViewInfo.currentLogistics = 0
              this.logisticsViewInfo.logistics_distribution_id = this.logisticsPackage[0].logisticsDistributionId
              this.logisticsViewInfo.logistics_distribution_sn = this.logisticsPackage[0].logisticsDistributionSn
              this.logisticsViewInfo.logistics_distribution_id_change = this.logisticsPackage[0].logisticsDistributionId
              this.logisticsViewInfo.logistics_distribution_sn_change = this.logisticsPackage[0].logisticsDistributionSn
              if(this.logisticsPackage[0].logisticsDistributionSn) {
                _this.getViewLogistics()
              }
            } else {
              this.logisticsViewInfo.currentLogistics = ''
            }
          }

          _this.loading = false;
        }).catch(error => {
          _this.loading = false;
        })
      },
      // 获得可发货的订单
      getWaitDeliveredOrderList() {
        let data = {
          shopId: this.$store.getters.shopId,
          token: this.$store.getters.token,
          orderSn: this.$route.query.orderSn
        };
        let _this = this;
        this.waitOrderLoading = true;
        getWaitDeliveredOrder(data).then(response => {
          _this.waitOrderLoading = false;
          if (!response.orderItemArray) {
            this.waitOrderList = []
          } else {
            this.waitOrderList = response.orderItemArray
          }
        }).catch(error => {
          _this.waitOrderLoading = false;
          return;
        })

      },
      // 显示备注弹窗
      toDialogRemark() {
        this.remarkLoading = false;
        this.remark = this.orderDetail.shopRemark || '';
        this.dialogRemarkVisible = true;
      },
      // 添加备注
      toRemark() {
        if (this.remarkNum == 0 || this.remarkNum > 100) {
          this.$message({
            showClose: true,
            message: '请输入0~100个字符',
            type: 'error'
          });
          return false;
        }
        this.remarkLoading = true;
        let data = {
          shopId: this.$store.getters.shopId,
          token: this.$store.getters.token,
          orderSn: this.$route.query.orderSn,
          remark: this.remark
        };
        editRemark(data).then(() => {
          this.remarkLoading = false;
          this.dialogRemarkVisible = false;
          this.orderDetail.shopRemark = this.remark;
        }).catch(error => {
          this.remarkLoading = false;
        });
      },
      // 显示修改价格弹窗
      toDialogPrice() {
        this.priceLoading = false;
        let objData = {
          orderItemArray: this.orderDetail.orderItemArray.slice(),
          shippingPrice: this.orderDetail.isModifyShipping ? this.orderDetail.newShippingPrice : this.orderDetail.shippingPrice
        }
        this.orderChangePrice.splice(0, 1, objData);
        this.toShippingPrice = this.orderChangePrice[0].shippingPrice || 0
        this.dialogPriceVisible = true;
      },
      // 设置只能输入数字 小数点
      moneyInput(value, item, itemName) {
        value = value.replace(/[^\d\.]/g, '');  //清除“数字”和“.”以外的字符
        value = value.replace(/^\./g, "0."); //验证第一个字符是数字而不是
        value = value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
        value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", "."); //保证.只出现一次，而不能出现两次以上
        value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
        if (value.indexOf(".") < 0 && value != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
          value = parseFloat(value);
        }
        if (itemName && itemName.length) {
          item[itemName] = value
        } else {
          this.toShippingPrice = value
        }
      },
      // 默认为0
      toSetNumber(value, item, itemName) {
        if (value == '') {
          if (itemName && itemName.length) {
            item[itemName] = 0
          } else {
            this.toShippingPrice = 0
          }
        }
      },
      // 修改价格弹窗 --> 取消关闭弹窗  回复数据
      toDialogPriceClose() {
        this.getOrderDetail();
      },
      // 修改价格
      toPrice() {
        let priceArray = [];
        for (let i = 0; i < this.orderChangePrice[0].orderItemArray.length; i++) {
          let array = this.orderChangePrice[0].orderItemArray[i];
          /*if (parseFloat(array.payPrice) < 0 || parseFloat(array.payPrice) > 100000000) {
            this.$message.error('销售价不能小于0,不能大于100000000')
            return
          }
          if (array.payPrice !== '' && !/^[0-9]+([.]{1}[0-9]{1,2})*$/.test(array.payPrice)) {
            this.$message.error('销售价最多只能填两位小数')
            return
          }*/
          if (array.isGift != 1) {  // 不是赠品的
            priceArray.push({
              orderItemId: array.orderItemId,
              price: array.payPrice
            });
          }
        }
        // 判断运费
        /*if (parseFloat(this.toShippingPrice) < 0 || parseFloat(this.toShippingPrice) > 100000000) {
          this.$message.error('运费不能小于0,不能大于100000000')
          return
        }
        if (this.toShippingPrice !== '' && !/^[0-9]+([.]{1}[0-9]{1,2})*$/.test(this.toShippingPrice)) {
          this.$message.error('运费最多只能填两位小数')
          return
        }*/
        this.priceLoading = true;
        // 验证通过
        let data = {
          shopId: this.$store.getters.shopId,
          token: this.$store.getters.token,
          orderSn: this.$route.query.orderSn,
          shippingPrice: this.toShippingPrice,
          priceArray: JSON.stringify(priceArray)
        };
        editPrice(data).then(() => {
          this.getOrderDetail();
          this.priceLoading = false;
          this.dialogPriceVisible = false;
        }).catch(error => {
          this.priceLoading = false;
        });
      },
      // 取消订单
      toCancel() {
        this.$confirm('确定取消此订单？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            shopId: this.$store.getters.shopId,
            token: this.$store.getters.token,
            orderSn: this.$route.query.orderSn
          };
          cancelOrder(data).then(() => {
            this.getOrderDetail();
          }).catch(() => {
            return;
          });
          ;
        });
      },
      // 确认发货
      toDelivery() {
        if (this.logisticsCompanyInfo.isCompany === 1 && this.logisticsCompanyInfo.logistics_distribution_id === '') {
          this.$message.error('请选择物流公司！')
          return false
        }
        if (this.logisticsCompanyInfo.isCompany === 1 && this.logisticsCompanyInfo.logistics_distribution_sn === '') {
          this.$message.error('请填写物流单号！')
          return false
        }
        let data = {
          shopId: this.$store.getters.shopId,
          token: this.$store.getters.token,
          orderSn: this.$route.query.orderSn,
          logistics_distribution_id: (this.logisticsCompanyInfo.isCompany === 1 ? this.logisticsCompanyInfo.logistics_distribution_id : ''),
          logistics_distribution_sn: (this.logisticsCompanyInfo.isCompany === 1 ? this.logisticsCompanyInfo.logistics_distribution_sn : '')
        };
        this.deliveryLoading = true;
        console.log(data)
        deliverOrder(data).then(() => {
          this.getOrderDetail();
          this.deliveryLoading = false;
          this.$message({
            message: '发货成功！',
            type: 'success'
          });
          this.dialogDeliveryVisible = false;
        }).catch(error => {
          this.deliveryLoading = false;
        });
      },
      // 代付款状态的  倒计时结束
      finishEnd() {
//                this.getOrderDetail();
        this.orderDetail.orderStatus = 5
      },
      // 物流公司
      getLogisticsCompanyList() {
        let data = {
          shopId: this.$store.getters.shopId,
          token: this.$store.getters.token
        };
        let _this = this;
        this.waitOrderLoading = true;
        getLogisticsCompanyList(data).then(response => {
          _this.waitOrderLoading = false;
          _this.logisticsCompanyList = response.data || []
          // 获得id对应的公司名
          /*if (_this.logisticsViewInfo.logistics_distribution_id!= '' || _this.logisticsViewInfo.logistics_distribution_id==0) {
            for (let i=0;i< _this.logisticsCompanyList.length; i++) {
              if(_this.logisticsCompanyList[i].logistics_id == _this.logisticsViewInfo.logistics_distribution_id) {
                _this.logisticsViewInfo.logistics_distribution_name = _this.logisticsCompanyList[i].logistics_name
              }
            }
          }*/
          for (let i = 0; i < _this.logisticsPackage.length; i++) {
            for (let j = 0; j < _this.logisticsCompanyList.length; j++) {
              if (_this.logisticsCompanyList[j].logistics_id == _this.logisticsPackage[i].logisticsDistributionId) {
                _this.logisticsPackage[i].logistics_distribution_name = _this.logisticsCompanyList[j].logistics_name
                break;
              }
            }
            _this.logisticsViewInfo.logistics_distribution_name = _this.logisticsPackage[0].logistics_distribution_name
          }
        }).catch(error => {
          _this.waitOrderLoading = false;
          return;
        })
      },
      // 物流信息
      getViewLogistics() {
        let data = {
          shopId: this.$store.getters.shopId,
          token: this.$store.getters.token,
          logistics_distribution_id: this.logisticsViewInfo.logistics_distribution_id,
          logistics_distribution_sn: this.logisticsViewInfo.logistics_distribution_sn
        };
        let _this = this;
        this.logisticsLoading = true;
        viewLogistics(data).then(response => {
          _this.logisticsLoading = false;
          if (response.data) {
            _this.logisticsViewContent = JSON.parse(response.data)
          }
        }).catch(error => {
          _this.logisticsLoading = false;
          return;
        })
      },
      //显示物流信息弹窗
      toShowLogisticsView() {
        if (this.logisticsViewInfo.currentLogistics !== -1) {  // 有包裹
          this.logisticsViewInfo.logistics_distribution_sn_change = this.logisticsViewInfo.logistics_distribution_sn
          if (this.logisticsViewInfo.logistics_distribution_name) {
            this.logisticsViewInfo.logistics_distribution_id_change = this.logisticsViewInfo.logistics_distribution_id
          } else {
            this.logisticsViewInfo.logistics_distribution_id_change = ''
          }
        }
        this.logisticsViewInfo.changeLogistics = false
        this.dialogLogistics = true
      },
      // 物流信息弹窗 - 选择发货公司
      selectLogistics(item) {
        this.logisticsViewInfo.logistics_distribution_name_change = item.logistics_name || ''
      },
      // 获得新的包裹物流信息
      getNewViewLogistics() {
        if (this.logisticsViewInfo.currentLogistics > -1) {
          this.logisticsViewInfo.logistics_distribution_id = this.logisticsPackage[this.logisticsViewInfo.currentLogistics].logisticsDistributionId
          this.logisticsViewInfo.logistics_distribution_sn = this.logisticsPackage[this.logisticsViewInfo.currentLogistics].logisticsDistributionSn
          this.logisticsViewInfo.logistics_distribution_name = this.logisticsPackage[this.logisticsViewInfo.currentLogistics].logistics_distribution_name
          this.logisticsViewInfo.logistics_distribution_id_change = this.logisticsPackage[this.logisticsViewInfo.currentLogistics].logisticsDistributionId
          this.logisticsViewInfo.logistics_distribution_sn_change = this.logisticsPackage[this.logisticsViewInfo.currentLogistics].logisticsDistributionSn
          if(this.logisticsPackage[this.logisticsViewInfo.currentLogistics].logistics_distribution_name) {
            this.getViewLogistics()
          }else {
            this.logisticsViewContent.data = []
          }
        }
      },
      // 修改物流信息
      toChangeLogisticsInfo() {
        if (!this.logisticsViewInfo.changeLogistics) {  // 修改按钮为确定修改
          this.logisticsViewInfo.changeLogistics = true
          return false
        }

        // 确定修改的操作
        if (this.logisticsViewInfo.currentLogistics == -1) {
          this.$message.error('请选择包裹！')
          return false
        }
        if (this.logisticsViewInfo.logistics_distribution_id_change === '') {
          this.$message.error('请选择物流公司！')
          return false
        }
        if (this.logisticsViewInfo.logistics_distribution_sn_change === '') {
          this.$message.error('请填写物流单号！')
          return false
        }
        let data = {
          shopId: this.$store.getters.shopId,
          token: this.$store.getters.token,
          orderSn: this.$route.query.orderSn,
          isOrder: this.logisticsPackage[this.logisticsViewInfo.currentLogistics].isOrder,
          pre_logistics_distribution_sn: this.logisticsViewInfo.logistics_distribution_sn,
          pre_logistics_distribution_id: this.logisticsViewInfo.logistics_distribution_id,
          new_logistics_distribution_id: this.logisticsViewInfo.logistics_distribution_id_change,
          new_logistics_distribution_sn: this.logisticsViewInfo.logistics_distribution_sn_change
        };
        let _this = this;
        editOrderLogistics(data).then(response => {
          this.$message.success('修改成功！')
          if (this.logisticsViewInfo.logistics_distribution_name_change != '') {
            this.logisticsViewInfo.logistics_distribution_name = this.logisticsViewInfo.logistics_distribution_name_change;
          }
          this.logisticsViewInfo.logistics_distribution_sn = this.logisticsViewInfo.logistics_distribution_sn_change;
          this.logisticsViewInfo.logistics_distribution_id = this.logisticsViewInfo.logistics_distribution_id_change;
          this.logisticsViewInfo.changeLogistics = false

          let itemPackage = this.logisticsPackage[this.logisticsViewInfo.currentLogistics]
          itemPackage.logisticsDistributionId = this.logisticsViewInfo.logistics_distribution_id_change;
          itemPackage.logisticsDistributionSn = this.logisticsViewInfo.logistics_distribution_sn_change;
          if (this.logisticsViewInfo.logistics_distribution_name_change != '') {
            itemPackage.logistics_distribution_name = this.logisticsViewInfo.logistics_distribution_name_change;
          }
          this.logisticsPackage.splice(this.logisticsViewInfo.currentLogistics, 1, itemPackage)
          this.getViewLogistics()
        }).catch(error => {
          return;
        })
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .wrap {
    padding: 20px 30px;
    min-width: 1124px;
  }
  table {
    img {
      width: 60px;
      height: 60px;
      box-sizing: border-box;
      vertical-align: middle;
      margin: 10px 10px 10px 0;
    }
  }
  .receipt-table {
    margin: -1px 0;
    th {
      width: 20%;
      text-align: center;
    }
    td {
      text-align: center;
    }
  }
  .btn-wrap {
    button {
      width: 100px;
    }
  }
  .el-card {
    margin-bottom: 36px;
    line-height: 30px;
    i {
      font-style: normal;
    }
    .top {
      margin: 0;
      padding: 10px;
      border-bottom: 1px solid #d1dbe5;
      font-weight: 400;
    }
    .content {
      padding: 10px;
      font-size: 16px;
    }
    .lineThrough {
      text-decoration: line-through;
      color: #8492A6;
    }
    .logbook {
      min-height: 200px;
      max-height: 500px;
      overflow-y: auto;
      padding: 0 20px;
    }

  }
  .scope-img {
    display: table;
    text-align: left;
    width: auto;
    img {
      margin: 10px 10px 10px 0;
      vertical-align: middle;
    }
    div {
      display: table-cell;
      vertical-align: middle;
      p {
        margin: 0;
      }
    }
    span {
      display: table-cell;
      vertical-align: middle;
    }
  }
  .box-padding {
    padding: 20px 10px;
    .content {
      padding: 0;
      p {
        margin: 0 0 10px 0;
      }
      .orderSn {
        line-height: 36px;
        span {
          margin-right: 40px;
        }
      }
    }
  }
  .bottom-btn {
    button {
      display: block;
      width: 100px;
      margin: 0 auto;
    }
  }
  .red {
    color: #ff4949;
  }
  .blue {
    color: #20A0FF;
  }
  // 备注弹窗
  .remark-dialog {
    .remark-form {
      height: 96px;
    }
  }
  // 修改价格弹窗
  .price-dialog {
    .body {
      padding: 0 20px;
      h3 {
        margin: 0 0 10px;
      }
      .content-wrap {
        max-height: 400px;
        overflow-y: scroll;
      }
      .table {
        max-width: 100%;
        overflow-x: hidden;
        td {
          text-align: center;
          &:first-child {
            .content-rowspan {
              text-align: left;
            }
          }
          input {
            text-align: center;
          }
        }
        .content-rowspan {
          .scope-con {
            width: 100%;
            height: 80px;
            box-sizing: border-box;
            /*overflow: hidden;*/
            padding: 26px 20px 0;
            /*padding: 0 20px;*/
            line-height: 24px;
            border-bottom: 1px solid #dfe6ec;
            &:last-child {
              border-bottom: none;
            }
            &.scope-input {
              /*padding: 20px;*/
            }
            &.scope-img {
              padding: 0;
              img {
                width: 60px;
                height: 60px;
                vertical-align: middle;
                margin: 10px;
              }
              span {
                width: 80%;
              }
            }
          }

        }
        .freight-input {
          padding: 0 20px;
        }
        .error-tip.red {
          /*position: absolute;
          left: 0;*/
          display: block;
          width: 100%;
          text-align: center;
        }
      }
    }
  }
  // 确认发货弹窗
  .delivery-dialog {
    .delivery-box {
      .delivery-table {
        display: inline-block;
        width: 600px;
        vertical-align: top;
      }
      .delivery-logistics {
        display: inline-block;
        width: 300px;
        vertical-align: top;
      }
    }

  }
  // 查看物流
  .logistics-dialog {
    .el-form-item {
      span {
        display: block;
        line-height: 36px;
      }
      .el-select, .el-input, span {
        width: 200px;
      }
    }
    .content {
      max-width: 100%;
      height: 200px;
      max-height: 400px;
      overflow: auto;
      border-top: 1px solid #bfcbd9;
    }
  }
</style>

<style lang="scss" rel="stylesheet/scss">
  .orderDetailBox {
    // 修改价格弹窗
    .price-dialog {
      .el-dialog__body {
        padding: 20px 0 0;
      }
      .el-input, .el-input__inner {
        /*width: 100%;*/
        text-align: center;
      }
      .el-table .cell {
        padding-left: 0;
        padding-right: 0;
        text-align: center;
      }
      .el-table--enable-row-hover .el-table__body tr:hover > td {
        background-color: #fff;
      }
    }
    .delivery-dialog {
      .el-dialog {
        min-width: 960px;
      }
    }
    .logistics-dialog {
      .el-dialog {
        min-width: 920px;
      }
    }
  }
</style>

