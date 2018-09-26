<template>
    <div class="wrap">
        <el-tabs v-model="activeName">
            <el-tab-pane v-for="item in tabMapOptions" :label="item.label" :key='item.key' :name="item.key">
                <keep-alive>
                    <tab-pane v-if='activeName==item.key' :type='item.code'></tab-pane>
                </keep-alive>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script type="text/ecmascript-6">
    import tabPane from './components/tabPane'
    export default {
        components: {tabPane},
        data() {
            return {
                tabMapOptions: [
                    {label: '全部订单', key: '0', code: 0},
                    {label: '售后中', key: '1', code: 1},
                    {label: '退款成功', key: '2', code: 2},
                    {label: '售后关闭', key: '3', code: 3}
                ],
                activeName: this.$route.query.tab || '0'
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .wrap{
        padding: 20px 30px;
        min-width:1224px;
    }
</style>
