<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <levelbar></levelbar>
    <div class="rightPart">
      <div class="wel-wrapper">{{shopName}}欢迎来到卖家中心！</div>
      <div class="newsBadge"  :class="{'showPopover': unreadMessageList.length}" >
        <div class="newsText" @click="$router.push('/messagebox/index')">
          消息
          <span class="el-badge__content" v-if="unreadMessageList.length">{{unreadMessageList.length || 0}}</span>
        </div>
        <div class="el-popover" x-placement="bottom-end">
          <table class=" messageList">
            <tr v-for="(item, index) in unreadMessageList" :key="index" v-if="index<5" @click="checkMsg(item.messageId)">
              <td>{{item.createTime.substr(5,5)}}</td>
              <td><div>{{item.messageContent}}</div></td>
            </tr>
          </table>
          <div class="popper__arrow"></div>
        </div>
      </div>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu class="user-dropdown" slot="dropdown">
          <router-link class='inlineBlock' to="/">
            <el-dropdown-item>
              返回首页
            </el-dropdown-item>
          </router-link>
          <router-link class='inlineBlock' to="/storemanage">
            <el-dropdown-item>
              修改密码
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item><span @click="logout" style="display:block;">退出登录</span></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

  </el-menu>
</template>

<script>
  import {mapGetters} from 'vuex';
  import Levelbar from './Levelbar';
  import Hamburger from '@/components/Hamburger';
  import {getMessage} from '@/api/index';
  import {markRead } from '@/api/message';

  export default {
    data() {
      return {
        shopName: '',
        messageArray: []
      }
    },
    components: {
      Levelbar,
      Hamburger
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'avatar',
        'unreadMessageList'
      ])
    },
    methods: {
      setUnreadMessageList() {
        // 修改store 保存的未读消息
        this.$store.dispatch('GetUnreadMessageList', {shopId: this.$store.getters.shopId, token:this.$store.getters.token}).then(() => {
          console.log('保存标记已读消息')
        }).catch(() => {
          return;
        });
      },
      toggleSideBar() {
        this.$store.dispatch('ToggleSideBar')
      },
      logout() {
        this.$store.dispatch('FedLogOut').then(() => {
          location.reload();  // 为了重新实例化vue-router对象 避免bug
        });
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
              return;
            });
          }else {
            this.$confirm(response.messageContent, response.messageTitle, {
              confirmButtonText: '前往售后详情页',
              cancelButtonText: '关闭'
            }).then(() => {
              this.$router.push('/aftersalesmanage/aftersalesDetail?returnOrderId='+response.returnOrderId);
            }).catch(error => {
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
      var shopName = this.$store.getters.shopName;
      if (shopName) {
        this.shopName = shopName + '，';
      }
      this.setUnreadMessageList()
      setInterval(()=> {
        this.setUnreadMessageList()
      },30000)
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

  .navbar {
    position: relative;
    min-width: 1224px;
    height: 50px;
    line-height: 50px;
    border-radius: 0 !important;
    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }
    .errLog-container {
      display: inline-block;
      position: absolute;
      right: 150px;
    }
    .screenfull {
      position: absolute;
      right: 90px;
      top: 16px;
      color: red;
    }

  }
  .rightPart {
    position: absolute;
    right: 36px;
    top: 0;
    width: 700px;
    text-align: right;
    .wel-wrapper {
      display: inline-block;
      /*position: absolute;
      right: 90px;*/
      margin: 15px 0 0;
      padding: 0 16px;
      line-height: 20px;
      border-right: 1px solid #d1dbe5;
      transition: color .15s linear;
      color: #48576a;
      font-size: 14px;
      vertical-align: top;
    }
    .newsBadge {
      position: relative;
      display: inline-block;
      padding: 0 16px;
      vertical-align: top;
      cursor: pointer;
      font-size: 14px;
      .newsText{
        /*display: flex;*/
      }
      &.showPopover:hover{
        .el-popover{
          display: block;
        }
      }
      .el-popover{
        display: none;
        right: 0;
        top: 48px;
        margin: 0;
        .popper__arrow{
          right: 16px;
          left: auto;
        }
      }
      .messageList{
        width: 600px;
        text-align: left;
        font-size: 14px;
        color: #1f2d3d;
        line-height: 30px;
        tr{
          &:hover {
            color: #20a0ff;
            background-color: #eef1f6;
          }
        }
        td{
          padding: 0 0 0 10px;
          border: none;
          &:first-child{
            width: 60px;
          }
        }
        div {
          width: 540px;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
      }
    }
    .avatar-container {
      height: 50px;
      display: inline-block;
      /*position: absolute;
      right: 35px;*/
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }


</style>



