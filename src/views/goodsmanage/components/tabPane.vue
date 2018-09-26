<template>
  <div v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="拼命加载中">
    <el-row>
      <el-col :span="6">
        <span>商品分类：</span>
        <div class="block">
          <el-input icon="caret-bottom" v-model="selectCatNames" placeholder="请选择分类"
                    @focus="showCartDialog = true"></el-input>
          <!--<el-cascader
                  placeholder="全部分类"
                  class="big-input"
                  expand-trigger="hover"
                  :options="catList"
                  :change-on-select="true"
                  :clearable=true
                  :props="props"
                  v-model="catId">
          </el-cascader>-->

        </div>
      </el-col>
      <el-col :span="6">
        <span>商品品牌：</span>
        <div class="block">
          <el-select v-model="brandId" filterable clearable  placeholder="请选择" style="width: 200px">
            <el-option
               v-for="item in selectInfos"
               :key="item.brandId"
               :label="item.brandName"
               :value="item.brandId">
            </el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="6">
        <span>商品名称：</span>
        <el-input class="big-input" placeholder="请输入内容" v-model="name"></el-input>
      </el-col>
      <el-col :span="6">
        <span>商品SKU：</span>
        <el-input class="big-input" placeholder="请输入内容" v-model="sku"></el-input>
      </el-col>
    </el-row>
    <el-row class="bottom">
      <el-col :span="6">
        <span>商品价格：</span>
        <div class="price">
          <div class="position">
            <el-input class="small-input" v-model="priceMin"></el-input>
            <span style="color: red;" class="error-tip red"
                  v-show="priceMin!==''&&!/^[0-9]*$/.test(priceMin)">需填数字</span>
          </div>
          <span class="go">到</span>
          <div class="position">
            <el-input class="small-input" v-model="priceMax"></el-input>
            <span style="color: red;" class="error-tip red"
                  v-show="priceMax!==''&&!/^[0-9]*$/.test(priceMax)">需填数字</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <span>商品销量：</span>
        <div class="price">
          <div class="position">
            <el-input class="small-input" v-model="buyNumMin"></el-input>
            <span style="color: red;" class="error-tip red"
                  v-show="buyNumMin!==''&&!/^[0-9]*$/.test(buyNumMin)">需填数字</span>
          </div>
          <span class="go">到</span>
          <div class="position">
            <el-input class="small-input" v-model="buyNumMax"></el-input>
            <span style="color: red;" class="error-tip red"
                  v-show="buyNumMax!==''&&!/^[0-9]*$/.test(buyNumMax)">需填数字</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <span>商品库存：</span>
        <div class="price">
          <div class="position">
            <el-input class="small-input" v-model="storeMin"></el-input>
            <span style="color: red;" class="error-tip red"
                  v-show="storeMin!==''&&!/^[0-9]*$/.test(storeMin)">需填数字</span>
          </div>
          <span class="go">到</span>
          <div class="position">
            <el-input class="small-input" v-model="storeMax"></el-input>
            <span style="color: red;" class="error-tip red"
                  v-show="storeMax!==''&&!/^[0-9]*$/.test(storeMax)">需填数字</span>
          </div>
        </div>
      </el-col>
    </el-row>
    <div>
      <div style="float: left" class="btns-handle">
        <router-link style="margin-right: 10px;" :to="{ path: '/goodsmanage/goodsdetail', query: {id: -1} }">
          <el-button>添加</el-button>
        </router-link>
        <el-button @click="delGoods">删除</el-button>
        <el-button @click="putawayGoods">上架</el-button>
        <el-button @click="downawayGoods">下架</el-button>
      </div>
      <div style="float: right" class="btns">
        <el-button type="primary" @click="dialogVisible = true; fileName=''">导入商品</el-button>
        <el-button type="primary" @click="exportGoods">导出商品</el-button>
        <el-button type="primary" @click="searchGoods">查询</el-button>
      </div>
    </div>
    <el-table
       class="goods"
       border
       :data="goodsInfos"
       style="width: 100%"
       @selection-change="handleSelectionChange"
       cellspacing="0"
       cellpadding="0"
       v-loading="loading"
       element-loading-text="拼命加载中">
      <el-table-column
         type="selection"
         width="55">
      </el-table-column>
      <el-table-column
         align="center"
         prop="goodsName"
         label="商品名称"
         width="300">
        <template scope="scope">
          <div style="display: table;">
            <img style="width: 60px;height: 60px;float: left;margin: 10px 10px 10px 0;"
                 :src="scope.row.imageThumbnail" alt="">
            <span style="display: table-cell;vertical-align: middle;text-align: left;">{{ scope.row.goodsName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
         align="center"
         prop="brandName"
         label="品牌"
         width="150">
      </el-table-column>
      <el-table-column
         align="center"
         prop="originalPriceRange"
         label="销售价">
      </el-table-column>
      <el-table-column
         align="center"
         prop="promotionPriceRange"
         label="优惠价">
      </el-table-column>
      <el-table-column
         align="center"
         prop="store"
         label="库存"
         width="80">
      </el-table-column>
      <el-table-column
         align="center"
         prop="buyNum"
         label="总销量"
         width="80">
      </el-table-column>
      <el-table-column
         align="center"
         prop="state"
         label="状态"
         width="80">
      </el-table-column>
      <el-table-column
         align="center"
         prop="createTime"
         label="添加时间">
      </el-table-column>
      <el-table-column
         align="center"
         prop="handle"
         label="操作"
         width="200">
        <template scope="scope">
          <router-link :to="{ path: '/goodsmanage/goodsdetail', query:{id: scope.row.goodsId} }">
            <el-button size="small" icon="edit">编辑</el-button>
          </router-link>
          <el-button size="small" icon="delete" @click.native.prevent="delGoodsRow(scope)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页器-->
    <div class="pagination" v-if="goodsInfos.length">
      <el-pagination
         @size-change="handleSizeChange"
         @current-change="handleCurrentChange"
         :page-sizes="[10, 20, 30, 50]"
         :page-size="pageSize"
         layout="total, sizes, prev, pager, next, jumper"
         :total="totalResult">
      </el-pagination>
    </div>
    <el-dialog class="import" title="导入商品"
               :visible.sync="dialogVisible"
               style="min-width: 610px;"
               v-loading="uploadLoading"
               element-loading-text="商品导入中..."
               element-loading-spinner="el-icon-loading"
               element-loading-background="rgba(0, 0, 0, 0.8)">
      <div style="width: 610px;height: 100px; margin: 0 auto; text-align: center;">
        <span style="float: left; font-size: 16px; height: 36px; line-height: 36px;">商品数据模板导入：</span>
        <el-input type="text" style="width: 300px; height: 30px; float: left; margin-right: 10px" v-model="fileName"></el-input>
        <el-upload
           style="float: left;"
           action="/backend/mobileSellerGoods/uploadExcel.do"
           :data="fileObj"
           :name="fileType"
           :before-upload="beforeUpload"
           :on-success="handleSuccess"
           :show-file-list="false"
           :limit="1"
           :file-list="fileList">
          <el-button size="small" type="" style="height: 36px;">浏览</el-button>
          <!--<div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>-->
        </el-upload>
        <el-button type="" style="height: 36px; margin-left: 20px; float: left;" @click="download">模板下载</el-button>
      </div>
      <div class="btn" style="text-align: center;">
        <el-button type="primary" style="width: 100px;" @click="uploadFile">确定</el-button>
        <el-button type="primary" style="width: 100px;" @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog class="importResult" title="导入商品结果"
               width="500px"
               :visible.sync="importResultDialogVisible">
      <div>
        <p>成功：{{importResult.successNum || 0}} 条，失败：{{importResult.failNum || 0}} 条。</p>
        <p>日志：</p>
        <div class="content">
          <p v-for="(item, index) in importResult.importFailDetail" :key="item">{{index+1}}. {{item.errorMsg}}</p>
          <p v-if="!importResult.importFailDetail || !importResult.importFailDetail.length">无</p>
        </div>


      </div>
      <div class="btn" style="text-align: center;">
        <el-button  @click="importResultDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
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
        <el-button  @click="toClearSelectCat">清 空</el-button>
        <el-button type="primary" @click="toConfirmSelectCat">确认选择</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import {
    getGoodsList,
    getGoods,
    getBrand,
    exportGoods,
    deleteGoods,
    deleteGood,
    batchPutAwayGoods,
    batchDownAwayGoods,
    getAllGoodsCatList,
    importGoodsTemplate,
    downloadGoodsTemplate,
    importGoodsIsOk
  } from '@/api/goodslist'
  import {parseTime} from '@/utils/index';

  export default {
    props: {
      type: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        catList: [
          {
            childrenGoodsCatArray: [{
              childrenGoodsCatArray: []
            }]
          }
        ], // 分类列表
        catId: [],
        selectCatNames: '',
        currentSelectCatIndex: {
          first: -1,
          second: -1,
          third: -1
        },
        showCartDialog: false, // 是否显示分类弹窗
        selectInfos: [],
        goodsInfos: [],
        // 分页器的设置
        totalResult: 0,
        pageSize: 10,
        currentPage: 1,
        goodsNum: 0,
        goods: [], // 多选的结果集合
        brandId: '',
        logisticsTemplateId: '',
        name: '',
        sku: '',
        priceMin: '',
        priceMax: '',
        buyNumMin: '',
        buyNumMax: '',
        storeMin: '',
        storeMax: '',
        goodsIds: '',
        loading: false,
        fullscreenLoading: true,
        dialogVisible: false,
        fileList: [],
        fileName: '',
        file: '',
        fileObj: {
          token: this.$store.getters.token,
          shopId: this.$store.getters.shopId
        },
        fileType: 'file',
        fileUrl: '',
        uploadLoading: false,  // 导入商品的弹窗
        importResultDialogVisible: false, // 导入结果的弹窗
        importResult: {},
        timer: null
      }
    },
    methods: {
      // 上传之前
      beforeUpload(file) {
        const xls = file.name.split('.')[1] === 'xls'
        const xlsx = file.name.split('.')[1] === 'xlsx'
        const cvs = file.name.split('.')[1] === 'cvs'
        if (!xls && !xlsx && !cvs) {
          this.$message.error('只允许导入cvs、xls、xlsx格式的文件')
          return false
        } else {
          this.file = file
        }
      },
      handleSuccess(res, file, fileList) {
        if (res.code == 1) {
          this.fileName = file.name
          this.fileUrl = res.data.url
        } else {
          this.$message.error(res.message)
        }
      },
      // 确定导入文件
      uploadFile () {
        if (this.file == '') {
          this.$message.error('请选择要导入的文件')
          return
        }
        this.uploadLoading = true
        let data = {
          token: this.$store.getters.token,
          shopId: this.$store.getters.shopId,
          url: this.fileUrl
        }
        importGoodsTemplate(data).then(res => {
          let data = {
            token: this.$store.getters.token,
            shopId: this.$store.getters.shopId,
            importToken: res.importToken
          }
          let _this = this
          this.timer = setInterval(() => {
            _this.importGoodsIsOk(data)
          }, 5000)
        }).catch(() => {
          this.dialogVisible = false
          return
        })
      },
      // 判断是否导入成功
      importGoodsIsOk(data) {
        importGoodsIsOk(data).then(res1 => {
          if (res1.importFlag == 1) {
            clearInterval(this.timer)
            this.uploadLoading = false
            this.$message.success('导入完成！')
            this.dialogVisible = false
            this.importResult = res1
            this.importResultDialogVisible = true
            if (res1.successNum) {
              this.currentPage = 1
              this.getList()
            }
          }

        }).catch(() => {
          this.uploadLoading = false
          clearInterval(this.timer)
          this.dialogVisible = false
          return
        })
      },
      // 模板下载
      download () {
        let data = {
          token: this.$store.getters.token,
          shopId: this.$store.getters.shopId
        }
        downloadGoodsTemplate(data).then(res => {
          // window.open(res.url)
          window.location.href = res.url
        }).catch(() => {
          return
        })
      },
      // 获取商品列表
      getList() {
        let data = {
          token: this.$store.getters.token,
          shopId: this.$store.getters.shopId,
          goodsType: 0,
          type: this.type,
          catId: (this.catId.length == 0) ? '' : this.catId[this.catId.length - 1],
          brandId: this.brandId,
          logisticsTemplateId: this.logisticsTemplateId,
          name: this.name,
          sku: this.sku,
          priceMin: this.priceMin,
          priceMax: this.priceMax,
          buyNumMin: this.buyNumMin,
          buyNumMax: this.buyNumMax,
          storeMin: this.storeMin,
          storeMax: this.storeMax,
          currentPage: this.currentPage,
          showCount: this.pageSize
        }
        this.loading = true
        getGoodsList(data).then((res) => {
          this.goodsInfos = res.goodsArray
          this.totalResult = res.totalResult
          this.currentPage = res.currentPage
          for (let i = 0; i < res.goodsArray.length; i++) {
            if (!res.goodsArray[i].isPutaway) {
              this.goodsInfos[i].state = '下架'
            } else {
              this.goodsInfos[i].state = '上架'
            }
            this.goodsInfos[i].createTime = parseTime(this.goodsInfos[i].createTime)
            // let t = new Date(res.goodsArray[i].createTime)
            // this.goodsInfos[i].createTime = this.getLocalTime(t)
          }
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      // 商品分类的获取
      getGoods() {
        let data = {
          token: this.$store.getters.token,
          shopId: this.$store.getters.shopId
        }
        // 第二套方案
        getAllGoodsCatList(data).then(res => {
          this.catList = res.goodsCatArray
          this.fullscreenLoading = false
        }).catch(() => {
          this.fullscreenLoading = false
        })
      },
      // 选择分类
      selectCat(first, second, third) {
        this.currentSelectCatIndex = {
          first: first,
          second: second,
          third: third
        }
      },
      // 确认选择分类
      toConfirmSelectCat() {
        this.catId = []
        this.selectCatNames = ''
        this.showCartDialog = false
        if (this.currentSelectCatIndex.first < 0) {
          return false
        }
        this.catId.push(this.catList[this.currentSelectCatIndex.first].catId)
        this.selectCatNames = this.catList[this.currentSelectCatIndex.first].catName
        if (this.currentSelectCatIndex.second < 0) {
          return false
        }
        this.catId.push(this.catList[this.currentSelectCatIndex.first].childrenGoodsCatArray[this.currentSelectCatIndex.second].catId)
        this.selectCatNames += ' / ' + this.catList[this.currentSelectCatIndex.first].childrenGoodsCatArray[this.currentSelectCatIndex.second].catName
        if (this.currentSelectCatIndex.third < 0) {
          return false
        }
        this.catId.push(this.catList[this.currentSelectCatIndex.first].childrenGoodsCatArray[this.currentSelectCatIndex.second].childrenGoodsCatArray[this.currentSelectCatIndex.third].catId)
        this.selectCatNames += ' / ' + this.catList[this.currentSelectCatIndex.first].childrenGoodsCatArray[this.currentSelectCatIndex.second].childrenGoodsCatArray[this.currentSelectCatIndex.third].catName
      },
      // 清空选择的分类
      toClearSelectCat() {
        this.showCartDialog = false
        this.currentSelectCatIndex.first = -1
        this.currentSelectCatIndex.second = -1
        this.currentSelectCatIndex.third = -1
        this.catId = []
        this.selectCatNames = ''

      },

      // 时间戳转换成日期格式
      getLocalTime(now) {
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        return year + "-" + month + "-" + date + "   " + hour + ":" + minute + ":" + second;
      },
      // 商品列表中的checkbox选择器选择事件
      handleSelectionChange(val) {
        this.goods = val
        this.goodsIds = '';
        for (let i = 0; i < val.length; i++) {
          this.goodsIds += `,${val[i].goodsId}`
        }
        this.goodsIds = this.goodsIds.substr(1)
        this.goodsNum = val.length
      },
      // 导出商品
      exportGoods() {
        if (!this.totalResult) {
          this.$message('暂时没有商品可以导出！')
          return
        }
        if (!this.goodsNum) {
          let data = {
            token: this.$store.getters.token,
            shopId: this.$store.getters.shopId,
            goodsType: 0,
            type: this.type,
            catId: (this.catId.length == 0) ? '' : this.catId[this.catId.length - 1],
            brandId: this.brandId,
            logisticsTemplateId: this.logisticsTemplateId,
            name: this.name,
            sku: this.sku,
            priceMin: this.priceMin,
            priceMax: this.priceMax,
            buyNumMin: this.buyNumMin,
            buyNumMax: this.buyNumMax,
            storeMin: this.storeMin,
            storeMax: this.storeMax
          }
          exportGoods(data).then((res) => {
            // window.open(res.url)
            window.location.href = res.url
          }).catch(() => {
            return
          })
        } else {
          this.$confirm(`确定导出所选这${this.goodsNum}个商品`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            // 点击确定去请求接口实现导出
            let data = {
              token: this.$store.getters.token,
              shopId: this.$store.getters.shopId,
              goodsIds: this.goodsIds,
              goodsType: 0
            }
            exportGoods(data).then((res) => {
              if (res.code == 1) {
                window.open(res.url)
                this.$message({
                  type: 'success',
                  message: '导出成功!'
                });
              } else {
                this.$message.error(res.message)
              }
            }).catch(() => {
              return
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消导出'
            });
          });
        }
      },
      // 查询
      searchGoods() {
        // 查询商品
        this.getList()
      },
      // 批量删除
      delGoods() {
        if (!this.goodsNum) {
          this.$message.error('请选择数据')
        } else {
          this.$confirm(`确定删除所选这${this.goodsNum}个商品`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 上架商品不允许删除
            let isPut = false
            for (let i = 0; i < this.goodsNum; i++) {
              if (this.goods[i].state == '上架') {
                isPut = true
              }
            }
            if (isPut) {
              this.$message.error('所选商品中含有上架商品，请先下架后再删除！')
            } else {
              // 点击确定去请求接口实现删除
              let goodsIdArray = []
              this.goods.map(item => {
                goodsIdArray.push({
                  goodsId: item.goodsId
                })
              })
              let data = {
                token: this.$store.getters.token,
                shopId: this.$store.getters.shopId,
                goodsIdArray: JSON.stringify(goodsIdArray)
                // goodsIds: this.goodsIds
              }
              deleteGoods(data).then((res) => {
                if (res.code == '1') {
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                  this.getList()
                } else {
                  this.$message.error(res.message)
                }
              }).catch(() => {
                return
              })
            }
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }
      },
      // 删除单行
      delGoodsRow(value) {
        let id = value.row.goodsId
        // 上架商品不允许删除还未做
        if (value.row.state == '上架') {
          this.$message.error('所选的是上架商品，请先下架后再删除！')
        } else {
          this.$confirm(`确定删除这个商品`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let data = {
              token: this.$store.getters.token,
              shopId: this.$store.getters.shopId,
              goodsId: id
            }
            deleteGood(data).then((res) => {
              if (res.code == '1') {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.getList()
              } else {
                this.$message.error(res.message)
              }
            }).catch(() => {
              return
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }
      },
      // 批量上架
      putawayGoods() {
        /*上架商品还未做*/
        if (!this.goodsNum) {
          this.$message.error('请选择数据')
        } else {
          this.$confirm(`确定上架所选这${this.goodsNum}个商品`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            // 点击确定去请求接口实现上架
            let data = {
              token: this.$store.getters.token,
              shopId: this.$store.getters.shopId,
              goodsIds: this.goodsIds
            }
            batchPutAwayGoods(data).then((res) => {
              let content = '上架成功!'
              if(res.message.indexOf('商品')>-1) {
                content = '所选商品含有禁用品牌或信息不全，无法上架！'
              }
              this.$message({
                type: 'success',
                message: content
              });
              this.getList()
            }).catch(() => {
              return
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消上架'
            });
          });
        }
      },
      // 批量下架
      downawayGoods() {
        /*下架商品还未做*/
        if (!this.goodsNum) {
          this.$message.error('请选择数据')
        } else {
          this.$confirm(`确定下架所选这${this.goodsNum}个商品`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            // 点击确定去请求接口实现上架
            let data = {
              token: this.$store.getters.token,
              shopId: this.$store.getters.shopId,
              goodsIds: this.goodsIds
            }
            batchDownAwayGoods(data).then((res) => {
              if (res.code == '1') {
                this.$message({
                  type: 'success',
                  message: '下架成功!'
                });
                this.getList()
              } else {
                this.$message.error(res.message)
              }
            }).catch(() => {
              return
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消下架'
            });
          });
        }
      },
      // 分页器部分
      handleSizeChange(value) {
        this.pageSize = value
        this.getList()
      },
      handleCurrentChange(value) {
        this.currentPage = value
        this.getList()
      }
    },
    created() {
      // 商品列表的获取
      this.getList()
      // 商品分类的获取
      this.getGoods()
      // 品牌数据的获取
      let brandData = {
        token: this.$store.getters.token,
        shopId: this.$store.getters.shopId
      }
      getBrand(brandData).then((res) => {
        this.selectInfos = res.brandArray
      }).catch(() => {
        return
      })
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .position {
    float: left;
    position: relative;
    width: 80px;
  }
  .red {
    color: red;
    position: absolute;
    top: 30px;
    right: 10px;
  }
  .container {
    .el-row {
      margin: 10px 0;
      &:last-child {
        margin-bottom: 0;
      }
      .el-col {
        border-radius: 4px;
      }
      .bg-purple-dark {
        background: #99a9bf;
      }
      .bg-purple {
        background: #d3dce6;
      }
      .bg-purple-light {
        background: #e5e9f2;
      }
      .grid-content {
        border-radius: 4px;
        min-height: 36px;
      }
      .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
      }
      span {
        width: 75px;
        float: left;
        line-height: 36px;
        text-align: right;
        font-size: 14px;
        color: #48576a;
        margin-right: 11px;
      }
      .go {
        float: left;
        width: 40px;
        text-align: center;
        margin: 0;
      }
      .block {
        float: left;
        width: 200px;
      }
      .big-input {
        width: 200px;
      }
      .small-input {
        float: left;
        width: 80px;
      }
    }
  }
  .bottom {
    margin-top: 30px;
    .price {
      width: 200px;
      float: left;
    }
  }
  .btns {
    text-align: right;
    height: 30px;
    margin-top: 40px;
    .el-button {
      width: 100px;
    }
  }
  .btns-handle {
    margin: 40px 0 5px 0;
    button {
      min-width: 80px;
    }
  }
  .pagination {
    margin: 20px 0 60px;
    text-align: right;
  }
  .catSelectDialog {
    .catListWrap {
      font-size: 0;
      p {
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

  .importResult{
    .content{
      min-height: 100px;
      max-height: 300px;
      overflow: auto;
      padding: 0 20px;
      border: 1px solid #dfe6ec;
      margin-bottom: 40px;
    }

  }
</style>
<style rel="stylesheet/scss" lang="scss">
  .catSelectDialog {
    .el-dialog {
      width: 900px;
    }
    .el-dialog__body {
      padding: 20px 20px 0;
    }
    .dialog-footer{
      button{
        min-width: 80px;
      }
    }
  }
</style>
