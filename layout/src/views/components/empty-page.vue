/* 空页面
 * @Author: 白云苍狗 
 * @Date: 2020-09-23 20:25:30 
 * @Last Modified by: 白云苍狗
 * @Last Modified time: 2020-09-27 22:54:21
 */
<template>
    <div class="empty">
        <img :src="empty" alt draggable="false" />
        <div>{{title}}</div>
    </div>
</template>

<script>    
    import empty from "@/assets/empty.svg"

    export default {
        name: "EmptyPage",
        data() {
            return {
                empty
            }
        },
        props: {
            title: {
                type: String,
                default: "这里什么也没有 ~"
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
        color: #ffffff55;
        font-size: 16px;
        line-height: 30px;
    }
</style>