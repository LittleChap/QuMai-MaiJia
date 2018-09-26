<template>
    <div class="freight-template">
        <div class="title">
            <router-link :to="{ path: 'freightsetting', query:{id: 0} }">
                <el-button icon="plus" type="text">添加</el-button>
            </router-link>
        </div>
        <el-table
                border
                class="goods"
                :data="templateArray"
                style="width: 100%">
            <el-table-column
                    align="center"
                    prop="sort"
                    label="排序"
                    width="150">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="templateName"
                    label="运费模板名称">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="isOpen"
                    label="启用"
                    width="150">
                <template scope="scope">
                    <el-button type="text" size="small" :icon="scope.row.openType" @click="changeOpenStatus(scope.$index)"></el-button>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="state"
                    label="操作"
                    width="220">
                <template scope="scope">
                    <router-link :to="{ path: 'freightsetting', query:{ id: scope.row.templateId } }">
                        <el-button size="small" icon="edit">编辑</el-button>
                    </router-link>
                    <el-button size="small" icon="delete" @click="delFreightTemp(scope.row.templateId)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="isDialogTable" style="width: 1000px;margin: 0 auto;">
            <p style="width: 400px;padding-left: 15px">仍有商品使用该运费模版，若想继续删除则需将这些商品转移至其他运费模版：</p>
            <el-radio-group v-model="radio" @change="changeRadio">
                <el-radio style="display: block;margin-left: 15px" class="radio" v-model="radio" label="1">我不想删除了</el-radio>
                <el-radio style="display: block;margin-top: 10px;" class="radio" v-model="radio" label="2">仍想删除，转移至其他模版</el-radio>
            </el-radio-group>
            <div v-show="isShowSelect" style="margin-top: 20px;padding-left: 15px">
                <span>运费模板选择：</span>
                <el-select size="small" placeholder="请选择其他模板" v-model="selectInfo">
                    <el-option
                            v-for="item in templateInfos"
                            :key="item.templateId"
                            :label="item.templateName"
                            :value="item.templateId">
                    </el-option>
                </el-select>
            </div>
            <div style="margin-top: 20px;text-align: center">
                <el-button type="primary" style="width: 80px;" @click="sureDelete">确定</el-button>
                <el-button type="primary" style="width: 80px;" @click="isDialogTable=false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
    import { listLogisticsTemplate, deletedLogisticsTemplate, confirmDeleteLogisticsTemplate, editSimpleInfo } from '@/api/freight'

    export default {
        data() {
            return {
                isDialogTable: false,
                radio: '1',
                isShowSelect: false,
                templateArray: [],
                // 选择后模板的值
                selectInfo: '',
                // 模板信息
                templateInfos: [],
                // 要删除的那个id
                oldId: '',
                // 是否确认删除
                isConfirmDelete: 0
            }
        },
        methods: {
            // 获取运费列表
            getTemplataList() {
                this.templateInfos = []
                let data = {
                    token: this.$store.getters.token,
                    shopId: this.$store.getters.shopId
                }
                listLogisticsTemplate(data).then((res) => {
                    this.templateArray = res.logisticsTemplateArray
                    for (let i = 0; i<this.templateArray.length; i++) {
                        if (this.templateArray[i].isOpen == 1) {
                            this.templateArray[i].openType = 'check'
                        } else {
                            this.templateArray[i].openType = 'close'
                        }
                    }
                }).catch(() => {
                    return
                })
            },
            // 确认删除中的radio选择
            changeRadio(value) {
                if (value == '2') {
                    this.isShowSelect = true
                    this.isConfirmDelete = 1
                } else {
                    this.isShowSelect = false
                    this.isConfirmDelete = 0
                }
            },
            // 确认删除
            sureDelete() {
                let data
                if (this.isConfirmDelete == 0) {
                    data = {
                        token: this.$store.getters.token,
                        shopId: this.$store.getters.shopId,
                        sourceTemplateId: this.oldId,
                        isConfirmDelete: this.isConfirmDelete
                    }
                } else {
                    if (this.templateInfos == undefined) {
                        this.$message.error('暂时没有可转移的运费模版')
                        return
                    }
                    if (this.selectInfo == '') {
                        this.$message.error('您还未选择要转移的运费模板')
                        return
                    }
                    data = {
                        token: this.$store.getters.token,
                        shopId: this.$store.getters.shopId,
                        sourceTemplateId: this.oldId,
                        isConfirmDelete: this.isConfirmDelete,
                        targetTemplateId: this.selectInfo
                    }
                }
                confirmDeleteLogisticsTemplate(data).then(res => {
                    if (res.code == 1) {
                        // 关闭确认删除对话框
                        this.isDialogTable = false
                        if (this.isConfirmDelete == 0) {
                            this.$message({
                                type: 'success',
                                message: '已取消删除!'
                            });
                        } else {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }
                        // 把选择模板清空
                        this.selectInfo = ''
                        // 重新请求运费模板列表
                        this.getTemplataList()
                    } else {
                        this.$alert(res.message)
                    }
                }).catch(() => {
                    return
                })
            },
            delFreightTemp(id) {
                this.oldId = id
                // 使用messagebox中的确认消息和自定义组合
                this.$confirm('是否删除此运费模版?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 判断此模板是否被用
                    // 请求删除接口
                    let data = {
                        token: this.$store.getters.token,
                        shopId: this.$store.getters.shopId,
                        templateId: id
                    }
                    deletedLogisticsTemplate(data).then(res => {
                        if (res.code == 1) {
                            console.log(res.isDeletable)
                            if (res.isDeletable == 1) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.getTemplataList()
                            } else {
                                this.templateInfos = res.logisticTemplateArray
                                // 打开确认删除对话框
                                this.isDialogTable = true
                            }
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
            },
            // 改变模板启用状态
            changeOpenStatus(index){
                // 判断原来的状态是否启用
                var status;
                if (this.templateArray[index].isOpen == 1) {
                    status = 0;
                } else {
                    status = 1;
                }
                let data = {
                    token: this.$store.getters.token,
                    shopId: this.$store.getters.shopId,
                    templateId: this.templateArray[index].templateId,
                    isOpen: status
                }
                editSimpleInfo(data).then(res => {
                    console.log(res)
                    if (res.code == 1) {
                        if (status == 1) {
                            this.templateArray[index].isOpen = 1
                            this.templateArray[index].openType = 'check'
                            this.$message('已启用')
                        } else {
                            this.templateArray[index].isOpen = 0
                            this.templateArray[index].openType = 'close'
                            this.$message('已禁用')
                        }
                        this.$set(this.templateArray, index, this.templateArray[index])
                    } else {
                        this.$alert(res.code)
                    }
                }).catch(() => {
                    return
                })
            }
        },
        created() {
            this.getTemplataList()
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .freight-template{
        padding: 20px 30px;
        min-width:1224px;
        .title{
            height: 50px;
            border: 1px solid #dfe6ec;
            line-height: 50px;
            margin-bottom: -1px;
            .el-button{
                padding-left: 5px;
            }
        }
    }
</style>
