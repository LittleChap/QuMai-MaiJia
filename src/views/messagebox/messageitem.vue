<template>
  <div class="msg-content">
    <div class="buttons-bar">
      <el-button @click="markReadSel()" type="primary">标记已读</el-button>
      <el-button @click="markDelSel()" type="primary">删除</el-button>
    </div>
    <el-table :data="list" style="width: 100%" @selection-change="handleSelectionChange" v-loading.body="listLoading" element-loading-text="拼命加载中">
      <el-table-column
          type="selection"
          align="center"
          width="50">
      </el-table-column>
      <el-table-column prop="messageStatus" label="" width="60">
        <template scope="scope">
          <div><img v-if="scope.row.messageStatus == 0" class="new-icon" src="./new.png" alt=""></div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="时间" width="174">
        <template scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="messageContent" label="消息内容">
        <template scope="scope">
          <span style="cursor: pointer;" @click="checkMsg(scope.row.messageId,scope.row.orderSn,scope.$index)">{{scope.row.messageContent}}</span>
        </template>
      </el-table-column>
  </el-table>
    <div class="bottom-bar">
      <div class="bottom-left">

      </div>
      <div class="bottom-right">
        <div class="block" v-if="totalResult">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page.sync="currentPage"
                         :page-sizes="[10,20,50]" :page-size="showCount"
                         layout="total, sizes, prev, pager, next, jumper" :total="totalResult">
          </el-pagination>
        </div>
      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import { getList, batchMarkRead, batchfalseDelete, markRead } from '@/api/message';

  export default {
    props: [
      'type'
    ],
    data() {
      return {
        list: null,
        listLoading: true,
        checkList: [],
        isIndeterminate: true,
        checkAll: true,
        multipleSelection: [],
        currentPage: 1,
        totalResult: 0,
        showCount: 10
      }
    },
    computed: {
      test: function () {
        return 10;
      }
    },
    created() {
      this.fetchData();
    },
    methods: {
      checkMsg(messageId,orderSn,index) {
        const shopId = this.$store.getters.shopId;
        const token = this.$store.getters.token;
        markRead(shopId, token, messageId).then(response => {
          this.list[index].messageStatus = 1;
          if(response.messageType == 0){
            this.$confirm(response.messageContent, response.messageTitle, {
              confirmButtonText: '前往订单详情页',
              cancelButtonText: '关闭'
            }).then(() => {
              this.$router.push('/ordermanage/orderDetail?orderSn='+response.orderSn);
            }).catch(error => {
              console.log(error)
              return;
            });
          }else {
            this.$confirm(response.messageContent, response.messageTitle, {
              confirmButtonText: '前往售后详情页',
              cancelButtonText: '关闭'
            }).then(() => {
              this.$router.push('/aftersalesmanage/aftersalesDetail?returnOrderId='+response.returnOrderId);
            }).catch(error => {
              console.log(error)
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
      },
      markReadSel() {
        const shopId = this.$store.getters.shopId;
        const token = this.$store.getters.token;
        let messageIds = this.getSels();
        if(messageIds) {
          batchMarkRead(shopId, token, messageIds).then(response => {
            if(response.code == 1){
              this.$message({
                message: '成功',
                type: 'success'
              });
              this.currentPage = 1
              this.fetchData();

              // 修改store 保存的未读消息
              this.$store.dispatch('GetUnreadMessageList', {shopId: shopId, token:token}).then(() => {
                console.log('保存标记已读消息')
              }).catch(() => {
                return;
              });
              // setTimeout('window.location.reload();',2000);
            }
          }).catch(error => {
            console.log(error)
            return;
          })
        } else {
          this.$message.error('请选择数据');
        }
      },
      markDelSel() {
        const shopId = this.$store.getters.shopId;
        const token = this.$store.getters.token;
        let messageIds = this.getSels();
        if(messageIds){
          this.$confirm('弹窗“确定删除这' + this.multipleSelection.length + '条消息?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            batchfalseDelete(shopId, token, messageIds).then(response => {
              if(response.code == 1){
                this.$message({
                  message: '成功',
                  type: 'success'
                });
                this.currentPage = 1
                this.fetchData();

                // 修改store 保存的未读消息
                this.$store.dispatch('GetUnreadMessageList', {shopId: shopId, token:token}).then(() => {
                  console.log('保存标记已读消息')
                }).catch(() => {
                  return;
                });
                // setTimeout('window.location.reload()',2000);
              }
            })
          }).catch(error => {
            console.log(error)
            return;
          })
        } else {
          this.$message.error('请选择数据');
        }
      },
      getSels() {
        if(this.multipleSelection.length){
          let messageIds = this.multipleSelection[0].messageId;
          if(this.multipleSelection.length > 1){
            for (let i = 1; i<this.multipleSelection.length;i++){
              messageIds += ','+this.multipleSelection[i].messageId;
            }
          }
          return messageIds;
        }else {
          return false;
        }
      },
      fetchData() {
        this.$emit('create');
        this.listLoading = true;
        let data = {
          shopId: this.$store.getters.shopId,
          token: this.$store.getters.token,
          currentPage: this.currentPage,
          type: this.type,
          showCount: this.showCount
        }
        getList(data).then(response => {
          this.list = response.messageArray;
          this.totalResult = response.totalResult;
          this.listLoading = false;
        }).catch(error => {
          console.log(error)
          return;
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSizeChange(val) { // 每页显示条数
        this.showCount = val;
        this.currentPage = 1;
        this.fetchData();
      },
      handleCurrentChange(val) {
        if (val){
          this.currentPage = val;
          this.fetchData();
        }
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .new-icon{
    width:26px;
    vertical-align: middle;
    margin-top:2px;
  }
  .buttons-bar {
    margin-bottom:15px;
  }
  .bottom-bar{
    font-size:0;
    margin-left: 19px;
    margin-top:15px;
    .bottom-left,.bottom-right {
      display: inline-block;
      vertical-align: middle;
      width:50%;
    }
    .bottom-right{
      text-align: right;
    }
    span{
      vertical-align: middle;
    }
  }
</style>
