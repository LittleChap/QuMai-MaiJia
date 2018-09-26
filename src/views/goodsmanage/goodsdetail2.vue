<template>
  <div class="container" v-loading="mainLoading" :element-loading-text="loadingTxt">
    <el-form action="" ref="form" :model="form" label-position="top" :rules="rules">
      <el-row>
        <el-col :span="6">
          <el-form-item label="全部分类" class="is-required" prop="catIdArr">
            <el-cascader placeholder="全部分类" class="big-input" expand-trigger="hover" :options="goodsCatArray" clearable :props="props" v-model="form.catIdArr"> </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="运费模板" prop="logisticsTemplateId">
            <el-select placeholder="请选择运费模板" v-model="form.logisticsTemplateId" filterable>
              <el-option v-for="item in templateInfos" :key="item.templateId" :label="item.templateName" :value="item.logisticsTemplateId"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品品牌">
            <el-select v-model="form.brandId" filterable clearable  placeholder="请选择">
              <el-option v-for="item in selectInfos" :key="item.brandId" :disabled="item.disabled" :label="item.brandName" :value="item.brandId"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="form.name" :maxlength="50" style="width: 220px;"> </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="自定义增加销量" style="position: relative">
            <div class="custom-title" style="position: absolute; top: -36px;left: 100px;">
              <el-tooltip effect="dark" content="若填写此字段则会在该商品的销量基础上增加所填写的销量" placement="right-start">
                <div class="tip-text">?</div>
              </el-tooltip>
            </div>
            <el-input type="text" :maxlength="50" placeholder="请输入自定义增加销量" v-model="form.buyNumVirtual" style="width: 220px;"
                      @blur="toSetNumber(form.buyNumVirtual, form,'buyNumVirtual', false)"
                      @input="moneyInput(form.buyNumVirtual, form,'buyNumVirtual', false)"> </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="货号">
            <el-input type="text" :maxlength="50" placeholder="请输入货号" v-model="form.sn" style="width: 220px;"> </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="商品简介">
            <el-input type="textarea" :rows="2" :maxlength="50" placeholder="请输入内容" v-model="form.brief" style="width: 220px;"> </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="会员折扣">
            <el-radio :label="1" v-model="form.use_coupon">开启</el-radio>
            <el-radio :label="0" v-model="form.use_coupon">关闭</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="优惠券使用">
            <el-radio :label="1" v-model="form.use_coupon">开启</el-radio>
            <el-radio :label="0" v-model="form.use_coupon">关闭</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 商品规格 -->
      <div class="goods-size">
        <div class="mainTitle is-required">商品规格：</div>
        <el-row :gutter="20" style="margin-right: 0px;">
          <el-col :span="1">
            <el-button @click="toShowSpecDialog" type="text" icon="plus">添加规格</el-button>
          </el-col>
        </el-row>
        <el-table border class="goods specListBox" :data="specArray" style="width: 100%">
          <el-table-column prop="specName" label="商品规格">
            <template scope="scope">{{scope.row.specName}}</template>
          </el-table-column>
          <el-table-column align="center"  prop="sku" label="商品SKU">
            <template scope="scope">
              <div class="el-input el-input--small">
                <input type="text" class="el-input__inner "
                       :class="{'is-error': scope.row.sku==='' }"
                       v-model="scope.row.sku">
              </div>
              <span v-show="scope.row.sku===''" class="error-tip red">必填</span>
              <!--<el-input-->
              <!--class="error-tip"-->
              <!--size="small"-->
              <!--v-model="scope.row.sku"-->
              <!--&gt;</el-input>-->
            </template>
          </el-table-column>
          <el-table-column align="center" prop="price" label="销售价" width="120">
            <template scope="scope">
              <div class="el-input el-input--small">
                <input type="text" class="el-input__inner" v-model="scope.row.price"
                       :class="{'is-error': scope.row.price==='' }"
                       @blur="toSetNumber(scope.row.price, scope.row, 'price', true, true)"
                       @input="moneyInput(scope.row.price, scope.row, 'price', true)">
              </div>
              <span v-show="scope.row.price===''" class="error-tip red">必填</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="orignPrice" label="原价" width="120">
            <template scope="scope">
              <div class="el-input el-input--small">
                <input type="text" class="el-input__inner" v-model="scope.row.orignPrice"
                       @blur="toSetNumber(scope.row.orignPrice, scope.row, 'orignPrice', true)"
                       @input="moneyInput(scope.row.orignPrice, scope.row, 'orignPrice', true)">
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="store" label="库存" width="120">
            <template scope="scope">
              <div class="el-input el-input--small">
                <input type="text" class="el-input__inner" v-model="scope.row.store"
                       :class="{'is-error': scope.row.store==='' }"
                       @blur="toSetNumber(scope.row.store, scope.row, 'store', false)"
                       @input="moneyInput(scope.row.store, scope.row, 'store', false)">
              </div>
              <span v-show="scope.row.store===''" class="error-tip red">必填</span>
            </template>
          </el-table-column>
          <el-table-column align="center" width="120" label="重量（kg）">
            <template scope="scope">
              <!--<el-input size="small" v-model="scope.row.weight"></el-input>-->
              <div class="el-input el-input--small">
                <input type="text" class="el-input__inner" v-model="scope.row.weight"
                       :class="{'is-error': scope.row.weight==='' }"
                       @blur="toSetNumber(scope.row.weight, scope.row, 'weight', true)"
                       @input="moneyInput(scope.row.weight, scope.row, 'weight', true)">
              </div>
              <span v-show="scope.row.weight===''" class="error-tip red">必填</span>
            </template>
          </el-table-column>
          <el-table-column align="center" width="120" label="体积（m³）">
            <template scope="scope">
              <div class="el-input el-input--small">
                <input type="text" class="el-input__inner" v-model="scope.row.volume"
                       :class="{'is-error': scope.row.volume==='' }"
                       @blur="toSetNumber(scope.row.volume, scope.row, 'volume', true)"
                       @input="moneyInput(scope.row.volume, scope.row, 'volume', true)">
              </div>
              <span v-show="scope.row.volume===''" class="error-tip red">必填</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="sale" width="100" label="销量"> </el-table-column>
          <el-table-column align="center" prop="state" label="操作" width="100">
            <template scope="scope">
              <el-button @click.native.prevent="delGoodsSize(scope.$index)" icon="delete" size="small"> 删除 </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 商品属性 -->
      <div class="goods-size">
        <div class="mainTitle">商品属性:</div>
        <el-row :gutter="20" style="margin-right: 0px;">
          <el-col :span="1">
            <el-button @click="addGoodsAttr" type="text" icon="plus">添加属性</el-button>
          </el-col>
        </el-row>
        <el-table border class="goods" :data="propertyArray" style="width: 100%">
          <el-table-column align="center" prop="propertyKey" label="属性名" width="250">
            <template scope="scope">
              <el-input size="small" v-model="scope.row.propertyKey" > </el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="propertyValue" label="属性值">
            <template scope="scope">
              <el-input size="small" v-model="scope.row.propertyValue" > </el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="state" label="操作" width="200">
            <template scope="scope">
              <el-button @click.native.prevent="delGoodsAttr(scope.$index)" icon="delete" size="small"> 删除 </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="goods-image">
        <div class="mainTitle is-required">商品主图：（支持 JPG、PNG、GIF格式，最多5张，5MB以内，建议尺寸750*750，首张图片为商品主图。）</div>
        <!--:http-request="uploadImage"-->
        <el-upload
           :class="{'hideAddBtn': imageList.length >=5}"
           action="/backend/mobileUpload/uploadImg.do"
           list-type="picture-card"
           :data="upLoadObj"
           :name="fileType"
           :on-preview="handlePictureCardPreview"
           :on-remove="handleRemove"
           :on-success="handSuccess"
           :before-upload="beforeUpload"
           show-file-list
           :file-list="imageList"
           :http-request="uploadImage"
           multiple
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog v-model="dialogVisible" size="tiny">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </div>
      <div class="goods-desc">
        <div class="mainTitle is-required">商品描述：</div>
        <div>
          <el-form-item prop="detail">
            <Tinymce :height=500 ref="editor" v-model="form.detail"></Tinymce>
          </el-form-item>
        </div>
      </div>
      <div class="btns">
        <el-button type="primary" size="larget" @click="submitForm(1)">提交并上架</el-button>
        <el-button type="primary" size="larget" @click="submitForm(0)">提交并下架</el-button>
        <el-button type="primary" size="larget" @click="returnGoodsList">返回</el-button>
      </div>
    </el-form>
    <el-dialog class="dialogSpecSelect" title="请选择规格" :show-close="false" :visible.sync="dialogSpec">
      <div class="dialogSpecContent" v-loading="specDialogLoading">
        <div class="specMainBox">
          <p class="title">请选择规格【可多选】</p>
          <ul>
            <li class="itemBox" v-for="(spec, index) in specInfoList" :key="index">
              <p class="item" v-show="specInfoSetting.currentChangeMainSpec != index"
                 :class="{'active': specInfoSetting.selectMainSpec == index }">
                <span @click="toSelectShowMianSpec(index)">{{spec.specValue}}（{{spec.checkedNum}}）</span>
                <i class="icon el-icon-edit" @click="toShowChangeMainSpec(index)"></i>
              </p>
              <el-input
                 v-if="specInfoSetting.currentChangeMainSpec == index"
                 v-model="specInfoSetting.changeMainSpecText"
                 v-focus
                 class="item-input"
                 @keyup.enter.native="toEditMainSpec(index)"
                 @blur="toEditMainSpec(index)"
                 size="small"
              ></el-input>
              <i class="icon el-icon-circle-close" @click="toDeleteMainSpec(index)"></i>
            </li>
            <li class="itemBox">
              <el-button size="small" v-show="!specInfoSetting.isAddMainSpec" @click="toShowAddMainSpec">添加规格类型
              </el-button>
              <p v-if="specInfoSetting.isAddMainSpec">
                <el-input
                   v-model="specInfoSetting.addMainSpecText"
                   class="item-input"
                   v-focus
                   @keyup.enter.native="toAddMainSpec"
                   @blur="toAddMainSpec"
                   size="small"></el-input>
                <i class="icon el-icon-circle-close" @click="toCancelAddMainSpec"></i>
              </p>
            </li>
          </ul>
        </div>
        <div class="specItemBox">
          <p class="title">请选择规格属性【可多选】</p>
          <ul>
            <li class="itemBox" v-if="specInfoList.length">
              <el-checkbox v-model="specInfoSetting.isSelectAll" @change="toSelectSpecItemAll">全选</el-checkbox>
              <div class="itemGroup" v-loading="specDialogItemLoading">
                <el-tag
                   v-for="(specItem, index) in specInfoList[specInfoSetting.selectMainSpec].specItemList"
                   type="primary"
                   key="tag"
                   :class="{'active':specItem.isChecked}"
                   :closable="true"
                   @close="toDeleteSpecItem(index)"
                   :close-transition="false">
                  <span @click="toSelectSpecItemActive(specItem)">{{specItem.specItemValue}}</span>
                </el-tag>
                <el-input
                   v-if="specInfoSetting.isAddSpecItem"
                   style="width: 80px;"
                   v-focus
                   v-model="specInfoSetting.addSpecItemText"
                   @keyup.enter.native="toAddSpecItem"
                   @blur="toAddSpecItem"
                   size="mini">
                </el-input>
                <el-button size="mini" v-show="!specInfoSetting.isAddSpecItem" @click="toShowAddSpecItem">+
                  自定义{{specInfoList[specInfoSetting.selectMainSpec].specValue}}
                </el-button>
                <!--<el-button size="mini">确定</el-button>-->
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="toCancelCreateSpec">取 消</el-button>
        <el-button type="primary" @click="toCreateSpec">生 成</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import lrz from 'lrz'
  import Tinymce from '@/components/Tinymce'
  import {
    getGoodsDetail,
    getGoods, getBrand, saveOrEditGoods, uploadImg, getAllGoodsCatList,
    getSpecList, saveOrEditSpec, deleteSpec, getSpecItemList, saveSpecItem, deleteSpecItem, createSpec
  } from '@/api/goodslist'
  import {listLogisticsTemplate} from '@/api/freight'

  export default {
    components: {
      Tinymce
    },
    data() {
      let validatePass = (rule, value, callback) => {
        if (!value || !value.length) {
          callback(new Error('请选择全部分类'))
        } else {
          callback()
        }
      }
      return {
        goodsId: (Number(this.$route.query.id) > -1 ? this.$route.query.id : ''),
        mainLoading: false,
        loadingTxt: '拼命加载中..',
        form: {
          name: '',
          brief: '',
          brandId: '',
          detail: '',
          catIdArr: [], // 分类id集合
          catId: '',
          logisticsTemplateId: '',
          buyNumVirtual: 0,
          sn: '',
          use_coupon: 1, // 是否使用优惠券  0否   1是
          open_member_discount: 1, // 会员开启折扣  0否   1是
        },
        // form表单验证规则
        rules: {
          catIdArr: [{ validator: validatePass, trigger: 'change' }],
          logisticsTemplateId: [ {required: true, message: '请选择运费模板', trigger: 'change'} ],
          name: [ {required: true, message: '请输入商品名称', trigger: 'blur'} ],
        },
        // 品牌选项的传参
        selectInfos: [],
        // 运费模板的传参
        templateInfos: [],
        // 商品分类
        goodsCatArray: [],
        props: {
          value: 'catId',
          label: 'catName',
          children: 'childrenGoodsCatArray'
        },
        // 上传照片的参数
        imageIndex: 0,
        imageList: [],
        // radio: 0,
        // templateId: '',
        propertyArray: [], // 商品属性
        galleryArray: [],
        dialogImageUrl: '',
        dialogVisible: false,
        isPutaway: '',
        imageFile: '',
        isSave: true,
        upLoadObj: {
          'from': 'goods'
        },
        fileType: 'file',
        goodsStore: 0,
        // 规格的数据--start
        dialogSpec: false,   // 规格弹窗
        specArray: [], // 规格列表
        specDialogLoading: false,
        specDialogItemLoading: false,
        oldSpecInfoList: [],  // 这个是点击添加规格之前保存的规格数据
        specInfoList: [],  // 规格信息   specItemList: [], // 规格属性
        specInfoSetting: {  // 规格信息的操作
          isAddMainSpec: false, // 是否新增
          addMainSpecText: '',  // 新增的规格名
          changeMainSpecText: '',    // 修改为的规格名
          currentChangeMainSpec: -1,  // 当前修改的规格的index
          isCommitting: false, // 是否在提交中
          selectMainSpec: 0,  // 当前选择的规格  --> 去展示规格属性
          isAddSpecItem: false, // 是否新增规格属性
          addSpecItemText: '',  // 新增的规格属性名
          isCommittingSpecItem: false, // 是否在提交规格属性中
          specInfoArray: [],   //规格项的集合
          isSelectAll: false  // 是否全选
        }
        // 规格的数据--end
      }
    },
    directives: {
      focus: { //  自定义指令 v-focus
        inserted(el) {
          el.children[0].focus()
        }
      }
    },
    created() {
      // 对运费模板的获取
      let data = {
        token: this.$store.getters.token,
        shopId: this.$store.getters.shopId
      }
      // 获得运费列表
      this.getTemplate()
      // 品牌数据的获取
      this.getBrandList()
      // 获得商品分类
      this.getCatList()

      // 商品详情的获取 如果是添加商品 传进来的是‘0’
      if (this.goodsId) {
        this.getDetail()
        // 获得规格的数据
        this.getSpecList()
        /*let data = {
          token: this.$store.getters.token,
          shopId: this.$store.getters.shopId,
          goodsId: goodsId
        }
        getGoodsDetail(data).then((res) => {
          // 商品分类的获取
          this.getGoods()
          // 商品分类的回显
          this.form.catId = []
          for (let i = 0; i < res.goodsjson.catIdArray.length; i++) {
            this.form.catId.push(res.goodsjson.catIdArray[i])
          }
          this.form.name = res.goodsjson.name
          this.form.brief = res.goodsjson.brief
          this.form.sn = res.goodsjson.sn || ''
          this.form.brandId = res.goodsjson.brandId
          this.form.detail = res.goodsjson.detail || ''
          this.form.logisticsTemplateId = res.goodsjson.logisticsTemplateId
          this.form.buyNumVirtual = res.goodsjson.buyNumVirtual
          this.form.buyNumVirtual = res.goodsjson.buyNumVirtual
          this.form.buyNumVirtual = res.goodsjson.buyNumVirtual
          this.galleryArray = res.goodsjson.galleryArray
          res.goodsjson.specArray.map(specItem => {
            if (specItem.specIdAndItemIdArray) {
              delete specItem.specIdAndItemIdArray
            }
          })
          this.specArray = res.goodsjson.specArray
          // 属性处理
          if (res.goodsjson.propertyArray == undefined) {
            this.propertyArray = []
          } else {
            this.propertyArray = res.goodsjson.propertyArray
          }
          // if (this.specArray[0].isPromotion == 0) {
          //   this.radio = 0
          //   for (let i = 0; i < this.specArray.length; i++) {
          //     this.specArray[i].promotionPrice = ''
          //   }
          // }
          for (let i = 0; i < this.galleryArray.length; i++) {
            let arr = {
              name: `主图${i + 1}`,
              url: this.galleryArray[i].imageOriginal
            }
            this.imageList.push(arr)
          }
        }).catch(() => {
          this.fullscreenLoading = false
        })*/
      }
    },
    methods: {
      // 获得详情
      async getDetail () {
        let reqData = {
          token: this.$store.getters.token,
          shopId: this.$store.getters.shopId,
          goodsId: this.goodsId
        }
        this.mainLoading = true
        let res = await this.$post('mobileSellerGoods/getGoodsDetail.do', reqData)
        this.mainLoading = false
        console.log('结果啦啦啦' ,res)
        if (parseInt(res.code) === 1) {
          // 商品分类的回显
          this.form.catIdArr = []
          this.form.catId = res.goodsjson.catId
          res.goodsjson.catIdArray.map(item => {
            this.form.catIdArr.push(item)
          })
          this.form.name = res.goodsjson.name
          this.form.brief = res.goodsjson.brief
          this.form.sn = res.goodsjson.sn || ''
          this.form.brandId = res.goodsjson.brandId
          this.form.detail = res.goodsjson.detail || ''
          this.form.logisticsTemplateId = res.goodsjson.logisticsTemplateId
          this.form.buyNumVirtual = res.goodsjson.buyNumVirtual
          this.form.buyNumVirtual = res.goodsjson.buyNumVirtual
          this.form.buyNumVirtual = res.goodsjson.buyNumVirtual
          this.galleryArray = res.goodsjson.galleryArray
          res.goodsjson.specArray.map(specItem => {
            if (specItem.specIdAndItemIdArray) {
              delete specItem.specIdAndItemIdArray
            }
          })
          this.specArray = res.goodsjson.specArray
          // 属性处理
          if (res.goodsjson.propertyArray == undefined) {
            this.propertyArray = []
          } else {
            this.propertyArray = res.goodsjson.propertyArray
          }
          // if (this.specArray[0].isPromotion == 0) {
          //   this.radio = 0
          //   for (let i = 0; i < this.specArray.length; i++) {
          //     this.specArray[i].promotionPrice = ''
          //   }
          // }
          for (let i = 0; i < this.galleryArray.length; i++) {
            let arr = {
              name: `主图${i + 1}`,
              url: this.galleryArray[i].imageOriginal
            }
            this.imageList.push(arr)
          }

        }

      },
      // 获得运费模板
      async getTemplate () {
        let reqData = {
          token: this.$store.getters.token,
          shopId: this.$store.getters.shopId
        }
        let res = await this.$post('mobileSellerLogistics/listLogisticsTemplate.do', reqData)
        if (parseInt(res.code) === 1) {
          this.templateInfos = res.logisticsTemplateArray
        }
      },
      // 获得品牌列表
      async getBrandList () {
        let reqData = {
          token: this.$store.getters.token,
          shopId: this.$store.getters.shopId
        }
        let res = await this.$post('mobileSellerBrand/getBrandList.do', reqData)
        if (parseInt(res.code) === 1) {
          this.selectInfos = res.brandArray
        }
      },
      // 获取商品分类列表
      async getCatList() {
        let reqData = {
          token: this.$store.getters.token,
          shopId: this.$store.getters.shopId
        }
        let res = await this.$post('mobileSellerGoodsCat/getAllGoodsCatList.do', reqData)
        console.log('结果啦啦啦' ,res)
        if (parseInt(res.code) === 1) {
          res.goodsCatArray.map(firstCat => {
            if (firstCat.childrenGoodsCatArray && firstCat.childrenGoodsCatArray.length) {  // 有二级
              firstCat.childrenGoodsCatArray.map(secondCat => {
                if (!secondCat.childrenGoodsCatArray || !secondCat.childrenGoodsCatArray.length) {
                  secondCat.disabled = true
                }
              })
            } else {
              firstCat.disabled = true
            }
          })
          this.goodsCatArray = res.goodsCatArray
        }
      },
      // 金额 和 重量的数字控制
      moneyInput(value, item, itemName, isMoney) {
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
        item[itemName] = 'bbbbbbbbbbbbbbbbbbbbbb'
        this.$nextTick(() => {
          item[itemName] = value + ''
        })
      },
      // 金额 和 重量  默认为0
      toSetNumber(value, item, itemName, isMoney, isCompare) {
        if (value !== '') {
          item[itemName] = parseFloat(value)
        }

        // if (isMoney) {
        //   if (value !== '' || value < 0.01) {
        //     item[itemName] = 0.01
        //   }
        // }
        // else {
        //   if (value === '') {
        //     item[itemName] = 0
        //   }
        // }
      },

      // 上传图片
      uploadImage() {
        let name = this.imageFile.name;
        let uid = this.imageFile.uid;
        this.imageList.push({
          name: name,
          url: this.imageIndex,
          uid: this.imageFile.uid
        });
        this.imageIndex++;
        lrz(this.imageFile).then((res) => {
          let index = this.imageIndex;
          for (let num = 0; num < this.imageList.length; num++) {
            if (uid == this.imageList[num].uid) {
              index = num;
              break;
            }
          }
          this.imageFile = res.base64
          let data = {
            base64ImgStr: this.imageFile.split(',')[1],
            from: 'goods'
          }

          this.$http.post('/backend/mobileUpload/uploadImg4Base64Str.do', data).then(res => {
            if (res.body.code === '1') {
              let arr = {
                name: name,
                url: res.body.data.url
              }
//                            this.imageList.push(arr)
              this.imageList.splice(index, 1, arr);
//                            this.imageIndex++
            } else {
              this.$message.error(res.body.message);
              this.imageList.splice(index, 1);
              this.imageIndex--;
            }
          })
        }).catch((err) => {
          return
        })
      },
      beforeUpload(file) {
        this.imageFile = file
        const isJPG = file.type === 'image/jpeg'
        const isPNG = file.type === 'image/png'
        const isGIF = file.type === 'image/gif'
        const isLt2M = file.size / 1024 / 1024 < 5

        if (!isJPG && !isPNG && !isGIF) {
          this.$message.error('上传头像图片只能是 png/jpg/gif 格式!');
          return false
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 5MB!');
          return false
        }
        if (this.imageList.length >= 5) {
          this.$message.error('商品主图只能最多只能上传5张');
          return false
        }
        for (let i = 0; i < this.imageList.length; i++) {
          let name = this.imageList[i].name
          if (file.name == name) {
            this.$message.error('图片已在列表，请勿重复上传');
            return false
          }
        }
      },
      handSuccess(res, file, fileList) {
        this.imageList = fileList
        this.imageIndex++
      },
      handleRemove(file, fileList) {
        this.imageList = fileList
        this.imageIndex--
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },


      // 规格部分--start
      // 显示规格弹窗
      toShowSpecDialog() {
        this.dialogSpec = true
      },
      // 获得规格名
      getSpecList() {
        let reqData = {
          token: this.$store.getters.token,
          shopId: this.$store.getters.shopId,
          goodsId: (this.$route.query.id > -1 ? this.$route.query.id : '')
        }
        this.specDialogLoading = true
        getSpecList(reqData).then(res => {
          if (res.specArray.length) {
            this.oldSpecInfoList = JSON.parse(JSON.stringify(res.specArray))
            this.specInfoList = res.specArray
          }

          this.specDialogLoading = false
        }).catch(() => {
          this.specDialogLoading = false
        })
      },
      // 修改或新增规格
      editMainSpec(index) {
        if (index === -1) {  // 新增
          this.specInfoList.push({
            specId: -1,
            specValue: this.specInfoSetting.addMainSpecText,
            checkedNum: 0,
            specItemList: []
          })
          this.specInfoSetting.isAddMainSpec = false
        } else { // 修改
          let newSpec = this.specInfoList[index]
          newSpec.specValue = this.specInfoSetting.changeMainSpecText
          this.specInfoList.splice(index, 1, newSpec)
        }
        this.specInfoSetting.changeMainSpecText = ''
        this.specInfoSetting.addMainSpecText = ''
        this.specInfoSetting.currentChangeMainSpec = -1
      },
      // 显示添加规格
      toShowAddMainSpec() {
        this.specInfoSetting.addMainSpecText = ''
        this.specInfoSetting.isAddMainSpec = true
      },
      // 显示修改规格
      toShowChangeMainSpec(index) {
        this.specInfoSetting.changeMainSpecText = this.specInfoList[index].specValue
        this.specInfoSetting.currentChangeMainSpec = index
      },
      // 添加规格
      toAddMainSpec() {
        if (this.specInfoSetting.addMainSpecText == '') {
          this.specInfoSetting.isAddMainSpec = false
          return false
        }
        if (this.IsSameSpecName(this.specInfoSetting.addMainSpecText, -1)) {  // 有相同的名称
          this.$message.error('规格名称不能重复！')
          return false
        }
        // 保存新增
        this.editMainSpec(-1)
      },
      // 修改规格名
      toEditMainSpec(index) {
        if (this.specInfoSetting.changeMainSpecText == '') {  // 不保存
          this.specInfoSetting.currentChangeMainSpec = -1
          return false
        }
        if (this.specInfoSetting.changeMainSpecText == this.specInfoList[index].specValue) { // 名称没有修改
          this.specInfoSetting.currentChangeMainSpec = -1
          return false
        }
        if (this.IsSameSpecName(this.specInfoSetting.changeMainSpecText, index)) {  // 有相同的名称
          this.$message.error('规格名称不能重复！')
          return false
        }

        this.specInfoSetting.currentChangeMainSpec = index
        this.editMainSpec(index)
      },
      // 删除规格名
      toDeleteMainSpec(index) {
        this.specInfoList.splice(index, 1)
      },
      // 取消添加新的规格
      toCancelAddMainSpec() {
        this.specInfoSetting.isAddMainSpec = false
        this.specInfoSetting.addMainSpecText = ''
      },
      // 当前选择的规格
      toSelectShowMianSpec(index) {
        this.specInfoSetting.selectMainSpec = index
      },
      // 显示添加规格属性
      toShowAddSpecItem() {
        this.specInfoSetting.addSpecItemText = ''
        this.specInfoSetting.isAddSpecItem = true
      },
      // 添加规格属性
      toAddSpecItem() {
        if (this.specInfoSetting.addSpecItemText == '') {
          this.specInfoSetting.isAddSpecItem = false
          return false
        }
        if (this.IsSameSpecName(this.specInfoSetting.addSpecItemText, this.specInfoSetting.selectMainSpec, -1)) {  // 有相同的名称
          this.$message.error('规格属性名称不能重复！')
          return false
        }
        this.specInfoList[this.specInfoSetting.selectMainSpec].specItemList.push({
          specItemId: -1,
          specItemValue: this.specInfoSetting.addSpecItemText,
          isChecked: true
        })
        this.specInfoList[this.specInfoSetting.selectMainSpec].checkedNum++
        if (this.specInfoList[this.specInfoSetting.selectMainSpec].checkedNum > this.specInfoList[this.specInfoSetting.selectMainSpec].specItemList.length) {
          this.specInfoList[this.specInfoSetting.selectMainSpec].checkedNum = this.specInfoList[this.specInfoSetting.selectMainSpec].specItemList.length
        }
        this.specInfoSetting.isAddSpecItem = false
        this.specInfoSetting.addSpecItemText = ''
      },
      // 删除规格属性
      toDeleteSpecItem(index) {
        let newItemArray = this.specInfoList[this.specInfoSetting.selectMainSpec]
        if (newItemArray.specItemList[index].isChecked) {
          newItemArray.checkedNum--
        }
        newItemArray.specItemList.splice(index, 1)
        this.specInfoList.splice(this.specInfoSetting.selectMainSpec, 1, newItemArray)
      },
      // 选择 规格属性  -- > 选中
      toSelectSpecItemActive(specItem) {
        if (specItem.isChecked) {
          specItem.isChecked = false
          this.specInfoList[this.specInfoSetting.selectMainSpec].checkedNum--
        } else {
          specItem.isChecked = true
          this.specInfoList[this.specInfoSetting.selectMainSpec].checkedNum++
        }
      },
      // 全选
      toSelectSpecItemAll() {
        let checked = this.specInfoSetting.isSelectAll
        let data = this.specInfoList[this.specInfoSetting.selectMainSpec].specItemList
        for (let i = 0; i < data.length; i++) {
          this.specInfoList[this.specInfoSetting.selectMainSpec].specItemList[i].isChecked = checked
        }
        if (checked) {
          this.specInfoList[this.specInfoSetting.selectMainSpec].checkedNum = data.length
        } else {
          this.specInfoList[this.specInfoSetting.selectMainSpec].checkedNum = 0
        }

//        this.specInfoList[this.specInfoSetting.selectMainSpec]
      },
      // 生成规格
      toCreateSpec() {
        if (!this.specInfoList.length) {
          this.$message.error('请先选择规格和规格属性');
          return false
        }
        let specMainArray = []  // 每种规格对应的规格和规格项的组合
        this.specInfoList.map((spec) => {
          if (spec.checkedNum > 0) {
            let specItemArray = []
            spec.specItemList.map((specItem) => {
              if (specItem.isChecked) {
                specItemArray.push({
                  specId: spec.specId,
                  specValue: spec.specValue,
                  specItemId: specItem.specItemId,
                  specItemValue: specItem.specItemValue
                })
              }
            })
            specMainArray.push(specItemArray)
          }
        })
        if (!specMainArray.length) {
          this.$message.error('请先选择规格和规格属性');
          return false
        }
        specMainArray = this.descartes(specMainArray)
        let oldSpec = []
        oldSpec = oldSpec.concat(this.specArray)
        this.specArray = [] // 先保存旧的规格 + 新增的规格
        let newSpecList = []  // 新增的规格
        specMainArray.map(specBox => {  // 组合规格名称
          let specItem = {specName: ''}
          specBox.map(spec => {
            specItem.specName += `${spec.specValue}:${spec.specItemValue};`
          })
          if (specItem.specName.length) {
            specItem.specName = specItem.specName.substring(0, specItem.specName.length - 1)
            let isSame = false
            let newItem = {}
            // 判断是否有相同的规格名
            oldSpec.map((oldSpecItem) => {
              if (oldSpecItem.specName == specItem.specName) {
                isSame = true
                newItem = oldSpecItem
                if (oldSpecItem.specIdAndItemIdArray) {
                  delete oldSpecItem.specIdAndItemIdArray
                }
                newItem = oldSpecItem
              }
            })
            if (!isSame) {
              newItem = {
                specName: specItem.specName,
                sku: '',
                price: 0.01,
                orignPrice: '',
                // promotionPrice: this.radio == 0 ? '' : 0.01,
                store: 0,
                limitNum: 0,
                weight: 0,
                volume: 0,
                // isPromotion: this.radio == 0 ? 0 : 1
              }
              newSpecList.push(newItem)
            } else {
              this.specArray.push(newItem)
            }
          }
        })
        this.specArray = this.specArray.concat(newSpecList)
        this.dialogSpec = false
        this.oldSpecInfoList = JSON.parse(JSON.stringify(this.specInfoList))
      },
      // 取消生成规格
      toCancelCreateSpec() {
        this.specInfoSetting.selectMainSpec = 0
        this.specInfoList = JSON.parse(JSON.stringify(this.oldSpecInfoList))
        this.dialogSpec = false
      },
      // 判断规格名称是否有一样的
      IsSameSpecName(specValue, specIndex, specItemIndex) {
        let isSame = false
        if (specItemIndex) {  // 这是规格属性名的判断
          for (let i = 0; i < this.specInfoList[specIndex].specItemList.length; i++) {
            if (this.specInfoList[specIndex].specItemList[i].specItemValue == specValue) {
              isSame = true
              return true
            }
          }
        } else {  // 规格名的判断
          for (let i = 0; i < this.specInfoList.length; i++) {
            if (i != specIndex && this.specInfoList[i].specValue == specValue) {
              isSame = true
              return true
            }
          }
        }
        if (!isSame) {
          return false
        }
      },

      //笛卡儿积组合  ---> 计算规格集合
      descartes(list) {
        let point = {};
        let result = [];
        let pIndex = null;
        let tempCount = 0;
        let temp = [];
        for (var index in list) {
          if (typeof list[index] == 'object') {
            point[index] = {
              'parent': pIndex,
              'count': 0
            }
            pIndex = index;
          }
        }
        if (pIndex == null) {
          return list;
        }
        while (true) {
          for (var index in list) {
            tempCount = point[index]['count'];
            temp.push(list[index][tempCount]);
          }
          result.push(temp);
          temp = [];
          while (true) {
            if (point[index]['count'] + 1 >= list[index].length) {
              point[index]['count'] = 0;
              pIndex = point[index]['parent'];
              if (pIndex == null) {
                return result;
              }
              index = pIndex;
            } else {
              point[index]['count']++;
              break;
            }
          }
        }
      },

      // 删除商品规格
      delGoodsSize(index) {
        this.$confirm('是否删除该商品', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.specArray.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        });
      },
      // 规格---end

      // 添加商品属性
      addGoodsAttr() {
        this.propertyArray.push({
          propertyKey: '',
          propertyValue: ''
        })
      },
      // 删除商品属性
      delGoodsAttr(index) {
        this.$confirm('是否删除该商品', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.propertyArray.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        });
      },

      // 添加编辑商品
      addAndPutGoods() {
        if (this.form.catId.length == 0) {
          this.$message.error('请至少选择一项商品分类')
          return
        }
        if (this.form.logisticsTemplateId == '') {
          this.$message.error('请至少选择一项运费模板')
          return
        }
        if (this.form.brief.length > 50) {
          this.$message.error('简介最多只能输入50个字')
          return
        }
        if (this.form.sn.length > 50) {
          this.$message.error('货号最多只能输入50个字')
          return
        }
        if (this.form.detail == '<p><br data-mce-bogus="1"></p>' || this.form.detail == "" || !this.form.detail) {
          this.$message.error('请填写商品描述')
          return
        }
        if (this.specArray.length == 0) {
          this.$message.error('请添加商品规格')
          return
        } else {
          this.goodsStore = 0
          // 对商品规则里面的元素进行判断
          for (let i = 0; i < this.specArray.length; i++) {
            let item = this.specArray[i]
            if (item.sku === '') {
              this.$message.error('商品SKU不能为空')
              return
            }
            // 销售价限制
            if (item.price === '') {
              this.$message.error('销售价不能为空')
              return
            }
            if (parseFloat(item.price) < 0.01 || parseFloat(item.price) > 100000000) {
              this.$message.error('销售价不能小于0.01,不能大于100000000')
              return
            }
            if (item.price !== '' && !/^[0-9]+([.]{1}[0-9]{1,2})*$/.test(item.price)) {
              this.$message.error('销售价最多只能填两位小数')
              return
            }
            if (item.orignPrice !== '' && parseFloat(item.orignPrice) < 0.01 || parseFloat(item.orignPrice) > 100000000) {
              this.$message.error('原价不能小于0.01,不能大于100000000')
              return
            }
            if (item.orignPrice !== '' && !/^[0-9]+([.]{1}[0-9]{1,2})*$/.test(item.orignPrice)) {
              this.$message.error('原价最多只能填两位小数')
              return
            }
            // // 优惠价限制
            // if (item.promotionPrice === '' && this.isDiscounts == false) {
            //   this.$message.error('商品优惠价不能为空')
            //   return
            // }
            // if (parseFloat(item.promotionPrice) < 0.01 || parseFloat(item.promotionPrice) > 100000000) {
            //   this.$message.error('商品优惠价不能小于0.01,不能大于100000000')
            //   return
            // }
            // if (item.promotionPrice !== '' && !/^[0-9]+([.]{1}[0-9]{1,2})*$/.test(item.promotionPrice) && this.isDiscounts == false) {
            //   this.$message.error('商品优惠价最多只能填两位小数')
            //   return
            // }
            //
            // if (item.price <= item.promotionPrice) {
            //   this.$message.error('优惠价必须小于销售价')
            //   return
            // }
            if (item.weight === '') {
              this.$message.error('重量不能为空')
              return
            }
            if (item.volume === '') {
              this.$message.error('体积不能为空')
              return
            }

            if (item.store === '') {
              this.$message.error('商品库存不能为空，请填写正整数')
              return
            // } else {
            //   this.goodsStore += parseInt(item.store)
            }
//                        if (item.store == 0) {
//                            this.$message.error('商品库存不能为0')
//                            return
//                        }
          }
        }
        // 判断库存
        // if (this.goodsStore == 0) {
        //   this.$message.error('商品总库存不能为0')
        //   return
        // }
        // 判断图片部分
        if (this.imageList.length <= 5 && this.imageList.length > 0) {
          this.galleryArray = []
          let arr
          for (let i = 0; i < this.imageList.length; i++) {
            if (this.imageList[i].response != undefined) {
              arr = {
                imageOriginal: this.imageList[i].response.url,
                sort: i + 1
              }
            } else {
              arr = {
                imageOriginal: this.imageList[i].url,
                sort: i + 1
              }
            }
            this.galleryArray.push(arr)
          }
        } else {
          this.$message.error('必须选择商品主图, 最多5张并且不重复')
          return
        }
        // 判断form表单里面的规则
        this.$refs.form.validate((valid) => {
          if (valid) {
            // 限制重复提交
            this.isSave = false
            this.loadingTxt = "努力提交中.."
            this.mainLoading = true
            // 取出商品分类的最后一级Id
            let data = {
              token: this.$store.getters.token,
              shopId: this.$store.getters.shopId,
              goodsType: 0,
              catId: this.form.catId[this.form.catId.length - 1],
              logisticsTemplateId: this.form.logisticsTemplateId,
              name: this.form.name,
              brief: this.form.brief || '',
              sn: this.form.sn || '',
              buyNumVirtual: this.form.buyNumVirtual,
              brandId: this.form.brandId || '',
              detail: this.form.detail,
              isPutaway: this.isPutaway,
              specArrayStr: JSON.stringify(this.specArray),
              propertyArrayStr: JSON.stringify(this.propertyArray),
              galleryArrayStr: JSON.stringify(this.galleryArray),
              goodsId: (this.$route.query.id > -1 ? this.$route.query.id : ''),
              specAndSpecItemStr: JSON.stringify(this.oldSpecInfoList)
            }

            this.$http.post('/backend/mobileSellerGoods/saveOrEditGoods.do', data).then(res => {
              if (res.body.code == 1) {
                this.isSave = true
                this.mainLoading = false
                this.$message.success('提交成功，将返回商品列表')
                setTimeout(() => {
                  this.$router.push({path: '/goodsmanage/goodslist'})
                }, 1000)
              } else {
                this.isSave = true
                this.mainLoading = false
                this.$message.error(res.body.message)
              }
            }).catch(() => {
              this.isSave = true
              this.mainLoading = false
              return
            })
          } else {
            this.$message.error('请按要求输入商品名称')
          }
        });
      },
      // 提交并上架商品或下架
      submitForm(index) {
        if (index == 1) {
          this.isPutaway = 1
        } else {
          this.isPutaway = 0
        }
        if (this.isSave) {
          this.addAndPutGoods()
        } else {
          this.$message.error('请勿重复提交')
        }
      },
      // 返回列表
      returnGoodsList() {
        this.$confirm('确定放弃编辑商品吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({path: '/goodsmanage/goodslist'})
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '继续编辑'
          });
        });
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .red {
    display: block;
    color: #ff4949;
    line-height: 20px;
    font-size: 12px;
    text-align: left;
  }
  .container {
    padding: 20px 30px;
    min-width: 1224px;
  }
  .mainTitle{
    margin-bottom: 10px;
    font-size: 14px;
    color: #48576a;
    &.is-required:before {
      content: '*';
      color: #ff4949;
      margin-right: 4px;
    }
  }
  .title {
    margin-bottom: 20px;
  }
  .specListBox {
    .is-error {
      margin-top: 10px;
      input {
        border-color: #ff4949 !important;
      }
      border-color: #ff4949;
    }
  }
  .custom-title {
    height: 36px;
    div {
      float: left;
      line-height: 36px;
    }
    .tip-text {
      float: left;
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
  }
  .goods-size {
    margin-top: 50px;
    .discount {
      height: 30px;
      .el-radio-group {
        float: left;
      }
      .tip-text {
        float: left;
        width: 20px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        border: 1px solid #1c8de0;
        border-radius: 50%;
        color: #1c8de0;
        margin-left: 20px;
      }
    }
    .row {
      .el-row {
        margin-top: 1px;
      }
    }
    .el-row {
      height: 50px;
      border: 1px solid #dfe6ec;
      border-bottom: none;
      margin: 0px !important;
      .title {
        margin-bottom: 20px;
      }
      div {
        text-align: center;
        line-height: 50px;
      }
    }
  }
  .goods-image {
    margin-top: 40px;
    .title {
      margin-bottom: 20px;
    }
  }
  .goods-desc {
    margin-top: 40px;
    .title {
      margin-bottom: 20px;
    }
  }
  .btns {
    margin-top: 50px;
    padding-bottom: 50px;
    text-align: center;
    .el-button {
      width: 100px;
    }
  }
  .dialogSpecSelect {
    .dialogSpecContent {
      padding: 0 10px;
      font-size: 0;
      ul {
        height: 350px;
        padding: 0 0 10px 0;
        margin: 0;
        overflow-y: auto;
        border: 1px solid #d3dce6;
        font-size: 14px;
        li {
          list-style: none;
        }
      }
      p {
        margin: 0;
      }
      .title {
        font-size: 16px;
        line-height: 30px;
        margin: 0;
      }
    }
    .specMainBox {
      display: inline-block;
      width: 40%;
      vertical-align: top;
      li.itemBox {
        padding: 10px 10px 0 20px;
        .item {
          width: 180px;
          display: inline-block;
          border-bottom: 1px dashed #d3dce6;
          &.active {
            span {
              color: #409EFF;
            }
          }
          span {
            display: inline-block;
            width: 150px;
            height: 30px;
            box-sizing: border-box;
            line-height: 28px;
            padding: 0 10px;
            cursor: pointer;
          }
          i {
            cursor: pointer;
          }
        }
        .icon {
          display: inline-block;
          padding: 4px;
          color: #8492A6;
          cursor: pointer;
        }
        .item-input {
          width: 180px;
          height: 30px;
        }
      }
    }
    .specItemBox {
      display: inline-block;
      width: 58%;
      margin-left: 2%;
      vertical-align: top;
      li.itemBox {
        padding: 10px 20px;
        .itemGroup {
          padding: 10px 0;
        }
      }
    }

  }
</style>
<style lang="scss" rel="stylesheet/scss">
  .dialogSpecSelect {
    .el-dialog {
      width: 700px;
      min-height: 400px;
    }
    .el-tag {
      height: 22px;
      line-height: 22px;
      background-color: #fff;
      border-color: #dfe6ec;
      color: #1f2d3d;
      margin: 0 10px 10px 0;
      cursor: pointer;
      vertical-align: top;
      padding-left: 0;
      &.active {
        border-color: #1d90e6;
        color: #1d90e6;
      }
      span {
        padding: 0 5px 0 10px;
      }

    }
  }
  .goods-image {
    .hideAddBtn {
      .el-upload.el-upload--picture-card {
        display: none;
      }
    }
  }
</style>
