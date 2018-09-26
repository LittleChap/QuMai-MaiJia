<template>
    <div class="container">
        <el-tabs v-model="activeName">
            <el-tab-pane v-for="item in tabMapOptions" :label="item.label" :key='item.key' >
                <!--<keep-alive>-->
                    <tab-pane v-if='activeName==item.key' :type='item.key'></tab-pane>
                <!--</keep-alive>-->
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script type="text/ecmascript-6">
    import tabPane from './components/tabPane.vue'

    export default {
        data() {
            return {
                tabMapOptions: [
                    {label: '全部商品', key: 0},
                    {label: '上架商品', key: 1},
                    {label: '下架商品', key: 2}
                ],
                activeName: this.$route.query.tab || '0'
            };
        },
        methods: {
            handleChange(value) {
                console.log(value);
            }
        },
        components: {
            tabPane
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .container{
        padding: 20px 30px 0 30px;
        min-width: 1124px;
    }
</style>