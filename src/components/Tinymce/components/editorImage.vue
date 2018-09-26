<template>
    <div class="upload-container">
        <el-button icon='upload' :style="{background:color,borderColor:color}" @click=" dialogVisible=true"
                   type="primary">上传图片
        </el-button>
        <el-dialog v-model="dialogVisible">
            <el-upload
                    class="editor-slide-upload"
                    action="/backend/mobileUpload/uploadImg.do"
                    :multiple="true"
                    :data="upLoadObj"
                    :name="fileType"
                    :file-list="fileList"
                    :show-file-list="true"
                    list-type="picture-card"
                    :on-remove="handleRemove"
                    :on-success="handleSuccess"
                    :before-upload="beforeUpload"
            >
                <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </el-dialog>
    </div>
</template>
<script>
    import lrz from 'lrz'
    import { uploadImg } from '@/api/goodslist'

    export default {
        name: 'editorSlideUpload',
        props: {
            color: {
                type: String,
                default: '#20a0ff'
            }
        },
        data() {
            return {
                dialogVisible: false,
                listObj: {},
                fileList: [],
                imageFile: '',
                upLoadObj: {
                    'from': 'goods'
                },
                fileType: 'file',
                imageFileList: []
            }
        },
        methods: {
            checkAllSuccess() {
                return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
            },
            handleSubmit() {
                const arr = Object.keys(this.listObj).map(v => this.listObj[v]
            )
                if (!this.checkAllSuccess()) {
                    this.$message('请等待所有图片上传成功 或 出现了网络问题，请刷新页面重新上传！')
                    return
                }
                console.log(arr)
                this.$emit('successCBK', arr)
                this.listObj = {}
                this.fileList = []
                this.dialogVisible = false
            },
            handleSuccess(response, file, fileList) {
                let _this = this
                for (let i = 0; i < _this.imageFileList.length; i++) {
                    for (let j = 0; j < fileList.length; j++) {
                        if (_this.imageFileList[i].uid == fileList[j].uid && fileList[j].response.data ) {
                            const uid = fileList[j].uid
                                _this.listObj[uid] = {hasSuccess: true, url: fileList[j].response.data.url, uid: uid, width: _this.width, height: _this.height}
                        }
                    }
                }
            },
            handleRemove(file) {
                const uid = file.uid
                const objKeyArr = Object.keys(this.listObj)
                for (let i = 0, len = objKeyArr.length; i < len; i++) {
                    if (this.listObj[objKeyArr[i]].uid === uid) {
                        delete this.listObj[objKeyArr[i]]
                        return
                    }
                }
            },
            beforeUpload(file) {
                console.log(file)
                this.imageFile = file
                const isJPG = file.type === 'image/jpeg'
                const isPNG = file.type === 'image/png'
                const isGIF = file.type === 'image/gif'
                const isLt2M = file.size / 1024 / 1024 < 1

                if (!isJPG && !isPNG && !isGIF) {
                    this.$message.error('上传图片只能是 png/jpg/gif 格式!');
                    return false
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 1MB!');
                    return false
                }

                this.imageFileList.push(file)
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .upload-container {
    .editor-slide-upload {
        margin-bottom: 20px;
    }
    }
</style>
