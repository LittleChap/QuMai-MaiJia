<template>
  <el-form class="setting-form-wrap" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="收货人：" prop="linkMan">
        <el-input v-model="ruleForm.linkMan" :maxlength="50" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item label="收货人电话：" prop="linkTel">
        <el-input v-model="ruleForm.linkTel" :maxlength="50" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item label="收货地址：" prop="linkAddress">
        <el-input type="textarea" :rows="2"  :maxlength="50" v-model="ruleForm.linkAddress" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item >
        <el-button type="primary" @click="toSaveSetting">保 存</el-button>
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>
  </el-form>


</template>

<script type="text/ecmascript-6">
  import {setAfterSaleInfo} from '@/api/aftersalesmanage';
  export default{
    data () {
      let validatePass = (rule, value, callback) => {
        let reg1 = /^(\d{3,4})-(\d{7,8})/;
        let reg2 = /[1][3-9][0-9]{9,9}/
        if (value !== '') {
          if (!reg1.test(value) &&  !reg2.test(value)) {
            callback(new Error('请输入正确的号码格式'));
          }else {
            callback();
          }
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          linkMan: '',
          linkTel: '',
          linkAddress: ''
        },
        rules: {
          linkMan: [
            { min: 0, max: 50, message: '请输入0~50个字符', trigger: 'blur' }
          ],
          linkTel: [
            { validator: validatePass, trigger: 'blur' }
          ],
          linkAddress: [
            { min: 0, max: 50, message: '请输入0~50个字符', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      if (this.$store.getters.afterSaleInfo) {
        let afterSaleInfo = JSON.parse(this.$store.getters.afterSaleInfo) || {}
        this.ruleForm.linkMan = afterSaleInfo.linkMan || '';
        this.ruleForm.linkTel = afterSaleInfo.linkTel || '';
        this.ruleForm.linkAddress = afterSaleInfo.linkAddress || '';
      }
    },
    methods: {
      toSaveSetting () {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            let data = {
              shopId: this.$store.getters.shopId,
              token: this.$store.getters.token,
              linkMan: this.ruleForm.linkMan,
              linkTel: this.ruleForm.linkTel,
              linkAddress: this.ruleForm.linkAddress
            };
            setAfterSaleInfo(data).then(response => {
              this.$store.dispatch('SaveAfterSaleInfo', response.data)
              this.$message({
                type: 'success',
                message: '保存成功！'
              });
            }).catch(() => {
              return;
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .setting-form-wrap{
    padding: 20px 30px;
    min-width:1224px;
  }

</style>

