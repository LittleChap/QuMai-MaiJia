<template>
  <div class="container" style="min-width:1224px;">
    <el-form :inline="true" label-width="100px" class="form-wrap">
      <el-row>
        <el-col :span="6">
          <el-form-item label="优惠券名称：">
            <el-input class="big-input" placeholder="请输入内容" v-model="couponName" style="width: 180px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="优惠券号：">
            <el-input class="big-input" placeholder="请输入内容" v-model="couponSn" style="width: 180px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="优惠券状态：">
            <el-select v-model="couponStatus" filterable clearable placeholder="全部状态" style="width: 180px">
              <el-option label="未开始" :value="1"></el-option>
              <el-option label="进行中" :value="2"></el-option>
              <el-option label="已停止" :value="8"></el-option>
              <el-option label="已撤回" :value="16"></el-option>
              <el-option label="已结束" :value="4"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="发放时间：">
            <el-date-picker type="datetime" placeholder="选择开始时间" v-model="grantTime1"
                            style="width: 180px;" @change="timeChoose"></el-date-picker>
            -
            <el-date-picker type="datetime" placeholder="选择结束时间" v-model="grantTime2"
                            style="width: 180px;" @change="timeChoose"></el-date-picker>
          </el-form-item>
        </el-col>
        <!--<el-col :span="6">
          <el-form-item label="优惠券类型：">
            <el-select v-model="couponType" filterable clearable placeholder="全部类型" style="width: 180px">
              <el-option label="满减券" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>-->

      </el-row>

    </el-form>
    <!--中间层按钮-->
    <div>
      <div style="float: left" class="btns-handle">
        <router-link style="margin-right: 10px;" :to="{ path: '/activemanage/fullcutsetting', query: {id: -1} }">
          <el-button>添加满减券</el-button>
        </router-link>
        <el-button @click="delGoods">删除</el-button>
        <el-button @click="stopGrant">停止发放</el-button>
        <el-button @click="stopGrantAndRecall">停止发放并撤回</el-button>
      </div>
      <div style="float: right" class="btns">
        <el-button type="primary" @click="search">查询</el-button>
      </div>
    </div>
    <el-table
        border
        :data="couponInfos"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        cellspacing="0"
        v-loading="loading"
        element-loading-text="拼命加载中">
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column
          align="center"
          prop="couponSn"
          label="优惠券号"
          width="220">
      </el-table-column>
      <el-table-column
          align="center"
          prop="couponName"
          label="优惠券名称"
          width="240">
      </el-table-column>
      <!--<el-table-column
              align="center"
              prop="couponType"
              label="优惠券类型"
              width="120">
        <template scope="scope">
          满减券
        </template>
      </el-table-column>-->
      <el-table-column
          align="center"
          prop="grantNum"
          label="发放数量"
          width="100">
      </el-table-column>
      <el-table-column
          align="center"
          prop="receiveCount"
          label="领取数量"
          width="100">
      </el-table-column>
      <el-table-column
          align="center"
          prop="useCount"
          label="使用数量"
          width="100">
      </el-table-column>
      <el-table-column
          align="center"
          label="发放时间">
        <template scope="scope">
          {{scope.row.grantStartTime}} ~ {{scope.row.grantEndTime}}
        </template>
      </el-table-column>
      <el-table-column
          align="center"
          prop="couponStatus"
          width="100"
          label="状态">
        <template scope="scope">
          <span v-if="scope.row.couponStatus == 1">未开始</span>
          <span v-if="scope.row.couponStatus == 2">进行中</span>
          <span v-if="scope.row.couponStatus == 8">已停止</span>
          <span v-if="scope.row.couponStatus == 16">已撤回</span>
          <span v-if="scope.row.couponStatus == 4">已结束</span>
        </template>
      </el-table-column>
      <el-table-column
          align="center"
          prop="handle"
          label="操作"
          width="200">
        <template scope="scope">
          <router-link v-if="scope.row.couponStatus == 1"
                       :to="{ path: '/activemanage/fullcutsetting', query:{couponSn: scope.row.couponSn, id: scope.row.couponSearchId,  type: scope.row.couponStatus} }">
            <el-button size="small" icon="edit">编辑</el-button>
          </router-link>
          <router-link v-else
                       :to="{ path: '/activemanage/fullcutdetail', query:{couponSn: scope.row.couponSn, type: scope.row.couponStatus} }">
            <el-button size="small" icon="edit">查看</el-button>
          </router-link>
          <el-button size="small" icon="delete" @click.native.prevent="delGoodsRow(scope)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页器-->
    <div class="pagination" v-if="couponInfos.length">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalResult">
      </el-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {
    getCouponList,
    falseDeleteCoupon,
    batchfalseDeleteCoupon,
    batchStopGrant,
    batchStopGrantAndRecall
  } from '@/api/couponlist'
  import {parseTime} from '@/utils/index';

  export default {
    data() {
      return {
        couponName: '',
        couponSn: '',
        couponType: '',
        couponStatus: '',
        // 发放时间
        grantTime2: '',     // 发放时间-结束
        grantTime1: '',     // 发放时间-开始
        couponInfos: [],
        // 分页器的设置
        totalResult: 0,
        pageSize: 10,
        currentPage: 1,
        couponNum: 0,
        coupons: [],
        couponIds: '',
        couponSns: '',
        loading: false
      }
    },
    methods: {
      // 获取商品列表
      getList() {
        let data = {
          token: this.$store.getters.token,
          shopId: this.$store.getters.shopId,
          couponName: this.couponName,
          couponSn: this.couponSn,
          couponType: this.couponType,
          couponStatus: this.couponStatus,
          grantStartTime: this.grantTime1 ? parseTime(this.grantTime1) : '',
          grantEndTime: this.grantTime2 ? parseTime(this.grantTime2) : '',
          currentPage: this.currentPage,
          showCount: this.pageSize
        }
        this.loading = true
        getCouponList(data).then((res) => {
          this.couponInfos = res.couponArray
          this.totalResult = res.totalResult
          this.currentPage = res.currentPage
          for (let i = 0; i < res.couponArray.length; i++) {
            if (!res.goodsArray[i].isPutaway) {
              this.couponInfos[i].state = '下架'
            } else {
              this.couponInfos[i].state = '上架'
            }
            /*let t = new Date(res.goodsArray[i].createTime)
            this.couponInfos[i].createTime = this.getLocalTime(t)*/
          }
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
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
        this.couponIds = '';
        this.couponSns = '';
        this.coupons = val
        for (let i = 0; i < val.length; i++) {
          this.couponIds += `,${val[i].couponId}`
          this.couponSns += `,${val[i].couponSn}`
        }
        this.couponIds = this.couponIds.substr(1)
        this.couponSns = this.couponSns.substr(1)
        this.couponNum = val.length
      },

      // 时间比较
      timeChoose() {
        if (this.grantTime1 && this.grantTime2) {
          if (this.grantTime2 < this.grantTime1) {
            this.$alert('开始时间不能晚于结束时间', {
              confirmButtonText: '确 定',
              type: 'warning',
              callback: () => {
                this.grantTime1 = '';
                this.grantTime2 = ''
              }
            });
          }
        }
      },
      // 查询
      search() {
        // 查询商品
        this.getList()
      },
      // 批量删除
      delGoods() {
        if (!this.couponNum) {
          this.$message.error('请选择数据')
        } else {
          this.$confirm(`确定删除所选这${this.couponNum}个优惠券`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 进行中的优惠券活动不允许删除
            let isRunning = false
            for (let i = 0; i < this.couponNum; i++) {
              if (this.coupons[i].couponStatus == 2) {
                isRunning = true
              }
            }
            if (isRunning) {
              this.$message.error('进行中的优惠券活动不可删除')
            } else {
              // 点击确定去请求接口实现删除
              let data = {
                token: this.$store.getters.token,
                shopId: this.$store.getters.shopId,
                couponSns: this.couponSns
              }
              batchfalseDeleteCoupon(data).then(() => {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.getList()
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
        let couponSn = value.row.couponSn
        if (value.row.couponStatus == 2) {
          this.$message.error('进行中的优惠券活动不可删除')
        } else {
          this.$confirm(`确认删除此优惠券`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let data = {
              token: this.$store.getters.token,
              shopId: this.$store.getters.shopId,
              couponSn: couponSn
            }
            falseDeleteCoupon(data).then(() => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getList()
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
      // 停止发放
      stopGrant() {
        if (!this.couponNum) {
          this.$message.error('请选择数据')
        } else {
          this.$confirm(`停止发放将会停止活动，但已发放的优惠券不追回，确定执行此操作？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            // 优惠券进行中才可以停止发放
            let isRunning = true
            for (let i = 0; i < this.couponNum; i++) {
              if (this.coupons[i].couponStatus != 2) {
                isRunning = false
              }
            }
            if (isRunning) {
              let data = {
                token: this.$store.getters.token,
                shopId: this.$store.getters.shopId,
                couponSns: this.couponSns
              }
              batchStopGrant(data).then((res) => {
                this.$message({
                  type: 'success',
                  message: '停止发放成功!'
                });
                this.getList()
              }).catch(() => {
                return
              })
            } else {
              this.$message.error('只有进行中的活动才可执行该操作')
            }
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消停止发放'
            });
          });
        }
      },
      // 停止发放并撤回
      stopGrantAndRecall() {
        /*停止发放并撤回*/
        if (!this.couponNum) {
          this.$message.error('请选择数据')
        } else {
          this.$confirm(`停止发放并撤回将会撤回所有已发优惠券并停止活动，确定执行此操作？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            // 优惠券进行中才可以停止发放
            let isRunning = true
            for (let i = 0; i < this.couponNum; i++) {
              if (this.coupons[i].couponStatus != 2) {
                isRunning = false
              }
            }
            if (isRunning) {
              let data = {
                token: this.$store.getters.token,
                shopId: this.$store.getters.shopId,
                couponSns: this.couponSns
              }
              batchStopGrantAndRecall(data).then((res) => {
                this.$message({
                  type: 'success',
                  message: '停止发放并撤回成功!'
                });
                this.getList()
              }).catch(() => {
                return
              })
            } else {
              this.$message.error('只有进行中的活动才可执行该操作')
            }
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消停止发放并撤回'
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
    }
  }
</script>

<style  scoped rel="stylesheet/scss" lang="scss" >
  .time-box {
    .line {
      /*width: 80px;*/
      text-align: center;
    }
  }
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
    margin: 20px 30px 0 30px;
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
        width: 85px;
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
    margin: 40px 0 16px 0;
    button{
      min-width: 80px;
      text-align: center;
    }
  }
  .pagination {
    margin: 20px 0 60px;
    text-align: right;
  }
</style>
<style lang="scss" rel="stylesheet/scss">
  .form-wrap {
    .el-form-item {
      margin-bottom: 10px;
    }
  }
</style>
