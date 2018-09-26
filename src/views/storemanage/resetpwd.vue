<template>
  <div class="dashboard-container">
    <el-form style="width: 400px;margin: 0 auto;" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="旧密码" prop="oldPass">
        <el-input type="password" v-model="ruleForm.oldPass" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="pass">
        <el-input type="password" v-model="ruleForm.pass" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">确 定</el-button>
        <el-button @click="resetForm('ruleForm')">重 置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios';
  import { resetPwd } from '@/api/resetpwd';
  export default {
    data() {
      var validOldPass = (rule, value, callback) => {
        if (value === ''){
          this.status.oldPass = false;
          callback(new Error('请输入旧密码'));
        } else {
          const shopId = this.$store.getters.shopId+ '';
          const token = this.$store.getters.token;
          let _this = this;
          var config={
            method:'post',
            url: "/backend/mobileSellerShop/checkOldPassword.do",
            params:{shopId: shopId,token: token, oldPassword: value},
            requestHeader:{'Content-Type':'application/json'}
          }
          axios(config).then(res => {
            if(res.data.code == 0){
              this.status.oldPass = false;
              callback(new Error('旧密码错误'));
            } else if(res.data.code == 1){
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
        }else if(value.length < 6 || value.length > 20) {
          this.status.pass = false;
          callback(new Error('密码长度应在6位-20位之间'));
        }else if(value == this.ruleForm.oldPass) {
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
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          oldPass: [
            { validator: validOldPass, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm() {
            let status = this.status.pass && this.status.checkPass && this.status.oldPass;
            if(status){
              console.log('success');
              const shopId = this.$store.getters.shopId;
              const token = this.$store.getters.token;
              resetPwd(shopId, token, this.ruleForm.oldPass, this.ruleForm.pass).then(res => {
                if(res.code == 1){
                  console.log('success')
                  this.$router.push({ path: '/' });
                }
              }).catch(error => {
                console.log(error)
                return;
              });
            }else
              console.log('faild');
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }
  }
</style>
