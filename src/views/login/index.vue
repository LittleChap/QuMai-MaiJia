<template>
  <div class="login-wrap">
    <header>
      <div class="head-bar">
        <img src="static/logo-yimu.png" alt="">
        <h1>卖家中心</h1>
      </div>
    </header>
    <section ref="contentWrap" class="content-wrap">
      <div class="fl img-div">
        <img v-show="showImg" :src="showImg" alt="">
      </div>
      <div class="fl content">
        <h2>用户登录</h2>
        <div class="login-container">
          <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left"
                   label-width="0px"
                   class="card-box login-form">
            <el-form-item prop="username">
              <el-input name="text" type="text" v-model="loginForm.username" autoComplete="on"
                        placeholder="账号"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input name="password" type="password" @keyup.enter.native="handleLogin" v-model="loginForm.password"
                        autoComplete="on"
                        placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="loginBtn" :loading="loading" @click.native.prevent="handleLogin">
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </section>
    <footer>
      ©1993-2018 版权所有 厦门特沃兹网络技术有限公司
    </footer>
  </div>

</template>

<script>
  import {getImg} from '@/api/login';

  export default {
    name: 'login',
    data () {
      const validateUser = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入账号'));
        }
        callback();
      };
      const validatePass = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
      };
      return {
        loginForm: {
          username: '',
          password: ''
        },
        loginRules: {
          username: [
            {required: true, trigger: 'blur', validator: validateUser}
          ],
          password: [
            {required: true, trigger: 'blur', validator: validatePass}
          ]
        },
        loading: false,
        showImg: '',
        screenHeight: document.documentElement.clientHeight   // 这里是给到了一个默认值 （这个很重要）
      }
    },
    methods: {
      handleLogin () {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            this.$store.dispatch('Login', this.loginForm).then(() => {
              this.loading = false;
              this.$router.push({path: '/'});
            }).catch(() => {
              this.loading = false;
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      setUI () {
        let spaceHeight = this.screenHeight - 720; // 间隔高度
        if (spaceHeight > 60) {
          this.$refs.contentWrap.style.marginTop = spaceHeight / 2 + 'px';
          this.$refs.contentWrap.style.marginBottom = spaceHeight / 2 + 'px';
        } else {
          this.$refs.contentWrap.style.marginTop = '30px';
          this.$refs.contentWrap.style.marginBottom = '30px';
        }
      }
    },
    mounted () {
      const that = this;
      window.onresize = () => {
        return (() => {
          window.screenHeight = document.documentElement.clientHeight
          that.screenHeight = window.screenHeight
        })();
      };
      this.setUI();
    },
    created () {
      // 获得图片
      getImg().then(response => {
        this.showImg = response.sellerLoginLogo;
      }).catch(() => {
        return;
      });
    },
    watch: {
      screenHeight (val) {
        this.screenHeight = val
        this.setUI()
        /*if (!this.timer) {
            this.screenHeight = val
            this.timer = true
            let that = this
            setTimeout(function () {
                // that.screenWidth = that.$store.state.canvasWidth
                console.log(that.screenHeight)
                that.setUI()
                that.timer = false
            }, 400)
        }*/
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "src/styles/mixin.scss";
  .tips {
    font-size: 14px;
    color: #ff4949;
    margin-bottom: 5px;
  }
  .login-wrap {
    background: #f1f1f1;
  }
  header {
    width: 100%;
    background: #fff;
    height: 120px;
    border-bottom: solid #dcdcdc;
  }
  .head-bar {
    width: 1024px;
    margin: 0 auto;
    padding-top: 20px;
    img {
      float: left;
      padding: 10px 30px;
      height: 80px;
    }
    h1 {
      float: left;
      height: 80px;
      color: #4c9d3e;
      border-left: 1px solid #4c9d3e;
      margin: 0;
      padding-left: 30px;
      line-height: 80px;
      font-weight: 100;
      font-size: 20px;
    }
  }
  .content-wrap {
    width: 1024px;
    margin: 0 auto;
    height: 480px;
    padding: 80px 40px;
    background: #fff;
    border-top: 2px solid #4c9d3e;
    .img-div {
      width: 390px;
      height: 310px;
      margin-right: 124px;
      img {
        width: 390px;
        height: 310px;
        max-height: 310px;
        border: 1px solid #bdbdbd;
      }
    }
    .content {
      width: 300px;
      h2 {
        height: 50px;
        line-height: 50px;
        margin: 0;
        color: #4c9d3e;
        font-weight: 100;
        font-size: 20px;
        text-align: center;
      }
    }
  }
  footer {
    width: 100%;
    height: 120px;
    text-align: center;
    color: #fff;
    background: #333333;
    line-height: 120px;
    font-size: 12px;
  }
  .login-container {
    @include relative;
    input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
      -webkit-text-fill-color: #1f2d3d !important;
    }
    input {
      height: 40px;
      border: 1px solid #bdbdbd;
      font-size: 14px;
      background: transparent;
      -webkit-appearance: none;
      padding: 0 12px;
    }
    .el-input {
      display: inline-block;
      height: 40px;
      width: 100%;
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: #889aa4;
    }
    .el-form-item {
      margin-top: 30px;
      /*border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;*/
      color: #454545;
    }
    .forget-pwd {
      color: #ff4949;
    }
    .loginBtn {
      width: 100%;
      height: 40px;
      background: #4c9d3e;
      border-color: #4c9d3e;
    }
  }
</style>
