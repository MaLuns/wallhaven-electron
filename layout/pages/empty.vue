<template>
    <div class="empty">
        <img :src="empty" alt draggable="false" />
        <div class="mt20">{{ title }}</div>
    </div>
</template>

<script>
import empty from "@/assets/empty.png"

export default {
    data() {
        return {
            empty
        }
    },
    props: {
        title: {
            type: String,
            default: "功能开发中 ~"
        }
    }
}
</script>

<style lang="less" scoped>
.empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 600px;
    flex-direction: column;
    font-size: 16px;
    line-height: 30px;
}
</style>