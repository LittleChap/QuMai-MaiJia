<template>
  <div class="wrap" :loading="loading">
    <div class="el-card">
      <h3 class="top">售后处理</h3>
      <div class="content status-box">
        <h4 class="status-tip">
          <i class="el-icon-warning"></i>
          <span v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===0">等待卖家处理退款申请</span>
          <span v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===1">卖家已同意退款申请，等待退款</span>
          <span v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===2">退款成功</span>
          <span v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===3">退款关闭</span>

          <span v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===4">等待卖家处理退款退货申请</span>
          <span v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===5">卖家已同意退款退货申请，等待买家寄回退货商品</span>
          <span v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===6">卖家已签收退货商品，等待退款</span>
          <span v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===7">退货成功</span>
          <span v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===8">退货关闭</span>

          <span v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===9">等待卖家处理换货申请</span>
          <span v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===10">卖家已同意换货申请，等待买家寄回换货商品</span>
          <span v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===11">卖家已签收换货商品，等待卖家寄出换货商品</span>
          <span v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===12">卖家已寄出换货商品，等待买家签收</span>
          <span v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===13">换货成功</span>
          <span v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===14">换货关闭</span>
        </h4>
        <div class="status-con"
             v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===0 || returnOrderInfo.returnOrderItemVOS[0].return_order_status===4 || returnOrderInfo.returnOrderItemVOS[0].return_order_status===9">
          <p v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===0">收到买家退款申请，等待卖家处理。</p>
          <p v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===4">收到买家退款退货申请，等待卖家处理。</p>
          <p v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===9">收到买家换货申请，等待卖家处理。</p>
          <div class="btn-box" v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===0">
            <el-button type="primary" @click="dialogAgreeVisible=true">同意买家退款</el-button>
            <el-button @click="dialogRefuseVisible=true">拒绝退款申请</el-button>
          </div>
          <div class="btn-box" v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===4">
            <el-button type="primary" @click="dialogAgreeVisible=true">同意买家退款退货</el-button>
            <el-button @click="dialogRefuseVisible=true">拒绝退款退货申请</el-button>
          </div>
          <div class="btn-box" v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===9">
            <el-button type="primary" @click="dialogAgreeVisible=true">同意买家换货</el-button>
            <el-button @click="dialogRefuseVisible=true">拒绝换货申请</el-button>
          </div>
        </div>
        <div class="status-con"
             v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===1 || returnOrderInfo.returnOrderItemVOS[0].return_order_status===5 || returnOrderInfo.returnOrderItemVOS[0].return_order_status===10">
          <p v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===1 || returnOrderInfo.returnOrderItemVOS[0].return_order_status===5">
            退款金额：￥{{returnOrderInfo.apply_money||0}}</p>
          <p v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===1 || returnOrderInfo.returnOrderItemVOS[0].return_order_status===5">
            退款方式：<span v-if="returnOrderInfo.order_pay_type==0">微信（￥{{returnOrderInfo.apply_money||0}}）</span></p>
          <div class="btn-box" v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===5">
            <el-button type="primary" @click="dialogAgreeVisible=true">确认签收退货商品</el-button>
            <el-button @click="dialogRefuseVisible=true">拒绝签收</el-button>
          </div>
          <div class="btn-box" v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===10">
            <el-button type="primary"  @click="dialogAgreeVisible=true">确认签收换货商品</el-button>
            <el-button @click="dialogRefuseVisible=true">拒绝签收</el-button>
          </div>
        </div>
        <div class="status-con"
             v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===2 || returnOrderInfo.returnOrderItemVOS[0].return_order_status===7 || returnOrderInfo.returnOrderItemVOS[0].return_order_status===13">
          <p v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===2 || returnOrderInfo.returnOrderItemVOS[0].return_order_status===7">
            退款金额：￥{{returnOrderInfo.apply_money||0}}</p>
          <p v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===2 || returnOrderInfo.returnOrderItemVOS[0].return_order_status===7">
            退款方式：<span v-if="returnOrderInfo.order_pay_type==0">微信（￥{{returnOrderInfo.apply_money||0}}）</span></p>
          <p v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===2 || returnOrderInfo.returnOrderItemVOS[0].return_order_status===7">
            扣除积分：{{returnOrderInfo.returnOrderItemVOS[0].point_deducted||0}} </p>
          <p v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===2 || returnOrderInfo.returnOrderItemVOS[0].return_order_status===7">
            到账时间：￥{{returnOrderInfo.success_time||'00:00:00'}} </p>
          <div class="btn-box" v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===13">
            <el-button type="primary" @click="toShowLogisticsView">查看物流</el-button>
          </div>
        </div>
        <div class="status-con"
             v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===3 || returnOrderInfo.returnOrderItemVOS[0].return_order_status===8 || returnOrderInfo.returnOrderItemVOS[0].return_order_status===14">
          <p v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===3">卖家拒绝申请，本次售后申请关闭！</p>
          <p v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===8">卖家拒绝退货，本次售后申请关闭！</p>
          <p v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===14">卖家拒绝换货，本次售后申请关闭！</p>
        </div>

        <div class="status-con" v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===6">
          <p>退款金额：￥{{returnOrderInfo.apply_money||0}}</p>
          <p>退款方式：<span v-if="returnOrderInfo.order_pay_type==0">微信（￥{{returnOrderInfo.apply_money||0}}）</span></p>
        </div>
        <div class="status-con" v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===11">
          <el-button type="primary" @click="dialogSendGoods=true">寄出换货商品</el-button>
        </div>
        <div class="status-con" v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===12">
          <el-button type="primary" @click="toShowLogisticsView">查看物流</el-button>
        </div>
      </div>
    </div>
    <div class="el-card apply-wrap">
      <h3 class="top">申请信息</h3>
      <div class="content">
        <el-row>
          <el-col :span="10">售后单号：{{returnOrderInfo.return_order_code}}</el-col>
          <el-col :span="6">售后类型：<span v-if="returnOrderInfo.return_type==0">退款</span><span
                  v-if="returnOrderInfo.return_type==1">退款退货</span><span
                  v-if="returnOrderInfo.return_type==2">换货</span></el-col>
          <el-col :span="6">申请时间：{{returnOrderInfo.create_time}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="10">订单编号：{{returnOrderInfo.order_sn}}
            <router-link class="blue"
                         :to="{path:'/ordermanage/orderDetail', query:{'orderSn': returnOrderInfo.order_sn}}">查看详情
            </router-link>
          </el-col>
          <el-col :span="6">订单总额：￥{{returnOrderInfo.orderPrice||0}}</el-col>
          <el-col :span="6">退款金额：￥{{returnOrderInfo.apply_money||0}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="10">订单类型：
            <span v-if="returnOrderInfo.order_type==0">普通订单</span>
          </el-col>
          <el-col :span="6">会员帐号：{{returnOrderInfo.nickname}}</el-col>
          <el-col :span="6">退款方式：<span
                  v-if="returnOrderInfo.order_pay_type==0 ">微信（￥{{returnOrderInfo.apply_money}}）</span>
          </el-col>
        </el-row>
        <el-row class="returnDesc">
          <label name="desc">原&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;因：</label>
          <div class="desc">
            <p>{{returnOrderInfo.return_reason || '无'}}</p>
            <div class="img-box">
              <img v-for="img in returnOrderInfo.return_images" :src="img.img" alt=""
                   @click="toPreview(img.img)">
            </div>
          </div>
        </el-row>
      </div>
    </div>
    <div class="el-card commodity-wrap">
      <h3 class="top">商品信息</h3>
      <table class="el-table info-table" cellspacing="0" cellpadding="0" border="1">
        <tr>
          <th width="30%">商品信息</th>
          <th width="10%">单价</th>
          <th width="10%">数量</th>
          <th width="10%">优惠券平摊</th>
          <th width="10%">会员优惠</th>
          <th width="10%">会员折扣</th>
          <th width="10%">实付金额</th>
          <th width="20%">售后状态</th>
          <th width="10%">退款数量</th>
        </tr>
        <tr>
          <td>
            <div class="scope-img">
              <img width="60" height="60" :src="returnOrderInfo.returnOrderItemVOS[0].image_thumbnail" alt="">
              <span class="nam-text">
                                {{ returnOrderInfo.returnOrderItemVOS[0].goods_name }} <br>
                                {{ returnOrderInfo.returnOrderItemVOS[0].product_spec_name }}
                            </span>
            </div>
          </td>
          <td>￥{{ returnOrderInfo.returnOrderItemVOS[0].product_price }}</td>
          <td>x {{ returnOrderInfo.returnOrderItemVOS[0].product_num }}</td>
          <td>￥{{ returnOrderInfo.returnOrderItemVOS[0].product_price_coupon }}</td>
          <td>￥{{ returnOrderInfo.returnOrderItemVOS[0].product_price_discount }}</td>
          <td>{{ returnOrderInfo.returnOrderItemVOS[0].member_discount_rate }}</td>
          <td>￥{{ returnOrderInfo.returnOrderItemVOS[0].product_total_pay }}</td>
          <td>
            <span v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===0">退款待审核</span>
            <span v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===1">同意退款申请</span>
            <span v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===2">退款成功</span>
            <span v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===3">退款关闭</span>

            <span v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===4">退货待审核</span>
            <span v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===5">同意退货申请</span>
            <span v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===6">卖家已签收</span>
            <span v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===7">退货成功</span>
            <span v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===8">退货关闭</span>

            <span v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===9">换货待审核</span>
            <span v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===10">同意换货申请</span>
            <span v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===11">卖家已签收</span>
            <span v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===12">换货商品寄出</span>
            <span v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===13">换货成功</span>
            <span v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===14">换货关闭</span>
          </td>
          <td>{{ (returnOrderInfo.returnOrderItemVOS[0].return_order_status===2 || returnOrderInfo.returnOrderItemVOS[0].return_order_status===7 ||returnOrderInfo.returnOrderItemVOS[0].return_order_status===13)?'x'+returnOrderInfo.apply_num:''}}</td>
        </tr>
      </table>
    </div>
    <div class="el-card">
      <h3 class="top">协商记录</h3>
      <div class="logbook">
        <p v-for="item in returnOrderInfo.returnOrderLogVOS">{{item.orderLogContent}}</p>
      </div>
    </div>
    <div class="bottom-btn">
      <el-button @click="$router.go(-1)">返回</el-button>
    </div>
    <!-- 图片预览 -->
    <el-dialog v-model="dialogImageVisible" size="tiny">
      <img class="previewImg" width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <!-- 同意申请 -->
    <el-dialog title="售后处理" :visible.sync="dialogAgreeVisible" size="tiny" class="agree-dialog">
      <el-form label-width="100px" class="agree-form">
        <el-form-item label="申请方式：">
          <span v-if="returnOrderInfo.return_type==0">退款</span><span
                  v-if="returnOrderInfo.return_type==1">退款退货</span><span
                  v-if="returnOrderInfo.return_type==2">换货</span>
        </el-form-item>
        <el-form-item label="退款金额：" v-if="returnOrderInfo.return_type!=2">
          <span>￥{{returnOrderInfo.apply_money||0}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">

        <el-button type="primary" v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===0" @click="agreeOrRefuseApply(1)">同意买家退款</el-button>
        <el-button type="primary" v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===4" @click="agreeOrRefuseApply(1)">同意买家退款退货</el-button>
        <el-button type="primary" v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===9" @click="agreeOrRefuseApply(1)">同意买家换货</el-button>

        <el-button type="primary" v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===5" @click="agreeOrRefuseReceiveReturn(1)">确认签收退货商品</el-button>
        <el-button type="primary" v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===10" @click="agreeOrRefuseReceiveExchange(1)">确认签收换货商品</el-button>
      </div>
    </el-dialog>
    <!-- 拒绝申请 -->
    <el-dialog title="售后处理" :visible.sync="dialogRefuseVisible" size="tiny" class="refuse-dialog">
      <el-form label-width="100px">
        <el-form-item label="申请方式：">
          <span v-if="returnOrderInfo.return_type==0">退款</span><span
                v-if="returnOrderInfo.return_type==1">退款退货</span><span
                v-if="returnOrderInfo.return_type==2">换货</span>
        </el-form-item>
        <el-form-item label="退款金额："  v-if="returnOrderInfo.return_type!=2">
          <span>￥{{returnOrderInfo.apply_money||0}}</span>
        </el-form-item>
        <el-form-item
                label="拒绝理由：">
          <el-input class="input" type="textarea" v-model="sellerRefuseReason" :rows="4" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="agreeOrRefuseApply(0)" v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===0 || returnOrderInfo.returnOrderItemVOS[0].return_order_status===4||returnOrderInfo.returnOrderItemVOS[0].return_order_status===9">拒绝</el-button>
        <el-button type="primary" v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===5" @click="agreeOrRefuseReceiveReturn(0)">确认签收退货商品</el-button>
        <el-button type="primary" v-if="returnOrderInfo.returnOrderItemVOS[0].return_order_status===10" @click="agreeOrRefuseReceiveExchange(0)">确认签收换货商品</el-button>
      </div>
    </el-dialog>
    <!-- 寄出换货商品 -->
    <el-dialog title="售后处理" :visible.sync="dialogSendGoods" size="tiny" class="refuse-dialog">
      <el-form label-width="100px" class="sendGoodsForm">
        <el-form-item label="发货公司：" v-loading="logisticsCompanyLoading">
          <el-radio class="radio" v-model="logisticsCompanyInfo.isCompany"  :label="1">物流公司</el-radio>
          <el-radio class="radio" v-model="logisticsCompanyInfo.isCompany"  :label="2">其他</el-radio>
        </el-form-item>
        <el-form-item label="物流公司：" v-show="logisticsCompanyInfo.isCompany === 1">
          <el-select  placeholder="请选择" v-model="logisticsCompanyInfo.logistics_distribution_id" >
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
      <div slot="footer" class="dialog-footer">
        <el-button type="primary"  @click="sendOutGoods">寄出换货商品</el-button>
      </div>
    </el-dialog>
    <!--  查看物流信息 -->
    <el-dialog title="查看物流信息" :visible.sync="dialogLogistics" size="small" class="logistics-dialog" >
      <el-form  :inline="true" >
        <el-row>
          <el-form-item label="包裹：">
            <el-select  placeholder="请选择" v-model="logisticsViewInfo.currentLogistics" @change="getNewViewLogistics">
              <el-option
                      v-for="(item, index) in returnOrderInfo.logisticsVOList"
                      :key="index"
                      :label="'包裹'+(index+1)"
                      :value="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发货公司：">
            <span v-show="!logisticsViewInfo.changeLogistics">{{logisticsViewInfo.logistics_distribution_name || '无'}}</span>
            <el-select  placeholder="请选择" v-model="logisticsViewInfo.logistics_distribution_id_change"  v-show="logisticsViewInfo.changeLogistics">
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
            <span  v-show="!logisticsViewInfo.changeLogistics">{{logisticsViewInfo.logistics_distribution_sn || '无'}}</span>
            <el-input type="text" v-model="logisticsViewInfo.logistics_distribution_sn_change"  v-show="logisticsViewInfo.changeLogistics"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item>
            <el-button @click="toChangeLogisticsInfo">{{logisticsViewInfo.changeLogistics?  '确定修改': '修改物流信息'}}</el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <div class="content" v-loading="logisticsLoading">
        <p v-for="(item , index) in logisticsViewContent.data">
          {{item.time}} {{item.context}}
        </p>
        <p v-if="!logisticsViewContent.data.length && !logisticsViewInfo.logistics_distribution_name" style="text-align: center; margin-top: 20px;">该商品为无物流发货，无物流信息。</p>
        <p v-else style="text-align: center; margin-top: 20px;">快递单号异常！</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogLogistics=false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getReturnOrderDetail, agreeOrRefuseApply, agreeOrRefuseReceiveReturnGoods, agreeOrRefuseReceiveExchangeGoods, sendOutGoods} from '@/api/aftersalesmanage';
  import { getLogisticsCompanyList, viewLogistics, editOrderLogistics } from '@/api/freight';
  import CountDown from '@/components/CountDown'
  export default {
    name: 'aftersalesDetail',
    components: {
      CountDown
    },
    data() {
      return {
        dialogSendGoods: false,
        dialogAgreeVisible: false,
        dialogRefuseVisible: false,
        dialogImageVisible: false,
        dialogImageUrl: '',
        dialogLogistics: false,
        returnOrderInfo: {
          returnOrderItemVOS: [{
            brand_name: null,
            create_time: '',
            fail_reason: '',
            fail_reason_text: '',
            goods_id: '',
            goods_name: '',
            image_thumbnail: '',
            modify_time: '',
            order_id: '',
            order_item_id: '',
            order_sn: '',
            order_type: 0,
            point_deducted: 0,
            product_id: '',
            product_num: 1,
            product_price: 0,
            product_price_coupon: 0,
            product_price_discount: 0,
            product_spec_name: '',
            product_total_pay: 0,
            return_order_code: '',
            return_order_id: '',
            return_order_item_id: '',
            return_order_status: 0
          }]
        },
        sellerRefuseReason: '',
        loading: false,
        logisticsLoading: false,  // 加载物流信息
        logisticsCompanyLoading: false,
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
          logistics_distribution_name_change: '',  // 物流公司名称
          logistics_distribution_sn: '',  // 物流单号
          logistics_distribution_id_change: '',  // 物流公司id
          logistics_distribution_sn_change: ''  // 物流单号
        },
        logisticsViewContent: {data: []} // 物流的详细信息
      }
    },
    created() {
      this.getReturnOrderDetail();
    },
    filters: {
      formatMoney: function (value) {
        return value.toFixed(2);
      }
    },
    methods: {
      getReturnOrderDetail() { // 获取订单详情
        let data = {
          shopId: this.$store.getters.shopId,
          token: this.$store.getters.token,
          returnOrderId: this.$route.query.returnOrderId
        };
        this.loading = true;
        getReturnOrderDetail(data).then(response => {
          this.loading = false;
          if (response.return_images) {
            response.return_images = JSON.parse(response.return_images)
          }
          this.returnOrderInfo = response
           // 获得物流公司
           if (this.returnOrderInfo.returnOrderItemVOS && this.returnOrderInfo.returnOrderItemVOS.length && (this.returnOrderInfo.returnOrderItemVOS[0].return_order_status == 11 || this.returnOrderInfo.returnOrderItemVOS[0].return_order_status == 12 ||this.returnOrderInfo.returnOrderItemVOS[0].return_order_status == 13 )) {  // 卖家已签收换货商品
             if (this.returnOrderInfo.returnOrderItemVOS[0].return_order_status != 11) {  // 获得物流信息
               // 获得物流详情
               if (response.logisticsVOList && response.logisticsVOList.length) {
                 this.logisticsPackage = response.logisticsVOList
                 this.logisticsViewInfo.currentLogistics = 0
                 this.logisticsViewInfo.logistics_distribution_id = this.logisticsPackage[0].logisticsDistributionId
                 this.logisticsViewInfo.logistics_distribution_sn = this.logisticsPackage[0].logisticsDistributionSn
                 this.logisticsViewInfo.logistics_distribution_id_change = this.logisticsPackage[0].logisticsDistributionId
                 this.logisticsViewInfo.logistics_distribution_sn_change = this.logisticsPackage[0].logisticsDistributionSn
                 if(this.logisticsPackage[0].logisticsDistributionSn) {
                   this.getViewLogistics()
                 }
               }else {
                 this.logisticsViewInfo.currentLogistics = ''
               }
             }
             this.getLogisticsCompanyList()
           }
        }).catch(() => {
          this.loading = false;
        });
      },
      // 大图预览
      toPreview(src) {
        //图片放大查看
        this.dialogImageVisible = true;
        this.dialogImageUrl = src;
      },
      // 同意或拒绝申请
      agreeOrRefuseApply(isAgreed) {
        let data = {
          shopId: this.$store.getters.shopId,
          token: this.$store.getters.token,
          returnOrderItemId: this.returnOrderInfo.returnOrderItemVOS[0].return_order_item_id,
          isAgreed: isAgreed
        };
        if (isAgreed == 0) {
          data.sellerRefuseReason= this.sellerRefuseReason
        }
        agreeOrRefuseApply(data).then(() => {
          this.getReturnOrderDetail();
          this.dialogAgreeVisible = false
          this.dialogRefuseVisible = false
        }).catch(() => {
          return;
        });
      },
      // 同意或拒绝签收退货商品
      agreeOrRefuseReceiveReturn(isAgreed) {  // 0拒绝1同意
        let data = {
          shopId: this.$store.getters.shopId,
          token: this.$store.getters.token,
          returnOrderItemId: this.returnOrderInfo.returnOrderItemVOS[0].return_order_item_id,
          isAgreed: isAgreed
        };
        if (isAgreed == 0) {
          data.sellerRefuseReason= this.sellerRefuseReason
        }
        agreeOrRefuseReceiveReturnGoods(data).then(() => {
          this.getReturnOrderDetail();
          this.dialogAgreeVisible = false
          this.dialogRefuseVisible = false
        }).catch(() => {
          return;
        });
      },
      // 同意或拒绝签收换货商品
      agreeOrRefuseReceiveExchange(isAgreed) {
        let data = {
          shopId: this.$store.getters.shopId,
          token: this.$store.getters.token,
          returnOrderItemId: this.returnOrderInfo.returnOrderItemVOS[0].return_order_item_id,
          isAgreed: isAgreed
        };
        if (isAgreed == 0) {
          data.sellerRefuseReason= this.sellerRefuseReason
        }
        agreeOrRefuseReceiveExchangeGoods(data).then(() => {
          this.getReturnOrderDetail();
          this.dialogAgreeVisible = false
          this.dialogRefuseVisible = false
        }).catch(() => {
          return;
        });
      },
      // 卖家寄出换货商品
      sendOutGoods() {
        if(this.logisticsCompanyInfo.isCompany === 1 && this.logisticsCompanyInfo.logistics_distribution_id === '') {
          this.$message.error('请选择物流公司！')
          return false
        }
        if(this.logisticsCompanyInfo.isCompany === 1 && this.logisticsCompanyInfo.logistics_distribution_sn === '') {
          this.$message.error('请填写物流单号！')
          return false
        }
        let data = {
          shopId: this.$store.getters.shopId,
          token: this.$store.getters.token,
          returnOrderItemId: this.returnOrderInfo.returnOrderItemVOS[0].return_order_item_id,
          logistics_distribution_id: (this.logisticsCompanyInfo.isCompany === 1 ? this.logisticsCompanyInfo.logistics_distribution_id : ''),
          logistics_distribution_sn: (this.logisticsCompanyInfo.isCompany === 1 ? this.logisticsCompanyInfo.logistics_distribution_sn : '')
        };
        sendOutGoods(data).then(() => {
          this.getReturnOrderDetail();
          this.dialogSendGoods = false
        }).catch(() => {
          return;
        });
      },
      // 物流公司
      getLogisticsCompanyList() {
        let data = {
          shopId: this.$store.getters.shopId,
          token: this.$store.getters.token
        };
        let _this = this;
        this.logisticsCompanyLoading = true;
        getLogisticsCompanyList(data).then(response => {
          _this.logisticsCompanyLoading = false;
          _this.logisticsCompanyList = response.data || []
          // 获得id对应的公司名
          for (let i=0; i<_this.logisticsPackage.length; i++) {
            for (let j=0;j< _this.logisticsCompanyList.length; j++) {
              if(_this.logisticsCompanyList[j].logistics_id == _this.logisticsPackage[i].logisticsDistributionId) {
                _this.logisticsPackage[i].logistics_distribution_name = _this.logisticsCompanyList[j].logistics_name
                break;
              }
            }
            _this.logisticsViewInfo.logistics_distribution_name = _this.logisticsPackage[0].logistics_distribution_name
          }
        }).catch(error => {
          _this.logisticsCompanyLoading = false;
          return;
        })
      },
      // 物流信息
      getViewLogistics() {
        let data = {
          shopId: this.$store.getters.shopId,
          token: this.$store.getters.token,
          logistics_distribution_id: this.logisticsViewInfo.logistics_distribution_id,
          logistics_distribution_sn:this.logisticsViewInfo.logistics_distribution_sn
        };
        let _this = this;
        this.logisticsLoading = true;
        viewLogistics(data).then(response => {
          _this.logisticsLoading = false;
          if(response.data) {
            _this.logisticsViewContent = JSON.parse(response.data)
          }
        }).catch(error => {
          _this.logisticsLoading = false;
          return;
        })
      },
      //显示物流信息弹窗
      toShowLogisticsView() {
        if (this.logisticsViewInfo.currentLogistics!== -1) {  // 有包裹
          // this.logisticsViewInfo.logistics_distribution_id_change = this.logisticsViewInfo.logistics_distribution_id
          this.logisticsViewInfo.logistics_distribution_sn_change = this.logisticsViewInfo.logistics_distribution_sn
          if (this.logisticsViewInfo.logistics_distribution_name) {
            this.logisticsViewInfo.logistics_distribution_id_change = this.logisticsViewInfo.logistics_distribution_id
          } else {
            this.logisticsViewInfo.logistics_distribution_id_change = ''
          }
        }
        this.logisticsViewInfo.changeLogistics= false
        this.dialogLogistics=true
      },
      // 物流信息弹窗 - 选择发货公司
      selectLogistics(item) {
        this.logisticsViewInfo.logistics_distribution_name_change = item.logistics_name
      },
      // 获得新的包裹物流信息
      getNewViewLogistics() {
        if (this.logisticsViewInfo.currentLogistics>-1) {
          // this.logisticsViewInfo.logistics_distribution_id = this.logisticsPackage[this.logisticsViewInfo.currentLogistics].logisticsDistributionId
          this.logisticsViewInfo.logistics_distribution_id = ''
          this.logisticsViewInfo.logistics_distribution_sn = this.logisticsPackage[this.logisticsViewInfo.currentLogistics].logisticsDistributionSn
          this.logisticsViewInfo.logistics_distribution_name = this.logisticsPackage[this.logisticsViewInfo.currentLogistics].logistics_distribution_name
          // this.logisticsViewInfo.logistics_distribution_id_change = this.logisticsPackage[this.logisticsViewInfo.currentLogistics].logisticsDistributionId
          this.logisticsViewInfo.logistics_distribution_id_change = ''
          this.logisticsViewInfo.logistics_distribution_sn_change = this.logisticsPackage[this.logisticsViewInfo.currentLogistics].logisticsDistributionSn
          if(this.logisticsPackage[this.logisticsViewInfo.currentLogistics].logistics_distribution_name) {
            this.logisticsViewInfo.logistics_distribution_id = this.logisticsPackage[this.logisticsViewInfo.currentLogistics].logisticsDistributionId
            this.logisticsViewInfo.logistics_distribution_id_change = this.logisticsPackage[this.logisticsViewInfo.currentLogistics].logisticsDistributionId
            this.getViewLogistics()
          }else {
            this.logisticsViewContent.data = []
          }
        }
      },
      // 修改物流信息
      toChangeLogisticsInfo () {
        if (!this.logisticsViewInfo.changeLogistics) {  // 修改按钮为确定修改
          this.logisticsViewInfo.changeLogistics=true
          return false
        }

        // 确定修改的操作
        if (this.logisticsViewInfo.currentLogistics==-1) {
          this.$message.error('请选择包裹！')
          return false
        }
        if(this.logisticsViewInfo.logistics_distribution_id_change === '') {
          this.$message.error('请选择物流公司！')
          return false
        }
        if(this.logisticsViewInfo.logistics_distribution_sn_change === '') {
          this.$message.error('请填写物流单号！')
          return false
        }
        let data = {
          shopId: this.$store.getters.shopId,
          token: this.$store.getters.token,
          return_order_id: this.$route.query.returnOrderId,
          isOrder: this.logisticsPackage[this.logisticsViewInfo.currentLogistics].isOrder,
          pre_logistics_distribution_sn: this.logisticsViewInfo.logistics_distribution_sn,
          pre_logistics_distribution_id: this.logisticsViewInfo.logistics_distribution_id,
          new_logistics_distribution_id: this.logisticsViewInfo.logistics_distribution_id_change,
          new_logistics_distribution_sn:this.logisticsViewInfo.logistics_distribution_sn_change
        };
        let _this = this;
        editOrderLogistics(data).then(response => {
          this.$message.success('修改成功！')
          if (this.logisticsViewInfo.logistics_distribution_name_change != '') {
            this.logisticsViewInfo.logistics_distribution_name = this.logisticsViewInfo.logistics_distribution_name_change;
          }
          this.logisticsViewInfo.logistics_distribution_sn = this.logisticsViewInfo.logistics_distribution_sn_change;
          this.logisticsViewInfo.logistics_distribution_id = this.logisticsViewInfo.logistics_distribution_id_change;
          this.logisticsViewInfo.changeLogistics= false

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

<style lang="scss" rel="stylesheet/scss" scoped>
  .wrap {
    padding: 20px 30px;
  }
  .red {
    color: #ff4949;
  }
  .blue {
    color: #20A0FF;
  }
  .previewImg {
    cursor: zoom-in;
    cursor: -webkit-zoom-in;
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
      &.status-box {
        padding-bottom: 20px;
      }
    }
    .logbook {
      min-height: 200px;
      max-height: 500px;
      overflow-y: auto;
      padding: 0 20px;
    }
  }
  .status-box {
    padding-bottom: 20px;
    .status-tip {
      margin: 10px 20px;
      i {
        font-size: 36px;
        vertical-align: top;
        margin-right: 20px;
      }
      span {
        line-height: 36px;
        font-size: 20px;
      }
    }
    .status-con {
      margin-left: 80px;
      p {
        margin: 10px 0;
      }
    }
    .btn-box {
      padding: 10px 0 0;
    }
    .line-box {
      padding-top: 10px;
      border-top: 1px solid #d1dbe5;
    }
  }
  .apply-wrap {
    .reason {
      margin-top: 14px;
      padding-top: 10px;
      border-top: 1px solid #d1dbe5;
    }
    .returnDesc {
      label {
        width: 80px;
        display: inline-block;
      }
      .desc {
        width: calc(100% - 83px);
        margin-left: -3px;
        display: inline-block;
        vertical-align: top;
        p {
          margin-top: 0;
        }
        img {
          width: 60px;
          height: 60px;
          margin-right: 10px;
        }
      }
    }
  }
  .commodity-wrap {
    .info-table {
      margin: -1px 0;
      th, td {
        text-align: center;
        padding: 0 20px;
      }
      td:first-child {
        text-align: left;
      }
    }
    .scope-img {
      display: table;
      text-align: left;
      img {
        margin: 10px 10px 10px 0;
        vertical-align: middle;
      }
      span {
        display: table-cell;
        vertical-align: middle;
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
  .agree-dialog, .refuse-dialog, .logistics-dialog {
    button {
      min-width: 116px;
    }
  }
  .sendGoodsForm{
    width: 340px;
    margin: 0 auto;
    .el-select, .el-input{
      width: 220px;
    }
  }
  .logistics-dialog{
    .el-form-item{
      /*width: 260px;*/
      span{
        display: block;
      }
      .el-select, .el-input, span{
        width: 200px;
      }
    }
    .content{
      height: 200px;
      max-height: 400px;
      overflow: auto;
      border-top: 1px solid #bfcbd9;
    }
  }
</style>
<style lang="scss" rel="stylesheet/scss">
  .agree-dialog {
    .el-dialog--tiny {
      width: 20%;
    }
  }
  .logistics-dialog{
    .el-dialog{
      min-width: 920px ;
    }
  }
  .agree-dialog, .refuse-dialog, .logistics-dialog {
    .el-dialog__body {
      padding: 20px 40px 0 20px;
    }
    .el-dialog__footer {
      text-align: center;
      padding-bottom: 30px;
    }
  }
</style>
