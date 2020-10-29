<template>
    <div class="title-opt">
        {{title}}
        <span class="opt-btn iconfont icon-guanbi" @click="TitleClick('close')"></span>
        <span class="opt-btn iconfont icon-zuixiaohua" @click="TitleClick('min')"></span>
    </div>
</template>

<script>
    const { ipcRenderer } = __non_webpack_require__("electron");
    export default {
        name: "NavStuats",
        props: {
            title: {
                type: String,
                default: ""
            }
        },
        methods: {
            TitleClick(type) {
                ipcRenderer.send(type);
            }
        }
    };
</script>

<style lang="less" scoped>
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
        cursor: url(../../assets/cursor.png);

        .opt-btn {
            font-size: 14px;
            margin-left: 20px;
            color: #b4b4b4;
            float: right;
            -webkit-app-region: no-drag;
        }
    }
</style>