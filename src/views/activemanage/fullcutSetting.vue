<template>
  <div class="container fullcutSetWrap" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="fullcut-name">
      <p>*满减券名称：</p>
      <el-input maxlenght=50 v-model="couponName"></el-input>
    </div>
    <div class="fullcut-set-num">
      <p>*满减券发放数量：</p>
      <!--<el-input maxlenght=50 v-model="grantNum" ></el-input>-->
      <div class="el-input">
        <input type="text" class="el-input__inner" maxlenght=50 v-model="grantNum"
               @input="moneyInput('grantNum', false)">
      </div>
      <el-tooltip effect="dark" content="每人限领1张" placement="right-start">
        <div class="tip-text">?</div>
      </el-tooltip>
      <span class="error-tip red"
            v-show="grantNum!==''&&!/^[1-9]\d*$/.test(grantNum)">输入正整数</span>
    </div>
    <div class="fullcut-set-time">
      <p>*满减券发放时间：</p>
      <el-date-picker type="datetime" placeholder="选择开始时间" v-model="setTime1"
                      style="width: 180px;" @change="timeChoose('setTime')"></el-date-picker>
      -
      <el-date-picker type="datetime" placeholder="选择结束时间" v-model="setTime2"
                      style="width: 180px;" @change="timeChoose('setTime')"></el-date-picker>
    </div>
    <div class="fullcut-validity-time">
      <p>*使用有效期：</p>
      <el-date-picker type="datetime" placeholder="选择开始时间" v-model="validityTime1"
                      style="width: 180px;" @change="timeChoose('validityTime')"></el-date-picker>
      -
      <el-date-picker type="datetime" placeholder="选择结束时间" v-model="validityTime2"
                      style="width: 180px;" @change="timeChoose('validityTime')"></el-date-picker>
    </div>
    <div class="fullcut-condition">
      <p>*满减券使用条件：</p>
      <el-radio-group v-model="conditionRadio" @change="changeConditionRadio" style="margin-bottom: 10px;">
        <el-radio class="radio" v-model="conditionRadio" label="0">无使用门槛</el-radio>
        <el-radio style="margin-top: 10px;" class="radio" v-model="conditionRadio" label="1">满
          <div class="el-input el-input--small" :class="{'is-disabled': conditionRadio==0 }" style="width: 80px; margin: 0 5px;">
            <input type="text" class="el-input__inner" :disabled="conditionRadio==0" maxlenght=50 v-model="priceThreshold"
                   @blur="toSetNumber('priceThreshold')"
                   @input="moneyInput('priceThreshold', true)">
          </div>
          <!--<el-input v-model="priceThreshold" :disabled="conditionRadio==0" size="small"
                    style="width: 80px; margin: 0 5px;"></el-input>-->
          元可用
        </el-radio>
      </el-radio-group>
      <span class="error-tip red"
            v-show="priceThreshold!==''&&!/^[0-9]+([.]{1}[0-9]{1,2})*$/.test(priceThreshold)">输入正数(或带小数点后两位)</span>
    </div>
    <div class="fullcut-face-value">
      <p>*满减券面值：</p>
      <div class="el-input">
        <input type="text" class="el-input__inner" maxlenght=50 v-model="priceDiscount"
               @blur="toSetNumber('priceDiscount')"
               @input="moneyInput('priceDiscount', true)">
      </div>
      <!--<el-input maxlenght=50 v-model="priceDiscount"></el-input>-->
     <!-- <span class="error-tip red"
            v-show="priceDiscount!==''&&!/^[0-9]+([.]{1}[0-9]{1,2})*$/.test(priceDiscount)">输入正数(或带小数点后两位)</span>-->
    </div>
    <div class="fullcut-scope">
      <p>*满减券使用范围：</p>
      <el-radio-group v-model="rangeType" @change="changeScopeRadio" style="margin-bottom: 10px;">
        <el-radio class="radio" v-model="rangeType" label="0">全部商品</el-radio>
        <el-radio style="margin-top: 10px;" class="radio" v-model="rangeType" label="1">按分类</el-radio>
        <el-radio style="margin-top: 10px;" class="radio" v-model="rangeType" label="2">按商品</el-radio>
      </el-radio-group>
      <!--按分类-->
      <div v-show="rangeType == 1">
        <el-row :gutter="20" style="margin-right: 0px;">
          <el-col :span="1">
            <el-button @click="addSort" type="text" icon="plus">添加分类</el-button>
          </el-col>
        </el-row>
        <el-table
           border
           :data="sortArray"
           style="width: 600px;">
          <el-table-column
             align="center"
             prop="catIds"
             label="分类"
             width="400">
            <template scope="scope">
              <el-input icon="caret-bottom" v-model="scope.row.catNames" placeholder="请选择分类"
                        @focus="toShowCartDialog(scope.$index)"></el-input>
              <!--<el-cascader
                  size="small"
                  placeholder="请选择分类"
                  expand-trigger="click"
                  :options="options"
                  :clearable=true
                  :change-on-select=true
                  :props="props"
                  v-model="scope.row.catIds">
              </el-cascader>-->
            </template>
          </el-table-column>
          <el-table-column
             align="center"
             label="操作"
             min-width="150">
            <template scope="scope">
              <el-button @click.native.prevent="delSort(scope.$index)" icon="delete" size="small">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--按商品-->
      <div v-show="rangeType == 2">
        <el-row :gutter="20" style="margin-right: 0px;">
          <el-col :span="1">
            <el-button @click="addGoods" type="text" icon="plus">添加商品</el-button>
          </el-col>
        </el-row>
        <el-table
           border
           :data="goodsArray"
           style="width: 600px;">
          <el-table-column
             align="center"
             prop="goodsName"
             label="商品"
             width="290">
            <template scope="scope">
              <div style="display: table; margin: 0">
                <img style="width: 60px;height: 60px;float: left;margin: 10px 10px 10px 0;border: 1px solid #ccc;"
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
             prop="store"
             label="库存"
             width="100">
          </el-table-column>
          <el-table-column
             align="center"
             label="操作"
             min-width="100">
            <template scope="scope">
              <el-button @click.native.prevent="delGoods(scope.$index)" icon="delete" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--添加商品弹框-->
    <el-dialog
       class="selectGoodsDialog"
       title="选择商品"
       :visible.sync="goodsDialogVisible"
    >
      <el-row :gutter="40">
        <el-col :span="8">
          <div class="goods-sort">
            <p>*商品分类:</p>
            <el-cascader
               style="width: 200px;"
               placeholder="全部分类"
               class="big-input"
               expand-trigger="hover"
               :options="catList"
               :clearable=true
               :props="props"
               v-model="catId">
            </el-cascader>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="goods-name">
            <p>*商品名称:</p>
            <el-input style="width: 200px;" type="text" v-model="goodsName"></el-input>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="goods-SKU">
            <p>*商品SKU:</p>
            <el-input style="width: 200px;" type="text" v-model="sku"></el-input>
          </div>
        </el-col>
      </el-row>
      <div class="search">
        <el-button style="width: 100px;" type="primary" size="small" @click="searchGoods">查询</el-button>
      </div>
      <el-table
         :data="goodsInfos"
         border
         style="width: 100%"
         v-loading.body="loading">
        <el-table-column
           align="center"
           prop="goodsName"
           label="商品名"
           width="300">
          <template scope="scope">
            <div style="display: table;">
              <img style="width: 60px;height: 60px;float: left;margin: 10px 10px 10px 0;border: 1px solid #ccc;"
                   :src="scope.row.imageThumbnail" alt="">
              <span
                 style="display: table-cell; text-align: left; vertical-align: middle;">{{ scope.row.goodsName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
           align="center"
           prop="specNameArray"
           label="规格"
           min-width="150">
        </el-table-column>
        <el-table-column
           align="center"
           prop="priceRange"
           label="价格"
           width="100">
        </el-table-column>
        <el-table-column
           align="center"
           prop="store"
           label="库存">
        </el-table-column>
        <el-table-column
           align="center"
           prop="status"
           label="状态">
          <template scope="scope">
            <el-button v-show="scope.row.status == 1" size="small" @click="select(scope)">已选</el-button>
            <el-button v-show="scope.row.status == 0" size="small" @click="select(scope)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页器-->
      <div class="pagination">
        <el-pagination
           @size-change="handleSizeChange"
           @current-change="handleCurrentChange"
           :page-sizes="[5]"
           layout="total, sizes, prev, pager, next, jumper"
           :total="totalResult">
        </el-pagination>
      </div>
      <div class="btns" style="margin-top: 20px; text-align: center;">
        <el-button style="width: 100px;" type="primary" @click="confirmSelect">添加</el-button>
        <el-button style="width: 100px;" type="primary" @click="cancelSelect">取消</el-button>
      </div>
    </el-dialog>
    <div style="width: 600px; text-align: center;margin-top: 40px; padding-bottom: 80px;">
      <el-button style="width: 100px;" type="primary" @click="saveSetting">保存</el-button>
      <el-button style="width: 100px;" @click="$router.go(-1)">返回</el-button>
    </div>
    <!-- 选择分类的弹窗 -->
    <el-dialog title="选择分类" class="catSelectDialog" :visible.sync="showCartDialog">
      <div class="catListWrap">
        <div class="catBox">
          <ul>
            <li v-for="(firstCat, firstIndex) in catList"
                :class="{'active':currentSelectCatIndex.first === firstIndex}"
                @click="selectCat(firstIndex,-1,-1)"
            >{{firstCat.catName}}
            </li>
          </ul>
        </div>
        <div class="catBox">
          <ul
             v-if="currentSelectCatIndex.first>-1 && catList.length && catList[currentSelectCatIndex.first] && catList[currentSelectCatIndex.first].childrenGoodsCatArray">
            <li v-for="(secondCat, secondIndex) in catList[currentSelectCatIndex.first].childrenGoodsCatArray"
                :class="{'active':currentSelectCatIndex.second === secondIndex}"
                @click="selectCat(currentSelectCatIndex.first,secondIndex,-1)"
            >{{secondCat.catName}}
            </li>
          </ul>
        </div>
        <div class="catBox">
          <ul
             v-if="currentSelectCatIndex.first>-1 &&  currentSelectCatIndex.second>-1 &&catList.length && catList[currentSelectCatIndex.first].childrenGoodsCatArray[currentSelectCatIndex.second].childrenGoodsCatArray">
            <li
               v-for="(thirdCat, thirdIndex) in catList[currentSelectCatIndex.first].childrenGoodsCatArray[currentSelectCatIndex.second].childrenGoodsCatArray"
               :class="{'active':currentSelectCatIndex.third === thirdIndex}"
               @click="selectCat(currentSelectCatIndex.first,currentSelectCatIndex.second,thirdIndex)"
            >{{thirdCat.catName}}
            </li>
          </ul>
        </div>
        <p>您当前已选择的分类：
          <span v-if="currentSelectCatIndex.first>-1">{{catList[currentSelectCatIndex.first].catName}}</span>
          <span v-if="currentSelectCatIndex.first>-1&&currentSelectCatIndex.second>-1">> {{catList[currentSelectCatIndex.first].childrenGoodsCatArray[currentSelectCatIndex.second].catName}}</span>
          <span v-if="currentSelectCatIndex.first>-1&&currentSelectCatIndex.second>-1&&currentSelectCatIndex.third>-1">> {{catList[currentSelectCatIndex.first].childrenGoodsCatArray[currentSelectCatIndex.second].childrenGoodsCatArray[currentSelectCatIndex.third].catName}}</span>
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="toConfirmSelectCat">确认选择</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import {saveOrEditCoupon, selectGoodsToUseRange, getCouponDetail} from '@/api/couponlist'
  import {getAllGoodsCatList} from '@/api/goodslist'
  import {parseTime} from '@/utils/index';

  export default {
    data() {
      return {
        couponId: '',
        couponSn: '',
        couponName: '',            // 优惠券名称
        grantNum: '',          // 发放数量
        setTime1: '',               // 发放时间-开始
        setTime2: '',                // 发放时间-结束
        validityTime1: '',          // 使用有效期-开始
        validityTime2: '',           // 使用有效期-结束
        conditionRadio: '0',        // 使用条件
        priceThreshold: '',         // 使用条件为满值可用时的 限制值,没有时，默认为0
        priceDiscount: '',              // 面值
        rangeType: '0',            // 使用范围
        catIds: '',                 // 使用范围为1时，所需要的分类ids
        goodsIds: '',               // 使用范围为2时，所需要的商品ids
        sortArray: [],              //使用范围 按分类
        goodsArray: [],             // 商品集合
        // options: [],                // 全部分类信息
        showCartDialog: false,  // 是否显示分类选择弹窗
        catList: [  // 分类列表
          {
            childrenGoodsCatArray: [{
              childrenGoodsCatArray: []
            }]
          }
        ],
        currentSelectIndex: -1,  // 当前要编辑的分类
        selectCatNames: '',
        currentSelectCatIndex: {
          first: -1,
          second: -1,
          third: -1
        },

        props: {
          value: 'catId',
          label: 'catName',
          children: 'childrenGoodsCatArray'
        },
        // 商品弹框里面的东西
        goodsName: '',                     // 要搜索的商品名字
        sku: '',                      // sku
        catId: [],
        goodsDialogVisible: false,   // 添加商品弹框
        goodsInfos: [
          /*{
            goodsName: '呵呵',
            imageThumbnail: '',
            specNameArray: [],
            priceRange: '1',
            store: '1',
            status: '0'
          }*/
        ],            // 商品列表
        selectGoods: [],              // 选择完的商品集合
        currentPage: '',
        showCount: '5',
        totalResult: 0,
        loading: false,                 // 选择商品列表中的 界面加载
        fullscreenLoading: false,        // 展示 页面加载效果
        tempArray: [],                   // 作为中间变量保存数据
        paginationIsHandle: false        // 分页器是否操作
      }
    },
    created() {
      // 判断此时是第一次新增，还是再次编辑
      if (this.$route.query.id > -1) {
        this.couponId = this.$route.query.id
        this.couponSn = this.$route.query.couponSn
        this.getDetail()
      } else {
        // 获取商品分类
        this.getGoods()
        // 获取选择商品里面的商品列表
        this.selectGoodsToUseRange()
      }
    },
    methods: {
      // 金额 和 数字 控制
      moneyInput(itemName, isMoney) {
        let value = this[itemName]
        if (isMoney) {  //有小数点
          value = value.replace(/[^\d\.]/g, '');  //清除“数字”和“.”以外的字符
          value = value.replace(/^\./g, "0."); //验证第一个字符是数字而不是
          value = value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
          value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", "."); //保证.只出现一次，而不能出现两次以上
          value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
        } else {
          value = value.replace(/[^\d]/g, '');  //清除“数字”以外的字符
        }
        if (value.indexOf(".") < 0 && value != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
          value = parseFloat(value);
        }
        this[itemName] = value
      },
      // 金额 和 重量  默认为0
      toSetNumber(itemName) {
        if (this[itemName] != '') {
          this[itemName] = parseFloat(this[itemName])
        }
      },
      // 获取详情
      getDetail() {
        this.fullscreenLoading = true
        let data = {
          token: this.$store.getters.token,
          shopId: this.$store.getters.shopId,
          couponId: this.couponId,
          couponSn: this.couponSn
        }
        getCouponDetail(data).then(res => {
          if (res.code == 1) {
            this.fullscreenLoading = false
            this.couponName = res.couponjson.couponName
            this.grantNum = res.couponjson.grantNum
            if (res.couponjson.priceThreshold == 0) {
              this.conditionRadio = '0'
            } else {
              this.conditionRadio = '1'
              this.priceThreshold = res.couponjson.priceThreshold
            }
            this.priceDiscount = res.couponjson.priceDiscount
            // 清空发送时间和使用有效期
            // this.setTime = []
            // this.validityTime = []
            // 如果返回值有发送时间或者使用有效期，就设置，没有就为空
            if (res.couponjson.grantStartTime != undefined) {
              this.setTime1 = new Date(res.couponjson.grantStartTime)
              this.setTime2 = new Date(res.couponjson.grantEndTime)
              this.validityTime1 = new Date(res.couponjson.useStartTime)
              this.validityTime2 = new Date(res.couponjson.useEndTime)
            }
            this.rangeType = res.couponjson.rangeType.toString()
            if (this.rangeType == 1) {
              // 按分类
              this.sortArray = res.couponjson.catArray
              for (let i = 0; i < res.couponjson.catArray.length; i++) {
                this.sortArray[i].catNames = res.couponjson.catArray[i].catNames
                this.sortArray[i].catIds = JSON.parse(res.couponjson.catArray[i].catIds)
              }
            } else if (this.rangeType == 2) {
              // 按商品
//                            this.goodsInfos = res.couponjson.goodsArrayForUseRange
              this.goodsArray = res.couponjson.goodsArrayForUseRange
            }
            // 获取商品分类
            this.getGoods()
            // 获取选择商品里面的商品列表
            this.selectGoodsToUseRange()
          } else {
            this.fullscreenLoading = false
            this.$messsage.error(res.message)
          }
        }).catch(() => {
          this.fullscreenLoading = false
          return
        })
      },
      // 获取商品分类
      getGoods() {
        let data = {
          token: this.$store.getters.token,
          shopId: this.$store.getters.shopId
        }
        getAllGoodsCatList(data).then(res => {
          this.options = res.goodsCatArray
          this.catList = res.goodsCatArray
        }).catch(() => {
          return
        })
      },
      // 显示分类弹窗
      toShowCartDialog(index) {
        this.currentSelectIndex = index
        this.showCartDialog = true
        if (this.sortArray[index].currentSelectCatIndex) {
          this.currentSelectCatIndex = this.sortArray[index].currentSelectCatIndex
          return false
        }
        this.sortArray[index].currentSelectCatIndex = {
          first: -1,
          second: -1,
          third: -1
        }
        if (this.sortArray[index].catIds.length) {
          let catIds = this.sortArray[index].catIds
          this.catList.map((firstCat, firstIndex) => {
            if (firstCat.catId == catIds[0]) {
              this.sortArray[index].currentSelectCatIndex.first = firstIndex
              if (catIds.length > 1 && firstCat.childrenGoodsCatArray && firstCat.childrenGoodsCatArray.length) {
                firstCat.childrenGoodsCatArray.map((secondCat, secondIndex) => {
                  if (secondCat.catId == catIds[1]) {
                    this.sortArray[index].currentSelectCatIndex.second = secondIndex
                    if (catIds.length > 2 && secondCat.childrenGoodsCatArray && secondCat.childrenGoodsCatArray.length) {
                      secondCat.childrenGoodsCatArray.map((thirdCat, thirdIndex) => {
                        if (thirdCat.catId == catIds[2]) {
                          this.sortArray[index].currentSelectCatIndex.third = thirdIndex
                        }
                      })
                    }
                  }
                })
              }
            }
          })
        }
        this.currentSelectCatIndex = this.sortArray[index].currentSelectCatIndex
      },
      // 选择分类
      selectCat(first, second, third) {
        this.currentSelectCatIndex = {
          first: first,
          second: second,
          third: third
        }
        this.sortArray[this.currentSelectIndex].currentSelectCatIndex = this.currentSelectCatIndex
      },
      // 确认选择分类
      toConfirmSelectCat() {
        this.sortArray[this.currentSelectIndex].catIds = []
        this.sortArray[this.currentSelectIndex].catNames = ''
        /*let catId = []
        let selectCatNames = ''*/
        this.showCartDialog = false
        if (this.currentSelectCatIndex.first < 0) {
          return false
        }
        this.sortArray[this.currentSelectIndex].catIds.push(this.catList[this.currentSelectCatIndex.first].catId)
        this.sortArray[this.currentSelectIndex].catNames = this.catList[this.currentSelectCatIndex.first].catName
        if (this.currentSelectCatIndex.second < 0) {
          return false
        }
        this.sortArray[this.currentSelectIndex].catIds.push(this.catList[this.currentSelectCatIndex.first].childrenGoodsCatArray[this.currentSelectCatIndex.second].catId)
        this.sortArray[this.currentSelectIndex].catNames += ' / ' + this.catList[this.currentSelectCatIndex.first].childrenGoodsCatArray[this.currentSelectCatIndex.second].catName
        if (this.currentSelectCatIndex.third < 0) {
          return false
        }
        this.sortArray[this.currentSelectIndex].catIds.push(this.catList[this.currentSelectCatIndex.first].childrenGoodsCatArray[this.currentSelectCatIndex.second].childrenGoodsCatArray[this.currentSelectCatIndex.third].catId)
        this.sortArray[this.currentSelectIndex].catNames += ' / ' + this.catList[this.currentSelectCatIndex.first].childrenGoodsCatArray[this.currentSelectCatIndex.second].childrenGoodsCatArray[this.currentSelectCatIndex.third].catName

      },

      // 获取选择商品里面的商品列表
      selectGoodsToUseRange() {
        this.loading = true
        let data = {
          token: this.$store.getters.token,
          shopId: this.$store.getters.shopId,
          couponId: this.couponId,
          couponSn: this.couponSn,
          catId: this.catId.length == 0 ? '' : this.catId[this.catId.length - 1],
          goodsName: this.goodsName,
          sku: this.sku,
          currentPage: this.currentPage,
          showCount: this.showCount
        }
        selectGoodsToUseRange(data).then(res => {
          this.loading = false
          this.totalResult = res.totalResult
          this.currentPage = res.currentPage
          this.goodsInfos = res.goodsArray
          this.selectGoods = this.goodsArray
          if (!this.paginationIsHandle) {
            for (let i = 0; i < this.goodsArray.length; i++) {
              this.tempArray[i] = {}
              for (let j in this.goodsArray[i]) {
                this.tempArray[i][j] = this.goodsArray[i][j]
              }
            }
          }
          for (let i = 0; i < this.goodsInfos.length; i++) {
            this.goodsInfos[i].status = '0'
            for (let j = 0; j < this.selectGoods.length; j++) {
              if (this.goodsInfos[i].goodsId == this.selectGoods[j].goodsId) {
                this.goodsInfos[i].status = '1'
              }
            }
          }
        }).catch(() => {
          this.loading = false
          return
        })
      },
      // 时间比较
      timeChoose(name) {
        if (this[name + '1'] && this[name + '2']) {
          if (this[name + '2'] < this[name + '1']) {
            this.$alert('开始时间不能晚于结束时间', {
              confirmButtonText: '确 定',
              type: 'warning',
              callback: () => {
                this[name + '1'] = '';
                this[name + '2'] = ''
              }
            });
          }
        }
      },
      // 改变使用有效期
      changeValidityTime(value) {
        this.validityTime1 = value
      },
      // 改变使用条件
      changeConditionRadio() {
      },
      // 改变使用范围
      changeScopeRadio() {
      },
      // 删除分类
      delSort(index) {
        this.$confirm('是否删除该分类', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.sortArray.splice(index, 1);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 添加分类
      addSort() {
        this.sortArray.push({
          catNames: '',
          catIds: []
        })
      },
      // 删除商品
      delGoods(index) {
        this.$confirm('是否删除该分类', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.paginationIsHandle = false
          this.goodsArray.splice(index, 1)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 添加商品
      addGoods() {
        this.selectGoodsToUseRange()
        this.goodsDialogVisible = true
      },
      // 添加商品弹框里面的查询
      searchGoods() {
        this.selectGoodsToUseRange()
      },
      // 添加商品弹框里面的选择商品
      select(value) {
        let index = value.$index
        if (value.row.status == 1) {
          this.goodsInfos[index].status = 0
          for (let i = 0; i < this.selectGoods.length; i++) {
            if (this.selectGoods[i].goodsId == this.goodsInfos[index].goodsId) {
              this.selectGoods.splice(i, 1)
            }
          }
        } else {
          this.goodsInfos[index].status = 1
          this.selectGoods.push(this.goodsInfos[index])
        }
      },
      // 添加商品弹框里面的确认选择
      confirmSelect() {
        this.goodsName = ''
        this.sku = ''
        this.catId = []
        this.paginationIsHandle = false
        this.goodsArray = []
        if (this.selectGoods.length != 0) {
          this.goodsArray = this.selectGoods
          this.goodsDialogVisible = false
        } else {
          this.$message.error('请点击选择按钮进行选择商品')
        }
      },
      // 取消选择
      cancelSelect() {
        this.goodsName = ''
        this.sku = ''
        this.catId = []
        this.paginationIsHandle = false
        if (this.tempArray.length != 0) {
          this.goodsArray = []
          for (let i = 0; i < this.tempArray.length; i++) {
            this.goodsArray[i] = this.tempArray[i]
            for (let j in this.tempArray[i]) {
              this.goodsArray[i][j] = this.tempArray[i][j]
            }
            this.$set(this.goodsArray, i, this.goodsArray[i])
          }
        } else {
          this.goodsArray = []
        }
        this.goodsDialogVisible = false
      },
      // 保存设置
      saveSetting() {
        // 判断名称
        if (this.couponName == '') {
          this.$message.error('满减券名称不能为空')
          return
        }
        if (this.couponName.length > 50) {
          this.$message.error('满减券名称长度不能超过50')
          return
        }
        // 优惠券发放数量
        if (this.grantNum == '') {
          this.$message.error('满减券发放数量不能为空')
          return
        }
        if (this.grantNum !== '' && !/^[1-9]\d*$/.test(this.grantNum)) {
          this.$message.error('满减券发放数量限制输入正整数')
          return
        }
        // 优惠券发放时间
        if (this.setTime1 == '' || this.setTime2 == '') {
          this.$message.error('满减券发放时间不能为空')
          return
        }
        // 使用有效期
        if (this.validityTime1 == '' || this.validityTime2 == '') {
          this.$message.error('使用有效期不能为空')
          return
        }

        if (this.setTime1 > this.validityTime1) {
          this.$message.error('发放开始时间不能晚于使用有效期的开始时间')
          return
        }
        if (this.setTime2 > this.validityTime2) {
          this.$message.error('发放结束时间不能晚于使用有效期的结束时间')
          return
        }


        // 优惠券使用条件
        if (this.conditionRadio == 0) {
          this.priceThreshold = 0
        } else {
          if (this.priceThreshold == '') {
            this.$message.error('请填写满减券使用条件')
            return
          }
          if (this.priceThreshold !== '' && !/^[0-9]+([.]{1}[0-9]{1,2})*$/.test(this.priceThreshold)) {
            this.$message.error('满减券使用条件只能输入正数(最多两位小数)')
            return
          }
          if (parseFloat(this.priceThreshold) < 0.01) {
            this.$message.error('满减券使用条件不能小于0.01')
            return
          }
        }
        // 优惠券面值
        if (this.priceDiscount == '') {
          this.$message.error('满减券面值不能为空')
          return
        }
        if (this.priceDiscount !== '' && !/^[0-9]+([.]{1}[0-9]{1,2})*$/.test(this.priceDiscount)) {
          this.$message.error('满减券面值只能输入正数(最多两位小数)')
          return
        }
        if (parseFloat(this.priceDiscount) < 0.01) {
          this.$message.error('满减券面值不能小于0.01')
          return
        }
        // 优惠券使用范围
        if (this.rangeType == 1) {
          if (this.sortArray.length == 0) {
            this.$message.error('请添加分类')
            return
          } else {
            this.catIds = ''
            for (let i = 0; i < this.sortArray.length; i++) {
              if (this.sortArray[i].catIds.length == 0) {
                this.$message.error('选择分类不能为空')
                return
              } else {
                this.catIds = this.catIds + ',' + this.sortArray[i].catIds[this.sortArray[i].catIds.length - 1]
              }
            }
            this.catIds = this.catIds.slice(1)
          }
        } else if (this.rangeType == 2) {
          this.goodsIds = ''
          for (let i = 0; i < this.goodsArray.length; i++) {
            if (this.goodsArray[i].status == 1) {
              this.goodsIds = this.goodsIds + ',' + this.goodsArray[i].goodsId
            }
          }
          if (this.goodsIds == '') {
            this.$message.error('请选择商品')
            return
          }
          this.goodsIds = this.goodsIds.slice(1)
        }
        this.fullscreenLoading = true
        let data = {
          token: this.$store.getters.token,
          shopId: this.$store.getters.shopId,
          couponId: this.couponId,
          couponSn: this.couponSn,
          couponType: 0,
          couponName: this.couponName,
          grantNum: this.grantNum,
          receiveNum: 1,
          grantStartTime: parseTime(this.setTime1),
          grantEndTime: parseTime(this.setTime2),
          useStartTime: parseTime(this.validityTime1),
          useEndTime: parseTime(this.validityTime2),
          conditionType: 0,
          priceThreshold: this.priceThreshold,
          priceDiscount: this.priceDiscount,
          rangeType: this.rangeType,
          catIds: this.catIds,
          goodsIds: this.goodsIds
        }
        // 添加编辑满减券
        saveOrEditCoupon(data).then(res => {
          this.fullscreenLoading = false
          this.$message.success('保存成功,将返回优惠券列表!')
          let _this = this
          setTimeout(() => {
            _this.$router.go(-1)
          }, 1000)
        }).catch(() => {
          this.fullscreenLoading = false
          return
        })
      },
      // 分页器部分
      handleSizeChange(value) {
        this.pageSize = value
        this.paginationIsHandle = true
        this.selectGoodsToUseRange()
      },
      handleCurrentChange(value) {
        this.currentPage = value
        this.paginationIsHandle = true
        this.selectGoodsToUseRange()
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .container {
    margin: 20px 30px 0 30px;
    .red {
      color: #ff4949;
    }
    .el-input {
      width: 300px;
    }
    p {
      display: inline-block;
      width: 135px;
      height: 30px;
      text-align: left;
      line-height: 30px;
    }
    .tip-text {
      display: inline-block;
      width: 20px;
      height: 20px;
      text-align: center;
      line-height: 20px;
      border: 1px solid #1c8de0;
      border-radius: 50%;
      color: #1c8de0;
      margin-left: 10px;
      margin-top: 8px;
    }
    .pagination {
      margin: 10px 0;
    }
  }
  .selectGoodsDialog {
    p {
      margin: 0;
    }
    .search {
      text-align: right;
      margin: 14px 0 10px;
      height: 30px;
    }
  }
  .catSelectDialog {
    .catListWrap {
      font-size: 0;
      p {
        width: 100%;
        font-size: 14px;
      }
    }
    .catBox {
      display: inline-block;
      width: 32%;
      height: 400px;
      margin: 0 2% 0 0;
      border: 1px solid #d3dce6;
      &:nth-of-type(3) {
        margin-right: 0;
      }
      ul {
        padding: 10px 20px;
        margin: 0;
        width: 100%;
        height: 100%;
        font-size: 14px;
        overflow: auto;
      }
      li {
        list-style: none;
        line-height: 30px;
        width: 100%;
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &:before {
          content: '> ';
        }
        &.active {
          color: #409EFF;
        }
      }
    }
  }
</style>
<style lang="scss" ref="stylesheet/scss">
  .selectGoodsDialog {
    .el-dialog {
      min-width: 900px;
    }
  }
  .catSelectDialog {
    .el-dialog {
      width: 900px;
    }
    .el-dialog__body {
      padding: 20px 20px 0;
    }
  }
</style>
