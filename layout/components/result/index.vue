<template>
    <div class="empty" :style="{ height: height + 'px' }">
        <img :src="empty" alt draggable="false" />
        <div class="mt20">{{ title }}</div>
    </div>
</template>

<script>
import empty from "@/assets/empty.png"

export default {
    name: "OneResult",
    data() {
        return {
            empty,
        }
    },
    props: {
        height: String,
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
    flex-direction: column;
    font-size: 16px;
    line-height: 30px;
}
</style>