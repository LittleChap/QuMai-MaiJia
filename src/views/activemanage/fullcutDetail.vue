<template>
  <div class="container">
    <div class="fullcut-name">
      <p>*满减券名称：</p>
      <div maxlenght=50>{{couponName}}</div>
    </div>
    <div class="fullcut-set-num">
      <p>*满减券发放数量：</p>
      <div maxlenght=50>{{grantNum}}</div>
    </div>
    <div class="fullcut-set-time">
      <p>*满减券发放时间：</p>
      <div maxlenght=50>{{grantTime}}</div>
    </div>
    <div class="fullcut-validity-time">
      <p>*使用有效期：</p>
      <div maxlenght=50>{{useTime}}</div>
    </div>
    <div class="fullcut-condition">
      <p>*使用条件：</p>
      <div maxlenght=50>{{priceThreshold}}</div>
    </div>
    <div class="fullcut-face-value">
      <p>*满减券面值：</p>
      <div maxlenght=50>{{priceDiscount}}</div>
    </div>
    <div class="fullcut-store-name">
      <p>*店铺名称：</p>
      <div maxlenght=50>{{shopName}}</div>
    </div>
    <div class="fullcut-scope">
      <p>*使用范围：</p>
      <div maxlenght=50>{{scopeName}}</div>
    </div>
    <!--按分类-->
    <div v-show="rangeType == 1" style="margin-left: -50px;">
      <el-table
          border
          :data="sortArray"
          style="width: 600px;">
        <el-table-column
            align="center"
            prop="catNames"
            label="分类"
            width="599">
        </el-table-column>
      </el-table>
    </div>
    <!--按商品-->
    <div v-show="rangeType == 2" style="margin-left: -50px;">
      <el-table
          border
          :data="goodsArray"
          style="width: 600px;">
        <el-table-column
            align="center"
            prop="goodsName"
            label="商品"
            width="298">
          <template scope="scope">
            <div style="display: table; width: 0; margin: 0;">
              <img style="width: 60px;height: 60px;float: left;margin: 10px 10px 10px 0;"
                   :src="scope.row.imageThumbnail" alt="">
              <span
                  style="display: table-cell;vertical-align: middle;text-align: left;">{{ scope.row.goodsName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            prop="priceRange"
            label="价格"
            width="100">
        </el-table-column>
        <el-table-column
            align="center"
            prop="shopName"
            label="店铺"
            width="100">
        </el-table-column>
        <el-table-column
            align="center"
            prop="store"
            label="库存"
            width="100">
        </el-table-column>
      </el-table>
    </div>
    <div style="width: 600px; text-align: center;margin-top: 40px;">
      <el-button style="width: 100px;" @click="$router.go(-1)">返回</el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getCouponDetail} from '@/api/couponlist'

  export default {
    data() {
      return {
        couponSn: '',
        couponName: '',             // 优惠券名称
        grantNum: '',               // 发放数量
        grantTime: '',              // 发放时间
        useTime: '',                // 使用有效期
        priceThreshold: '',         // 使用条件
        priceDiscount: '',          // 面值
        shopName: '',               // 店铺名称
        rangeType: '',              // 使用范围
        scopeName: '',              // 展示 使用范围的类型
        sortArray: [{catpathstr: ''}], //使用范围 按分类
        goodsArray: [{goodsName: '哈哈', price: '1', store: '100'}]  // 使用范围 按商品
      }
    },
    created() {
      this.couponSn = this.$route.query.couponSn
      this.getDetail()
    },
    methods: {
      getDetail() {
        let data = {
          token: this.$store.getters.token,
          shopId: this.$store.getters.shopId,
          couponSn: this.couponSn
        }
        getCouponDetail(data).then(res => {
          this.couponName = res.couponjson.couponName
          this.grantNum = res.couponjson.grantNum
          this.grantTime = res.couponjson.grantStartTime + ' ~ ' + res.couponjson.grantEndTime
          this.useTime = res.couponjson.useStartTime + ' ~ ' + res.couponjson.useEndTime
          if (res.couponjson.priceThreshold == 0) {
            this.priceThreshold = '无使用门槛'
          } else {
            this.priceThreshold = '满' + res.couponjson.priceThreshold + '元可用'
          }
          this.priceDiscount = res.couponjson.priceDiscount
          this.shopName = res.couponjson.shopName
          this.rangeType = res.couponjson.rangeType
          if (res.couponjson.rangeType == 0) {
            this.scopeName = '全部商品'
          } else if (res.couponjson.rangeType == 1) {
            this.scopeName = '部分分类'
            this.sortArray = res.couponjson.catArray
          } else if (res.couponjson.rangeType == 2) {
            this.scopeName = '部分商品'
            this.goodsArray = res.couponjson.goodsArrayForUseRange
          }
        }).catch(() => {
          return
        })
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .container {
    margin: 20px 30px 0 30px;
    div > div {
      display: inline-block;
      margin-left: 50px;
      width: 400px;
    }
    p {
      display: inline-block;
      width: 135px;
      height: 30px;
      text-align: left;
      line-height: 30px;
    }
  }
</style>