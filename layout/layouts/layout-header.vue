<template>
    <div class="main-header">
        <div class="title-opt">
            {{ $route.meta.title }}
            <span class="opt-btn iconfont icon-guanbi" @click="TitleClick('close')"></span>
            <span class="opt-btn iconfont icon-zuixiaohua" @click="TitleClick('min')"></span>
        </div>
    </div>
</template>

<script>
export default {
    name: "LayoutHeader",
    methods: {
        TitleClick(type) {
            window.send[type](type);
        }
    }
};
</script>

<style lang="less" scoped>
.main-header {
    height: 40px;
    color: #fff;

    .title-opt {
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        padding: 0 20px;
        -webkit-app-region: drag;
        text-align: center;
        color: #e4e4e4;
        letter-spacing: 2px;
        font-weight: bold;

        .opt-btn {
            font-size: 14px;
            margin-left: 20px;
            color: #b4b4b4;
            float: right;
            -webkit-app-region: no-drag;
            cursor: pointer;

            &:hover {
                color: #38acfa;
            }
        }
    }
}
</style>