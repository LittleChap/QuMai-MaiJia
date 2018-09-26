<template>
  <div class="wrap commentBox">
    <el-form class="form-wrap" ref="form" :inline="true" :model="form" label-width="84px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="商品名称：">
            <el-input v-model="form.goodsName" style="width: 180px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="订单编号：">
            <el-input v-model="form.orderSn" style="width: 180px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="会员昵称：">
            <el-input v-model="form.memberNickname" style="width: 180px;"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="商品SKU：">
            <el-input v-model="form.sku" style="width: 180px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="评论时间：" class="time-box">
            <el-date-picker type="datetime" placeholder="选择开始时间" v-model="form.commentTimeMin"
                            style="width: 180px;" @change="timeChoose"></el-date-picker>
            -
            <el-date-picker type="datetime" placeholder="选择结束时间" v-model="form.commentTimeMax"
                            style="width: 180px;" @change="timeChoose"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="btn-box">
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查 询</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-table
       class="table-box"
       :data="orderItemCommentArray"
       :default-expand-all=true
       v-loading="loading"
       element-loading-text="拼命加载中"
       style="width: 100%">
      <el-table-column type="expand">
        <template scope="props">
          <el-form label-position="top" class="demo-table-expand">
            <el-form-item label="评分：">
              <el-rate
                 v-model="props.row.grade"
                 disabled
                 text-color="#ff9900"
                 text-template="{value}">
              </el-rate>
            </el-form-item>
            <el-form-item label="评价：">
              <div class="content">{{ props.row.content || '此用户没有填写评价。'}}</div>
              <div>
                <img class="previewImg" v-for="src in props.row.imagesArray" :src="src.image" alt=""
                     @click="toPreview(src.image)">
              </div>
            </el-form-item>
            <el-form-item :label="'卖家回复（'+ props.row.sellerReplyTime +'）：'" class="replay"
                          v-if="props.row.sellerReplyTime">
              <span class="content">{{ props.row.sellerReply }}</span>
            </el-form-item>
            <el-form-item :label="'追评（'+ props.row.contentAppendTime +'）：'"
                          v-if="props.row.contentAppendTime">
              <div class="content">{{ props.row.contentAppend || '此用户没有填写评价。'}}</div>
              <div>
                <img class="previewImg" v-for="src in props.row.imagesAppend" :src="src.image" alt=""
                     @click="toPreview(src.image)">
              </div>
            </el-form-item>
            <el-form-item :label="'卖家回复追评（'+ props.row.sellerReplyAppendTime +'）：'" class="replay"
                          v-if="props.row.sellerReplyAppendTime">
              <span class="content">{{ props.row.sellerReplyAppend }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
         prop="orderSn"
         label="订单编号">
        <template scope="scope">
          <span>{{ scope.row.orderSn }}</span>
        </template>
      </el-table-column>
      <el-table-column
         label="商品名称"
         align="center"
         width="350">
        <template scope="scope">
          <div class="scope-img">
            <img width="60" height="60" :src="scope.row.goodsImageThumbnail" alt="">
            <span>{{ scope.row.goodsName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
         label="规格"
         align="center"
         prop="specName">
      </el-table-column>
      <el-table-column
         label="会员昵称"
         align="center"
         prop="nickname">
      </el-table-column>
      <el-table-column
         label="评价时间"
         align="center"
         prop="commentTime">
      </el-table-column>
      <el-table-column
         align="center"
         label="操作">
        <template scope="scope">
          <span v-if="((scope.row.sellerReplyTime &&  !scope.row.contentAppendTime) || scope.row.sellerReplyAppendTime)">--</span>
          <el-button v-else size="small" icon="edit" @click="toDialogReplay(scope.$index)">回 复</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-box" v-if="listQuery.totalResult">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.currentPage"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.showCount"
                     layout="total, sizes, prev, pager, next, jumper" :total="listQuery.totalResult">
      </el-pagination>
    </div>

    <el-dialog v-model="dialogImageVisible" size="tiny">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <el-dialog title="评价回复" :visible.sync="dialogReplayVisible" size="tiny" class="replay-dialog">
      <el-form class="remark-form">
        <el-form-item label="" :class="{'is-error': replayNum>200}">
          <el-input type="textarea" v-model="replayText" :rows="4" class="input"></el-input>
          <span class="remark-num" :class="{red: replayNum>200}">{{replayNum}}/200</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="toReplay">回 复</el-button>
        <el-button @click="dialogReplayVisible = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script type="text/ecmascript-6">
  import {getCommentList, replayComment} from '@/api/ordermanage';
  import {parseTime} from '@/utils/index';

  export default {
    data() {
      return {
        toReplayObj: {},
        replayIndex: null, // 当前回复的索引
        dialogImageVisible: false,
        dialogImageUrl: '',
        dialogReplayVisible: false,
        form: {
          goodsName: '',
          commentTimeMin: '',
          commentTimeMax: '',
          sku: '',
          orderSn: '',
          memberNickname: ''
        },
        orderItemCommentArray: [],
        listQuery: {
          showCount: 10,
          currentPage: 1,
          totalResult: 0
        },
        replayText: '',
        loading: false
      }
    },

    computed: {
      replayNum() {
        return this.replayText.length
      },
      isCanReplay() { // 判断是否可以回复

      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        let data = {
          shopId: this.$store.getters.shopId,
          token: this.$store.getters.token,
          goodsName: this.form.goodsName,
          commentTimeMin: this.form.commentTimeMin ? parseTime(this.form.commentTimeMin) : '', // 开始时间
          commentTimeMax: this.form.commentTimeMax ? parseTime(this.form.commentTimeMax) : '',   // 结束时间
          sku: this.form.sku,
          orderSn: this.form.orderSn,
          memberNickname: this.form.memberNickname,
          showCount: this.listQuery.showCount || 10,
          currentPage: this.listQuery.currentPage || 1
        };
        let _this = this;
        _this.loading = true;
        getCommentList(data).then(response => {
          this.orderItemCommentArray = response.orderItemCommentArray;
          this.listQuery.totalResult = response.totalResult;
          _this.loading = false;
        }).catch(error => {
          _this.loading = false;
        })
      },
      onSubmit() {
        this.getList();
      },
      timeChoose() {
        if (this.form.commentTimeMin && this.form.commentTimeMax) {
          if (this.form.commentTimeMax < this.form.commentTimeMin) {
            this.$alert('开始时间不能晚于结束时间', {
              confirmButtonText: '确 定',
              type: 'warning',
              callback: () => {
                this.form.commentTimeMin = '';
                this.form.commentTimeMax = ''
              }
            });
          }
        }
      },
      toPreview(src) { //图片放大查看
        this.dialogImageVisible = true;
        this.dialogImageUrl = src;

      },
      toDialogReplay(index) {
        console.log(index)
        this.replayIndex = index
        this.dialogReplayVisible = true;
      },
      toReplay() { //  回复
        if (this.replayNum == 0 || this.replayNum > 200) {
          this.$message({
            showClose: true,
            message: '请输入0~200个字符',
            type: 'error'
          });
          return false;
        }
        this.replayText = this.replayText.replace(/[\r\n]/g, ' ')
        // 判断是追评还是第一次
        let isAppend = (this.orderItemCommentArray[this.replayIndex].contentAppendTime ? 1 : 0 )

        let data = {
          shopId: this.$store.getters.shopId,
          token: this.$store.getters.token,
          orderId: this.orderItemCommentArray[this.replayIndex].orderId,
          sellerReply: this.replayText,
          isAppend: isAppend
        };
        replayComment(data).then(response => {
          this.dialogReplayVisible = false;
          let objData = this.orderItemCommentArray[this.replayIndex];
          if (isAppend === 1) {
            objData.sellerReplyAppend = this.replayText;
            objData.sellerReplyAppendTime = response.time
          } else {
            objData.sellerReply = this.replayText;
            objData.sellerReplyTime = response.time
          }
          this.orderItemCommentArray.splice(this.replayIndex, 1, objData);
          this.replayText = '';
        }).catch(() => {
          return;
        });
      },
      handleSizeChange(val) { // 每页显示条数
        this.listQuery.showCount = val;
        this.listQuery.currentPage = 1;
        this.getList();
      },
      handleCurrentChange(val) { // 修改当前页数
        if (val) {
          this.getList();
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .wrap {
    padding: 20px 30px;
    min-width: 1224px;
  }
  .red {
    color: #ff4949;
  }
  .previewImg {
    cursor: zoom-in;
    cursor: -webkit-zoom-in;
  }
  .table-box {
    img {
      width: 60px;
      height: 60px;
      box-sizing: border-box;
      vertical-align: middle;
      margin: 10px 10px 10px 0;
    }
    .content {
      line-height: 28px;
    }

    .scope-img {
      display: table;
      text-align: left;
      img {
        margin: 10px 10px 10px 0;
        vertical-align: middle;
      }
      span {
        display: table-cell;
        vertical-align: middle;
      }
    }
  }
  .btn-box {
    text-align: right;
    button {
      width: 100px;
    }
  }
  .page-box {
    padding: 10px;
    text-align: right;
    border: 1px solid #dfe6ec;
    margin-top: -1px;
  }

</style>
<style lang="scss" rel="stylesheet/scss">
  .commentBox {
    .el-table {
      .el-table__expand-column {
        width: 0 !important;
        padding: 0;
        margin: 0;
        overflow: hidden;
      }
      .el-table__expand-column .cell {
        width: 0 !important;
        padding: 0;
        margin: 0;
        overflow: hidden;
      }
      .replay {
        label.el-form-item__label {
          color: #ff4949;
        }
      }
    }
    .el-form-item__content {
      line-height: normal;
    }
    .el-time-panel__content {
      height: 190px;
    }
    .form-wrap {
      .el-form-item {
        margin-bottom: 10px;
      }
    }
  }
</style>
