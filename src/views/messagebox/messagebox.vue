<template>
  <div class="dashboard-container">
    <el-tabs style='margin-top:15px;' v-model="activeName">
      <el-tab-pane v-for="item in tabMapOptions" :label="item.label" :key='item.key' :name="item.key">
        <keep-alive>
          <message-item v-if='activeName==item.key' :type='item.key'></message-item>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
    <div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import messageItem from './messageitem.vue';
  export default {
    data() {
      return {
        tabMapOptions: [
          { label: '全部消息', key: '0' },
          { label: '发货提醒', key: '1' },
          { label: '售后提醒', key: '2' }
        ],
        activeName: '0'
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    },
    components: {
      messageItem
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
