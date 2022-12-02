<template>
    <div class="one-title">
        <div class="tips"></div>
        <div class="title">{{ title }}</div>
        <div class="tips right"></div>
    </div>
</template>
<script>
export default {
    name: "OneTitle",
    props: {
        title: String
    }
}
</script>
<style lang="less" scoped>
.one-title {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;

    .title {
        font-size: 20px;
        line-height: 2;
        font-weight: bold;
        margin: 0 20px;
    }

    .tips {
        width: 126px;
        height: 2px;
        background-color: #3babde;
        border-radius: 2px;
        position: relative;
        top: -3px;

        &::before {
            content: '';
            width: 36px;
            height: 2px;
            background-color: #3babde;
            border-radius: 6px;
            position: absolute;
            top: 6px;
            right: 0;
        }

        &::after {
            content: '';
            width: 20px;
            height: 2px;
            background-color: #3babde;
            border-radius: 6px;
            position: absolute;
            top: 6px;
            right: 44px;
        }

        &.right {
            width: 100px;

            &::before {
                width: 50px;
                left: 0;
                right: auto;
            }

            &::after {
                top: 0;
                left: 105px;
                width: 15px;
                right: auto;
            }
        }
    }
}
</style>