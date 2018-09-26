<template>
  <div class="container">
    <div class="freight-name">
      <p>*运费模板名称：</p>
      <el-input maxlenght=50 v-model="templateName"></el-input>
      <!--<span class="error-tip red" v-show="templateName===''">该内容不能为空</span>-->
    </div>
    <div class="item-wrap">
      <p>*发货地区：</p>
      <el-cascader
              :options="shippingAddressList"
              v-model="shippingAddress"
              :props="cascaderProps">
      </el-cascader>
    </div>
    <div class="item-wrap sort">
      <p>排序：</p>
      <el-input maxlenght=50 type="number" v-model="sort"></el-input>
    </div>
    <div class="item-wrap pinkage-rule">
      <div class="title">
        <p>包邮规则：</p>
        <el-tooltip effect="dark" content="若勾选，该运费模板的商品邮费将受其它包邮商品影响，需要注意运费成本核算" placement="right-start">
          <div class="tip-text">?</div>
        </el-tooltip>
      </div>
      <el-checkbox v-model="ruleCheckBox">同个订单存在商品包邮时，使用该运费模板的商品一同包邮</el-checkbox>
    </div>
    <div class="item-wrap">
      <p>*运费规则：</p>
      <div>
        <el-radio class="radio" v-model="freightRule" :label="0">自定义运费</el-radio>
        <el-radio class="radio" v-model="freightRule" :label="1">卖家承担运费（全国包邮）</el-radio>
      </div>
    </div>
    <div class="item-wrap" v-show="freightRule == 0">
      <p>*计费方式：</p>
      <div>
        <el-radio class="radio" v-model="valuationRule" :label="0">按重量</el-radio>
        <el-radio class="radio" v-model="valuationRule" :label="1">按件数</el-radio>
        <el-radio class="radio" v-model="valuationRule" :label="2">按体积</el-radio>
      </div>
    </div>
    <div class="item-wrap freight-rule" v-show="freightRule == 0">
      <div>
        <div>
          <el-col style="text-align: left" >
            <div style="position: relative;width: 90px;margin: 0 30px;">地区模板
              <el-tooltip style="position: absolute;right: 0;top: 15px;" effect="dark" content="未设置的地区客户端显示不支持配送"
                          placement="right-start">
                <div class="tip-text">?</div>
              </el-tooltip>
            </div>
          </el-col>
        </div>
        <el-table
                border
                class="goods"
                :data="areaTempInfos"
                style="width: 100%">
          <el-table-column
                  align="center"
                  :label="setLabel('首')"
                  width="140">
            <template scope="scope">
              <div class="el-input el-input--small">
                <input type="text" class="el-input__inner"  v-model="scope.row.firstUnit"
                       @input="moneyInput(scope.row.firstUnit,scope.row, 'firstUnit', false)"
                       @blur="toSetNumber(scope.$index, 'firstUnit', true)">
              </div>
            </template>
          </el-table-column>
          <el-table-column
                  align="center"
                  label="首费（元）"
                  width="140">
            <template scope="scope">
              <div class="el-input el-input--small">
                <input type="text" class="el-input__inner"  v-model="scope.row.firstFee"
                       @input="moneyInput(scope.row.firstFee,scope.row, 'firstFee', true)"
                       @blur="toSetNumber(scope.$index, 'firstFee')">
              </div>
            </template>
          </el-table-column>
          <el-table-column
                  align="center"
                  :label="setLabel('续')"
                  width="140">
            <template scope="scope">
              <div class="el-input el-input--small">
                <input type="text" class="el-input__inner"  v-model="scope.row.continueUnit"
                       @input="moneyInput(scope.row.continueUnit,scope.row, 'continueUnit', false)"
                       @blur="toSetNumber(scope.$index, 'continueUnit', true)">
              </div>
              <!--<span class="error-tip red"
                    v-show="scope.row.fixedFee!==''&&!/^[0-9]*$/.test(scope.row.fixedFee)">该内容必须为正自然数</span>-->
            </template>
          </el-table-column>
          <el-table-column
                  align="center"
                  label="续费（元）"
                  width="140">
            <template scope="scope">
              <div class="el-input el-input--small">
                <input type="text" class="el-input__inner" v-model="scope.row.continueFee"
                       @blur="toSetNumber(scope.$index, 'continueFee')"
                       @input="moneyInput(scope.row.continueFee,scope.row, 'continueFee', true)">
              </div>
            </template>
          </el-table-column>
          <el-table-column
                  align="center"
                  prop="regionsNames"
                  label="配送地区"
          >
            <template class="position" scope="scope">
              <div style="width: 70%;">{{scope.row.regionsNames}}</div>
              <span class="error-tip red" v-show="scope.row.regionsNames===''">请点击编辑地区添加</span>
              <el-button class="select-area" type="text" @click="toEditArea(scope.$index)">编辑地区</el-button>
            </template>
          </el-table-column>
          <el-table-column
                  align="center"
                  prop="state"
                  label="操作"
                  width="100">
            <template scope="scope">
              <el-button @click.native.prevent="delAreaTemp(scope.$index, areaTempInfos)" icon="delete"
                         size="small">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div>
          <el-button id="plus" icon="plus" type="text" size="larget" @click="addAreaTemp">点击添加地区模板</el-button>
        </div>
      </div>
    </div>
    <div class="btns">
      <el-button type="primary" size="larget" @click="saveFreightTemp">确定</el-button>
      <el-button type="primary" size="larget" @click="$router.go(-1)">返回</el-button>
    </div>
    <div class="area-dialog" v-show="dialogAreaVisible">
      <div class="tree-box">
        <div class="title-box">
          <h3>选择配送地区</h3>
          <el-button @click="toCloseArea"><i class="el-icon-close"></i></el-button>
        </div>
        <div class="content-box">
          <div class="title">可选择省、市、区/县</div>
          <el-tree
                  empty-text="数据加载中..."
                  ref="tree"
                  class="box"
                  :data="dataArea"
                  :default-checked-keys="isCheckPotions"
                  show-checkbox
                  :props="defaultProps"
                  @check-change="handleCheckChange"
                  node-key="value">
          </el-tree>

         <!-- <el-tree
                  class="box"
                  ref="tree"
                  node-key="value"
                  :data="dataArea"
                  :props="defaultProps"
                  :load="loadNode"
                  lazy
                  show-checkbox
          >
          </el-tree>-->

          <div class="title">
            <el-checkbox v-model="isAllChecked" @change="selectAll">全选</el-checkbox>
          </div>
        </div>
        <div class="dialog-footer">
          <el-button type="primary" @click="addArea">确 定</el-button>
          <el-button @click="toCloseArea">取 消</el-button>
        </div>
      </div>
    </div>
    <div class="mask" v-show="dialogAreaVisible"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {saveOrEditLogisticsTemplate, getAreaList, getLogisticsTemplate} from '@/api/freight'

  export default {
    data() {
      return {
        shippingAddress: [],  // 发货地的数据
        shippingAddressList: [],  // 发货地列表
        cascaderProps: {
          value: 'value',
          label: 'name',
          children: 'childrenArray'
        },
        sort: '',  // 排序
        ruleCheckBox: false,
        freeShippingRule: 0, // 包邮规则
        freightRule: 0,  // 运费规则    0:自定义运费;1:卖家承担运费
        valuationRule: 0, //计费方式    0:按重量;1:按件数 2.按体积
        areaTempInfos: [  // 地区模板
          {
            firstUnit: 0, // 首重
            firstFee: 0,  // 首费
            continueUnit: 0, // 续重
            continueFee: 0, // 续费
            regionsIds: '',
            regionsNames: ''
          }
        ],
        firstUnit: 0,
        dataArea: [],  // 配送地区的数据
        isCheckedDisable: '',  // 已被选中的字段--> 禁用处理
        isCheckPotions: [],
        defaultProps: {
          children: 'childrenArray',
          label: 'name',
          disabled: 'disabled',
          id: 'value'
        },
        editIndex: null,  // 正在编辑的地区的索引
        dialogAreaVisible: false,
        templateId: '',
        templateName: '',
        isOpen: '',
        isAllChecked: false
      }
    },
    created() {
      if (this.$route.query.id != 0) {
        let data = {
          token: this.$store.getters.token,
          shopId: this.$store.getters.shopId,
          templateId: this.$route.query.id
        }
        getLogisticsTemplate(data).then(res => {
          this.templateName = res.templateName
          this.sort = res.sort
          if (res.freeShippingRule == 0) {
            this.ruleCheckBox = false
          } else {
            this.ruleCheckBox = true
          }
          this.freightRule = res.freightRule
          this.valuationRule = res.valuationRule

          this.shippingAddress=[]
          this.shippingAddress.push(res.provinceId)
          this.shippingAddress.push(res.cityId)

          this.templateId = res.templateId
          this.isOpen = res.isOpen
          this.areaTempInfos = res.templateItemArray
          for (let i = 0; i < this.areaTempInfos.length; i++) {
            this.isCheckedDisable += (this.areaTempInfos[i].regionsIds + ',')
          }
          this.getAreaList()
        }).catch(() => {
          return
        })
      } else {
        this.getAreaList()
      }

    },
    methods: {
      // 金额 和 重量的数字控制
      moneyInput(value, item,itemName, isMoney) {
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
        item[itemName] = value
      },
      // 金额 和 重量  默认为0
      toSetNumber(index, val, isOutZero) {
        if (this.areaTempInfos[index][val] !== '') {
          this.areaTempInfos[index][val] = parseFloat(this.areaTempInfos[index][val])
        }
        if (this.areaTempInfos[index][val] === ''){
          this.areaTempInfos[index][val] = 0
        }
        if (isOutZero && this.areaTempInfos[index][val]<=0) {  // 必须大于0
          if (val == 'firstUnit') {
            switch(this.valuationRule){
              case 0:
                this.$message.error('首重需输入大于0的整数')
                break;
              case 1:
                this.$message.error('首件需输入大于0的整数')
                break;
              case 2:
                this.$message.error('首体需输入大于0的整数')
                break;
            }
          } else if ( val == 'continueUnit' ){
            switch(this.valuationRule){
              case 0:
                this.$message.error('续重需输入大于0的整数')
                break;
              case 1:
                this.$message.error('续件需输入大于0的整数')
                break;
              case 2:
                this.$message.error('续体需输入大于0的整数')
                break;
            }
          }
        }
      },
      // 地区模板的 表头设置
      setLabel(text){
        switch(this.valuationRule){
          case 0:return text+'重（kg）'; break;
          case 1:return text+'件（件）'; break;
          case 2:return text+'体（立方米）'; break;
        }
      },

      // 获得地区数据
      getAreaList() {
        getAreaList().then((res) => {
          // 刷选禁用的
          this.getShippingAddress( JSON.parse(JSON.stringify(res.regionsArray)) );
          let arr = this.isCheckedDisable ? this.isCheckedDisable.split(",") : [];
          this.dataArea = this.toSelectDisabled(arr, res.regionsArray);
        }).catch(() => {
          return
        })
      },
      // 处理发货地数据
      getShippingAddress(regionsArray) {
        for (let i=0; i<regionsArray.length; i++) {
          for (let j=0; j<regionsArray[i].childrenArray.length; j++) {
              delete regionsArray[i].childrenArray[j].childrenArray
          }
          if (!regionsArray[i].childrenArray.length) {
            delete regionsArray[i].childrenArray
          }
        }
        this.shippingAddressList = regionsArray
      },


      // ---- 配送地区
      // 编辑状态中 禁用掉之前选择的
      toSelectDisabled(arr, regionsArray) {
        if (!arr.length) {
          return regionsArray;
        }
        for (let check = 0; check < arr.length; check++) {
          for (let i = 0; i < regionsArray.length; i++) {
            if (arr[check] == regionsArray[i].value) {
              regionsArray[i].disabled = true;
              for (let city=0; city<regionsArray[i].childrenArray.length; city++) {
                regionsArray[i].childrenArray[city].disabled = true;
              }
              break;
            }
            for (let j=0; j<regionsArray[i].childrenArray.length; j++) {
              if (arr[check] == regionsArray[i].childrenArray[j].value) {
                regionsArray[i].childrenArray[j].disabled = true;
                break;
              }
            }
          }
        }
        return regionsArray;
      },
      // 打开编辑地区的弹窗
      toEditArea(index) {
        this.isAllChecked = false;
        this.dialogAreaVisible = true;
        this.editIndex = index;
        this.toSimpleDisabled(this.areaTempInfos[index].checkArr, false); // 将当前的地区禁用取消
        this.isCheckedDisable = '';
        if (this.areaTempInfos[index].regionsNames == '全国大陆') {
          this.isAllChecked = true;
        }
        for (let i = 0; i < this.areaTempInfos.length; i++) {
          if (i !== index) {
            this.isCheckedDisable += (this.areaTempInfos[i].regionsIds + ',')
          }
        }
        this.getCurrentCheck(this.areaTempInfos[index].regionsIds);
      },
      // 获得当前的选中项
      getCurrentCheck(ids) {
        let arr = ids.split(',');
        let checkArr = [];
//        this.$refs.tree.setCheckedKeys(arr);
        for (let j = 0; j < arr.length; j++) {
          for (let i = 0; i < this.dataArea.length; i++) {
            for (let city = 0; city < this.dataArea[i].childrenArray.length; city++) {
              if (arr[j] == this.dataArea[i].childrenArray[city].value || arr[j] == this.dataArea[i].value) {
                this.dataArea[i].childrenArray[city].disabled = false;
                this.dataArea[i].childrenArray[city].checked = true;
                if (arr[j] == this.dataArea[i].childrenArray[city].value) {
                  checkArr.push(this.dataArea[i].childrenArray[city]);
                  break;
                }
              }
            }
            if (arr[j] == this.dataArea[i].value) {
              this.dataArea[i].disabled = false;
              this.dataArea[i].checked = true;
              checkArr.push(this.dataArea[i]);
              break;
            }
          }
        }
        this.$refs.tree.setCheckedNodes(checkArr);
      },
      // 关闭编辑地区的弹窗
      toCloseArea() {
        this.dialogAreaVisible = false;
        this.toSimpleDisabled(this.areaTempInfos[this.editIndex].checkArr, true);
      },
      // 禁用刚被选择的选项
      toSimpleDisabled(arr, bool) {
        if (!arr || !arr.length) {
          return false
        }
        let isCheckedArr = arr;
        for (let i = 0; i < isCheckedArr.length; i++) {
          isCheckedArr[i].disabled = bool;
        }
      },
      // 添加地区
      addArea() {
        let arr = this.$refs.tree.getCheckedNodes();
        let checkArr = this.toSelectName(arr); // 被选中的选项
        let checkName = ''; // 拼接字符串
        let checkId = '';   // 拼接字符串
        for (let i = 0; i < checkArr.length; i++) {
          checkName = checkName + ',' + checkArr[i].name;
          checkId = checkId + ',' + checkArr[i].value;
        }
        checkName = checkName.substr(1);
        checkId = checkId.substr(1);
        if (checkArr.length == this.dataArea.length) {
          let proviceNum = 0;
          for (let i=0; i<checkArr.length; i++) {
            if (checkArr[i].level == 1) {
              proviceNum ++
            }
          }
          if (proviceNum == this.dataArea.length) {
            checkName = '全国大陆';
          }
        }
        let dataObj = this.areaTempInfos[this.editIndex];
        dataObj.regionsIds = checkId;
        dataObj.regionsNames = checkName;
        dataObj.checkArr = this.toSelectDisableName(arr);
        this.areaTempInfos.splice(this.editIndex, 1, dataObj)
        this.dialogAreaVisible = false;
        this.toSimpleDisabled(this.toSelectDisableName(arr), true); // 禁用刚选中的选项
      },
      // 刷选被选中的地区 省>市>区
      toSelectName(data) {
        let arrP = [];
        let arrC = [];
        for (let i = 0; i < data.length; i++) {
          let arr = data[i];
          if (arr.level == 1) { // 省份
            arrP.push(arr)
          } else if (arr.level == 2) {  // 市
            arrC.push(arr)
          }
        }
        // 判断子级是否有被禁用 ---> 父级被禁用
        if (arrP.length > 0) {  // 有省、市、区
          for (let p = 0; p < arrP.length; p++) {
            let isDisabledP = false;
            if (arrP[p].disabled) {
              isDisabledP = true
            }
            for (let c = 0; c < arrC.length; c++) {  // 当有市一级的时候
              let isDisabledC = false;
              if (arrC[c].disabled || isDisabledC) { // 当前的市 被禁用 --》 省被禁用
                if (arrC[c].parent == arrP[p].value) {
                  isDisabledP = true;
                }
                isDisabledC = true;
                arrC.splice(c, 1);
                c--;
              }
            }
            if (!isDisabledP) {  // 在省没有被禁用的情况
              for (let c = 0; c < arrC.length; c++) {
                if (arrC[c].parent == arrP[p].value) {
                  arrC.splice(c, 1);
                  c--
                }
              }
            }
            if (isDisabledP) {
              arrP.splice(p, 1);
              p--
            }
          }
        } else if (arrC.length > 0) {   // 有市
          for (let c = 0; c < arrC.length; c++) {  // 当有市一级的时候
            let isDisabledC = false;
            if (arrC[c].disabled || isDisabledC) { // 当前的市 被禁用 --》 省被禁用
              isDisabledC = true;
              arrC.splice(c, 1);
              c--;
            }
          }
        }
        return arrP.concat(arrC)

      },// 刷选被选中的地区 省>市>区
      toSelectDisableName(data) {
        let arrP = [];
        let arrC = [];
        for (let i = 0; i < data.length; i++) {
          let arr = data[i];
          if (arr.level == 1 && !arr.disabled) { // 省份
            arrP.push(arr)
          } else if (arr.level == 2 && !arr.disabled) {  // 市
            arrC.push(arr)
          }
        }
        return arrP.concat(arrC)
      },
      // 全选
      selectAll() {
        let arr = []
        if (this.isAllChecked) {
          for (let i = 0; i < this.dataArea.length; i++) {
            this.dataArea[i].checked = this.isAllChecked
            arr.push(this.dataArea[i].value)
          }
        }
        this.$refs.tree.setCheckedKeys(arr)
      },
      // 选择有改变时
      handleCheckChange(data, checked, indeterminate) {
        if(!checked && this.isAllChecked) { // 设置不全选按钮的不选择
          this.isAllChecked = false
        }
        if (checked && !this.isAllChecked) { // 设置全选按钮的选择
          let arr = this.$refs.tree.getCheckedNodes();
          if (arr.length > this.dataArea.length) {
            let checkArr = this.toSelectName2(arr); // 被选中的选项\
            let proviceNum = 0;
            for (let i=0; i<checkArr.length; i++) {
              if (checkArr[i].level == 1) {
                proviceNum ++
              }
            }
            if (proviceNum == this.dataArea.length) {
              this.isAllChecked = true
            }
          }
        }
      },
      // ---- 配送地区 --end
      // 添加地区模板
      addAreaTemp() {
        this.areaTempInfos.push({
          firstUnit: 0, // 首重
          firstFee: 0,  // 首费
          continueUnit: 0, // 续重
          continueFee: 0, // 续费
          regionsIds: '',
          regionsNames: ''
        })
      },
      // 删除地区模板
      delAreaTemp(index) {
        this.$confirm('是否删除该地区模板', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.toSimpleDisabled(this.areaTempInfos[index].checkArr, false); // 将当前的地区禁用取消
          this.areaTempInfos.splice(index, 1)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 添加或者编辑模板
      saveFreightTemp() {
        if (this.templateName == '') {
          this.$message.error('请填写运费模板名称')
          return false
        }
        if (this.shippingAddress.length<2) {
          this.$message.error('请选择发货地区')
          return false
        }
        if (this.sort == '') {
          this.sort = 100
        } else if (!/^[0-9]*$/.test(this.sort)) {
          this.$message.error('排序值请填写正整数')
          return false
        }
        // 包邮规则的判定
        if (this.ruleCheckBox) {
          this.freeShippingRule = 1
        } else {
          this.freeShippingRule = 0
        }
        // 运费规则  // 自定义运费
        let templateItemArray = []
        if(!this.freightRule) {
          for (let i = 0; i < this.areaTempInfos.length; i++) {
            if (this.areaTempInfos[i].firstUnit <= 0 ) {
              switch(this.valuationRule){
                case 0:
                  this.$message.error('首重需输入大于0的整数')
                  return false
                  break;
                case 1:
                  this.$message.error('首件需输入大于0的整数')
                  return false
                  break;
                case 2:
                  this.$message.error('首体需输入大于0的整数')
                  return false
                  break;
              }
            }
            if (this.areaTempInfos[i].continueUnit <= 0 ) {
              switch(this.valuationRule){
                case 0:
                  this.$message.error('续重需输入大于0的整数')
                  return false
                  break;
                case 1:
                  this.$message.error('续件需输入大于0的整数')
                  return false
                  break;
                case 2:
                  this.$message.error('续体需输入大于0的整数')
                  return false
                  break;
              }
            }
            if (this.areaTempInfos[i].regionsIds == '') {
              this.$message.error('请填写地区模板信息')
              return false
            }
            let arr = {
              itemId: this.areaTempInfos[i].itemId || '',
              firstUnit: this.areaTempInfos[i].firstUnit,
              firstFee: this.areaTempInfos[i].firstFee,
              continueUnit: this.areaTempInfos[i].continueUnit,
              continueFee: this.areaTempInfos[i].continueFee,
              regionsIds: this.areaTempInfos[i].regionsIds,
              regionsNames: this.areaTempInfos[i].regionsNames,
            }
            templateItemArray.push(arr)
          }
          // 判断 如果没有填写运费模板规则则提示
          if (templateItemArray.length == 0) {
            this.$message.error('您还未选择地区模板，请先点击添加地区模板')
            return
          }
        }
        let data = {
          token: this.$store.getters.token,
          shopId: this.$store.getters.shopId,
          templateId: this.templateId,
          templateName: this.templateName,
          provinceId: this.shippingAddress[0],
          cityId: this.shippingAddress[1],
          sort: this.sort,
          freeShippingRule: this.freeShippingRule,
          isOpen: this.isOpen,
          freightRule: this.freightRule,
          valuationRule: this.valuationRule,
          templateItemArray: JSON.stringify(templateItemArray)
        }
        saveOrEditLogisticsTemplate(data).then(res => {
          this.$alert('保存成功，点击确定返回运费模板列表').then(() => {
            this.$router.push({path: '/goodsmanage/freighttemplate'})
          })
        }).catch(() => {
          return
        })
      },
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .container{
    min-width:1224px;
    padding: 0 30px 40px;
  }
  .red {
    display: block;
    color: #ff4949;
    height: 20px;
    font-size: 15px;
  }
  .item-wrap{
    margin-top: 40px;
  }
  .freight-name {
    .el-input {
      width: 220px;
    }
  }
  .sort {
    .el-input {
      width: 220px;
    }
  }
  .pinkage-rule {
    .title {
      height: 55px;
      p {
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
        margin-top: 15px;
      }
    }
  }
  .freight-rule {
    .title {
      margin-bottom: 20px;
    }
    .el-col {
      height: 50px;
      text-align: center;
      border: 1px solid #dfe6ec;
      border-bottom: 0;
      line-height: 50px;
      .tip-text {
        float: left;
        width: 20px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        border: 1px solid #1c8de0;
        border-radius: 50%;
        color: #1c8de0;
      }
    }
    .position {
      position: relative;
    }
    .select-area {
      color: cornflowerblue;
      position: absolute;
      top: 4px;
      right: 200px;
    }
  }
  .btns {
    margin-top: 80px;
    text-align: center;
    .el-button {
      width: 100px;
    }
  }
  .area-dialog {
    position: fixed;
    top: 20%;
    left: 0;
    z-index: 3001;
    width: 100%;
    .tree-box {
      width: 30%;
      height: 650px;
      margin: 0 auto;
      background: #ffffff;
      padding: 0 20px;
      .title-box {
        position: relative;
        height: 50px;
        margin-bottom: 20px;
        h3 {
          line-height: 50px;
          margin: 0;
          padding-left: 10px;
        }
        button {
          position: absolute;
          top: 6px;
          right: 0;
          border-width: 0;
        }
      }
    }
    .content-box {
      width: 300px;
      margin: 0 auto;
      border: 1px solid #d1dbe5;
      .title {
        padding-left: 26px;
        line-height: 40px;
        background: #eef1f6;
      }
      .box {
        width: 100%;
        height: 400px;
        overflow: auto;
        border: none;
        border-top: 1px solid #d1dbe5;
      }
    }
    .dialog-footer {
      text-align: center;
      margin-top: 20px;
    }
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 3000;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
  }

</style>
