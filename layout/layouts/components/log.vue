<template>
    <OneDialog title="日志" :visible.sync="show" width="400px">
        <div class="logs">
            <ul class="version" v-for="(item, index) in logs" :key="index">
                <h3>
                    <span>{{ item.title }}</span>
                    <span>{{ item.time }}</span>
                </h3>
                <li v-for="(t, i) in item.childer" :key="i">{{ t }}</li>
            </ul>
        </div>
    </OneDialog>
</template>
<script>
import logs from "@/assets/log";
export default {
    data() {
        return {
            show: false,
            logs
        }
    },
    methods: {
        doToggle() {
            this.show = !this.show
        }
    }
}
</script>
<style lang="less" scoped>
.logs {
    height: 280px;
    margin-bottom: 20px;
    overflow-y: auto;
    padding: 0 14px 0 20px;
    margin-right: 6px;
}

.version {
    list-style: none;

    h3 {
        display: flex;
        justify-content: space-between;
        line-height: 2;
    }

    li {
        margin-left: 10px;
        line-height: 26px;
        opacity: .7;
    }

    +.version {
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px dashed var(--border-color);
    }
}
</style>