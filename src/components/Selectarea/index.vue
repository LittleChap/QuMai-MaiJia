<template>
    <div>
        <div v-for="(area, index1) in dataArea" class="tree-node" :class="{'is-expanded': area.expanded}">
            <div class="tree-content">
                            <span class="expanded"
                                  :class="{'el-icon-caret-right': !area.expanded, 'el-icon-caret-bottom': area.expanded}"
                                  @click="toExpand(index1)"></span>
                <el-checkbox v-model="area.checked" :disabled="area.disabled"
                             :indeterminate="area.isIndeterminate" @change="handleCheckAllChange(area)">
                    {{area.name}}
                </el-checkbox>
            </div>
            <div class="tree-children" v-show="area.expanded">
                <div v-for="(area, index2) in area.childrenArray" class="tree-node"
                     :class="{'is-expanded': area.expanded} ">
                    <div class="tree-content">
                                    <span class="expanded"
                                          :class="{'el-icon-caret-right': !area.expanded, 'el-icon-caret-bottom': area.expanded}"
                                          @click="toExpand(index1,index2)"></span>
                        <el-checkbox v-model="area.checked" :disabled="area.disabled"
                                     :indeterminate="area.isIndeterminate"
                                     @change="handleCheckAllChange(area)">{{area.name}}
                        </el-checkbox>
                    </div>
                    <div class="tree-children" v-show="area.expanded">
                        <div v-for="(area, index3) in area.childrenArray" class="tree-node"
                             :class="{'is-expanded': area.expanded}">
                            <div class="tree-content">
                                <span class="expanded is-leaf"></span>
                                <el-checkbox v-model="area.checked" :disabled="area.disabled"
                                             :indeterminate="area.isIndeterminate"
                                             @change="handleCheckAllChange(area)">{{area.name}}
                                </el-checkbox>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default{
        props: {
            dataArea: {
                type: Array
            },
            isCheckedDisabled: {
                type: Array
            }
        },
        data() {
            return {
                checkArea: []
            }
        },
        created() {
            this.toSelectDisabled(this.isCheckedDisabled);
            this.toSelectAll();

        },
        watch: {
            isCheckedDisabled() {
                this.toSelectDisabled(this.isCheckedDisabled);
            }
        },
        methods: {
            // 子级的展开与隐藏
            toExpand(index1, index2) {
                let obj = {};
                if (!index2 && index2 != 0) {
                    obj = this.dataArea[index1];
                    obj.expanded = obj.expanded ? false : true;
                    this.dataArea.splice(index1, 1, obj)
                } else {
                    obj = this.dataArea[index1].childrenArray[index2];
                    obj.expanded = obj.expanded ? false : true;
                    this.dataArea[index1].childrenArray.splice(index2, 1, obj)
                }
            },
            // 刷选已被选中的
            toSelectDisabled(arr) {
                let isCheckedArr = arr;
                for (let check = 0; check < isCheckedArr.length; check++) {
                    for (let p = 0; p < this.dataArea.length; p++) { // 省级
                        let province = this.dataArea[p];
                        if (province.id == isCheckedArr[check]) {
                            province.checked = true;
                            province.isChecked = true;
                            province.disabled = true;
                            for (let c = 0; c < province.childrenArray.length; c++) { // 市级
                                let city = province.childrenArray[c];
                                city.checked = true;
                                city.isChecked = true;
                                city.disabled = true;
                                for (let a = 0; a < city.childrenArray.length; a++) { // 区
                                    let area = city.childrenArray[a];
                                    area.checked = true;
                                    area.isChecked = true;
                                    area.disabled = true;
                                }
                            }
                            break;
                        }
                        for (let c = 0; c < province.childrenArray.length; c++) { // 市级
                            let city = province.childrenArray[c];
                            if (city.id == isCheckedArr[check]) {
                                city.checked = true;
                                city.isChecked = true;
                                city.disabled = true;
                                province.disabled = true;
                                for (let a = 0; a < city.childrenArray.length; a++) { // 区
                                    let area = city.childrenArray[a];
                                    area.checked = true;
                                    area.isChecked = true;
                                    area.disabled = true;
                                }
                                break;
                            }
                            for (let a = 0; a < city.childrenArray.length; a++) { // 区
                                let area = city.childrenArray[a];
                                if (area.id == isCheckedArr[check]) {
                                    area.checked = true;
                                    area.isChecked = true;
                                    area.disabled = true;
                                    city.disabled = true;
                                    province.disabled = true;
                                }
                            }

                        }
                        this.dataArea.splice(p, 1, province)
                    }
                }
            },
            // 刷选是否全选， 向上遍历
            toSelectAll(pId, cId) {
                let data = this.dataArea;
                for (let p = 0; p < data.length; p++) {
                    let province = data[p];
                    if (pId){
                        if (province.id != pId){
                            continue;
                        }
                    }
                    let cityCheck = true;
                    for (let c = 0; c < province.childrenArray.length; c++) {
                        let city = province.childrenArray[c];
                        if (cId){
                            if (city.id != cId){
                                continue;
                            }
                        }
                        let areaCheck = true;
                        city.isIndeterminate = false;
                        province.isIndeterminate = false;
                        for (let a = 0; a < city.childrenArray.length; a++) {
                            let area = city.childrenArray[a];
                            if (area.checked) {
                                city.isIndeterminate = true;
                                province.isIndeterminate = true;
                            }
                            if (!area.checked) {
                                areaCheck = false;
                                city.checked = false;
                                province.checked = false;
                            }
                        }
                        if (areaCheck){
                            city.checked = true;
                            city.isIndeterminate = false
                        }
                        if (!city.checked) {
                            cityCheck = false;
                            province.checked = false;
                        }
                    }
                    if (cityCheck){
                        province.isIndeterminate = false;
                        province.checked = true;
                    }
                    this.dataArea.splice(p, 1, province)
                }
            },
            // 刷选被选中的省市级的过滤
            toSelectName() {
                let checkedArr = []; // 被选中的数组
                for (let p = 0; p < this.dataArea.length; p++) {
                    let province = this.dataArea[p];
                    if (province.checked && !province.disabled) {
                        checkedArr.push(province);
                        continue;
                    }
                    for (let c = 0; c < province.childrenArray.length; c++) {
                        let city = province.childrenArray[c];
                        if (city.checked && !city.disabled) {
                            checkedArr.push(city);
                            continue;
                        }
                        for (let a = 0; a < city.childrenArray.length; a++) {
                            let area = city.childrenArray[a];
                            if (area.checked && !area.disabled) {
                                checkedArr.push(area)
                            }
                        }
                    }
                }
                return checkedArr;
            },
            // 选择的处理， 向下遍历
            handleCheckAllChange(obj) {
                if (obj.childrenArray && obj.childrenArray.length) { // 向下遍历
                    for (let c = 0; c < obj.childrenArray.length; c++) {
                        let city = obj.childrenArray[c];
                        city.checked = obj.checked;
                        if (city.childrenArray && city.childrenArray.length) {
                            for (let a = 0; a < city.childrenArray.length; a++) {
                                let area = city.childrenArray[a];
                                area.checked = obj.checked;
                            }
                        }
                    }
                }
                // 向上遍历
                this.toSelectAll(obj.pId, obj.cId);
            },
            add() {
                this.checkArea = this.toSelectName();
                if (!this.checkArea.length){
                    this.$message.error('请至少选择一个地区');
                    return
                }
                this.$emit('checkedArr',this.checkArea)
            }
        }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">

    .tree-node {
        line-height: 30px;
        .tree-children {
            padding-left: 16px;
        }
        .expanded {
            display: inline-block;
            width: 16px;
            padding: 8px 4px;
        }
    }
</style>

