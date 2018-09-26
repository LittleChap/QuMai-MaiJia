<template>
  <div class="dashboard-container">
    <div class="left-block">
      <table class="remain-work todo-list">
        <thead>
        <tr>
          <td colspan="3">待办事项</td>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>
            订单管理
          </td>
          <td>
            <router-link to="/ordermanage/orderlist?tab=2">待发货 ({{remainWork.waitForSend}})</router-link>
          </td>
          <td>
            <router-link to="/ordermanage/orderlist?tab=4">待评价 ({{remainWork.waitForComment}})</router-link>
          </td>
        </tr>
        <tr>
          <td width="100px">
            商品管理
          </td>
          <td width="100px">
            <router-link to="/goodsmanage/goodslist?tab=2">待上架 ({{remainWork.downaway}})</router-link>
          </td>
          <td>
            <router-link to="/goodsmanage/goodslist?tab=1">上架中 ({{remainWork.putaway}})</router-link>
          </td>
        </tr>
        <tr>
          <td width="100px">
            售后管理
          </td>
          <td width="100px">
            <router-link to="/aftersalesmanage/aftersaleslist?tab=1">待处理 ({{remainWork.waitForHandle}})</router-link>
          </td>
          <td>
          </td>
        </tr>
        </tbody>
      </table>
      <table class="remain-work statistics">
        <thead>
        <tr>
          <td colspan="3">信息统计</td>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>
            今日销售额
          </td>
          <td>
            ¥{{remainWork.currentDaySalesPrice}}
          </td>
          <td>
            本月销售额
          </td>
          <td>
            ¥{{remainWork.currentMonthSalesPrice}}
          </td>
          <td>
            今年销售额
          </td>
          <td>
            ¥{{remainWork.currentYearSalesPrice}}
          </td>
        </tr>
        <tr>
          <td>
            今日订单量
          </td>
          <td>
            {{remainWork.currentDayOrderNum}}
          </td>
          <td>
            本周订单量
          </td>
          <td>
            {{remainWork.currentWeekOrderNum}}
          </td>
          <td>
            本月订单量
          </td>
          <td>
            {{remainWork.currentMonthOrderNum}}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="right-block">
      <table>
        <thead>
        <tr>
          <td>
            未读消息
          </td>
          <td>
            <router-link to="/messagebox/index">更多>></router-link>
          </td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,index) in messageArray">
          <td style="width: 60px">
            {{item.createTime.substr(5,5)}}
          </td>
          <td>
            <div @click="checkMsg(item.messageId)">
              {{item.messageContent}}
              <!--<router-link to="/messagebox/index">{{item.messageContent}}</router-link>-->
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <el-dialog title="温馨提示" :visible.sync="isShowDialog" class="changePwdDialog" size="tiny">
      <p style="width: 380px; margin: 0 auto; text-align: center;padding-bottom: 20px;">尊敬的卖家您好，您首次登录本系统建议修改默认密码！</p>
      <el-form style="width: 400px; margin: 0 auto;" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="输入旧密码" prop="oldPass">
          <el-input type="password" v-model="ruleForm.oldPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="输入新密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item style="padding-left: 50px;">
          <el-button type="primary" :loading="loading" @click="submitForm()">确 认</el-button>
          <el-button @click="isShowDialog = false">取 消</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer"></div>
    </el-dialog>
  </div>
</template>

<script>
  import {getNum, getMessage} from '@/api/index';
  import axios from 'axios';
  import {resetPwd} from '@/api/resetpwd';
  import {markRead } from '@/api/message';
  export default {
    data() {
      var validOldPass = (rule, value, callback) => {
        if (value === '') {
          this.status.oldPass = false;
          callback(new Error('请输入旧密码'));
        } else {
          const shopId = this.$store.getters.shopId + '';
          const token = this.$store.getters.token;
          let _this = this;
          var config = {
            method: 'post',
            url: "/backend/mobileSellerShop/checkOldPassword.do",
            params: {shopId: shopId, token: token, oldPassword: value},
            requestHeader: {'Content-Type': 'application/json'}
          }
          axios(config).then(res => {
            if (res.data.code == 0) {
              this.status.oldPass = false;
              callback(new Error('旧密码错误'));
            } else if (res.data.code == 1) {
              this.status.oldPass = true;
              if (_this.ruleForm.pass !== '') {
                _this.$refs.ruleForm.validateField('pass');
              }
              callback();
            }
          }).catch(err => {
            this.status.oldPass = false;
            callback(new Error('旧密码错误'));
            console.log(err);
          })
        }
      }
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          this.status.pass = false;
          callback(new Error('请输入新密码'));
        } else if (value.length < 6 || value.length > 20) {
          this.status.pass = false;
          callback(new Error('密码长度应在6位-20位之间'));
        } else if (value == this.ruleForm.oldPass) {
          this.status.pass = false;
          callback(new Error('新密码不能与旧密码一致'));
        } else {
          this.status.pass = true;
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          this.status.checkPass = false;
          callback(new Error('请再次输入新密码'));
        } else if (value !== this.ruleForm.pass) {
          this.status.checkPass = false;
          callback(new Error('两次输入新密码不一致!'));
        } else {
          this.status.checkPass = true;
          callback();
        }
      };
      return {
        remainWork: {
          waitForSend: 0,
          waitForComment: 0,
          putaway: 0,
          downaway: 0,
          waitForHandle: 0,
          waitForRead: 0,
          currentDaySalesPrice: 0,
          currentMonthSalesPrice: 0,
          currentYearSalesPrice: 0,
          currentDayOrderNum: 0,
          currentWeekOrderNum: 0,
          currentMonthOrderNum: 0
        },
        messageArray: [],
        isShowDialog: false,
        loading: false,
        ruleForm: {
          pass: '',
          checkPass: '',
          oldPass: ''
        },
        status: {
          pass: false,
          checkPass: false,
          oldPass: false
        },
        rules: {
          pass: [
            {validator: validatePass, trigger: 'blur'}
          ],
          checkPass: [
            {validator: validatePass2, trigger: 'blur'}
          ],
          oldPass: [
            {validator: validOldPass, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      getOrderNum() {
        const shopId = this.$store.getters.shopId;
        const token = this.$store.getters.token;
        getNum(shopId, token).then(res => {
          this.remainWork.waitForSend = res.waitForSend;
          this.remainWork.waitForComment = res.waitForComment;
          this.remainWork.putaway = res.putaway;
          this.remainWork.downaway = res.downaway;
          this.remainWork.waitForHandle = res.waitForHandle;
          this.remainWork.waitForRead = res.waitForRead;
          this.remainWork.currentDaySalesPrice = this.formatPrice(res.currentDaySalesPrice);
          this.remainWork.currentMonthSalesPrice = this.formatPrice(res.currentMonthSalesPrice);
          this.remainWork.currentYearSalesPrice = this.formatPrice(res.currentYearSalesPrice);
          this.remainWork.currentDayOrderNum = res.currentDayOrderNum;
          this.remainWork.currentWeekOrderNum = res.currentWeekOrderNum;
          this.remainWork.currentMonthOrderNum = res.currentMonthOrderNum;

        }).catch(error => {
          console.log(error)
          return;
        })
      },
      formatPrice(str) {
        var price = 0;
        if (parseFloat(str) < 0) {
          return price.toFixed(2) + '';
        }
        else {
          return parseFloat(str).toFixed(2) + '';
        }
      },
      getMessageNum() {
        const shopId = this.$store.getters.shopId;
        const token = this.$store.getters.token;
        getMessage(shopId, token, 10).then(res => {
          this.messageArray = res.messageArray;
        }).catch(error => {
          console.log(error)
          return;
        })
      },
      setChangePwd() { // 设置是否显示修改密码弹窗
        const loginNumber = this.$store.getters.loginNumber;
        if (loginNumber == 2 && !sessionStorage.getItem('isShowChangeDialog')) {
          this.isShowDialog = true;
          sessionStorage.setItem('isShowChangeDialog', true)
        }
      },
      submitForm() { // 修改密码
        let status = this.status.pass && this.status.checkPass && this.status.oldPass;
        if (status) {
          console.log('success');
          const shopId = this.$store.getters.shopId;
          const token = this.$store.getters.token;
          this.loading = true;
          resetPwd(shopId, token, this.ruleForm.oldPass, this.ruleForm.pass).then(res => {
            if (res.code == 1) {
              this.loading = false;
              this.isShowDialog = false;
            }
          }).catch(error => {
            console.log(error);
            this.loading = false;
            return;
          });
        } else
          console.log('faild');
      },
      // 点击消息条目的操作
      checkMsg(messageId) {
        const shopId = this.$store.getters.shopId;
        const token = this.$store.getters.token;
        markRead(shopId, token, messageId).then(response => {
          if(response.messageType == 0){
            this.$confirm(response.messageContent, response.messageTitle, {
              confirmButtonText: '前往订单详情页',
              cancelButtonText: '关闭'
            }).then(() => {
              this.$router.push('/ordermanage/orderDetail?orderSn='+response.orderSn);
            }).catch(error => {
              this.getMessageNum();
              return;
            });
          }else {
            this.$confirm(response.messageContent, response.messageTitle, {
              confirmButtonText: '前往售后详情页',
              cancelButtonText: '关闭'
            }).then(() => {
              this.$router.push('/aftersalesmanage/aftersalesDetail?returnOrderId='+response.returnOrderId);
            }).catch(error => {
              this.getMessageNum();
              return;
            });
          }
          // 修改store 保存的未读消息
          this.$store.dispatch('GetUnreadMessageList', {shopId: shopId, token:token}).then(() => {
            console.log('保存标记已读消息')
          }).catch(() => {
            return;
          });
        }).catch(error => {
          console.log(error)
          return;
        });
      }
    },
    created() {
      this.getOrderNum();
      this.getMessageNum();
      this.setChangePwd();

    }
  }
</script>

<style rel="stylesheet/scss" scoped="" lang="scss">
  .dashboard {
    &-container {
      display: flex;
      font-size: 14px;
      margin: 30px;
      .left-block {
        flex: 1;
        width: 50%;
        vertical-align: top;
        margin-right: 30px;
        margin-bottom: 30px;
        table {
          border-collapse: collapse;
          width: 100%;
          thead {
            font-weight: bold;
            line-height: 40px;
            color: #1f2d3d;
            background: #eef1f6;
            border: 1px solid #eef1f6;
            td {
              padding-left: 10px;
            }
          }
        }
        .todo-list {
          tbody tr {
            display: flex;
            &:hover {
              background-color: #eef1f6;
            }
            transition: background-color .25s ease;
            line-height: 40px;
            border: 1px solid #dfe6ec;
            margin-bottom: -1px;
            td {
              padding-left: 10px;
            }
            td:nth-child(1) {
              flex: 1;
            }
            td:nth-child(2) {
              flex: 1;
            }
            td:nth-child(3) {
              flex: 3;
            }
          }
        }
        .statistics {
          margin-top: 30px;

          tbody tr {
            display: flex;
            &:hover {
              background-color: #eef1f6;
            }
            transition: background-color .25s ease;
            line-height: 40px;
            border: 1px solid #dfe6ec;
            margin-bottom: -1px;
            td:nth-child(2n+1) {
              flex: 1.2;
              padding-left: 10px;
            }
            td:nth-child(2n+2) {
              flex: 1;
            }
          }
        }
        .remain-work {
          a:hover {
            font-weight: bold;
            color: #20a0ff;
          }
        }
        .information-statistic {
          margin-top: 30px;
        }
      }
      .right-block {
        flex: 1;
        width: 50%;
        vertical-align: top;
        table {
          a:hover {
            font-weight: bold;
            color: #20a0ff;
          }
          border-collapse: collapse;
          width: 100%;
          thead {
            tr {
              display: flex;
            }
            font-weight: bold;
            line-height: 41px;
            color: #1f2d3d;
            background: #eef1f6;
            border-top: 1px solid #eef1f6;
            border-left: 1px solid #eef1f6;
            border-right: 1px solid #eef1f6;
            td {
              padding-left: 10px;
            }
            td:first-child {
              width: 68px;
            }
            td:last-child {
              flex: 1.0;
              text-align: right;
              padding-right: 30px;
            }
          }
          tbody {
            border: 1px solid #dfe6ec;
            tr {
              display: flex;
              cursor: pointer;
              &:hover {
                color: #20a0ff;
                background-color: #eef1f6;
              }
              line-height: 40px;
              transition: background-color .25s ease;
            }
            td {
              padding-left: 10px;
              &:last-child {
                padding-left: 0;
              }
              div {
                display: -webkit-box;
                overflow: hidden;
                white-space: normal !important;
                text-overflow: ellipsis;
                word-wrap: break-word;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
              }
            }
            td:first-child {
              width: 68px;
            }
            td:last-child {
              flex: 1.0;
              padding-right: 30px;
            }
          }
        }
      }
    }
  }
  .changePwdDialog {
    min-width: 480px;
    p {
      margin: 0 0 20px;
      text-align: center;
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss">
  .changePwdDialog {
    p {
      margin: 0 0 20px;
      text-align: center;
    }
    .el-dialog {
      min-width: 480px;
    }
    .el-dialog__body {
      padding: 30px 20px 0;
    }
  }
</style>
