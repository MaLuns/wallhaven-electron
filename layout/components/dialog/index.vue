<template>
    <div class="one-dialog-wrapper" v-if="visible" @click="$emit('update:visible', false)">
        <div @click.stop class="one-dialog one-border bottom" :style="{ width }">
            <div class="one-dialog-header">
                <div>
                    <slot name="title">{{ title }}</slot>
                </div>
                <span class="one-btn iconfont icon-guanbi" @click="$emit('update:visible', false)"></span>
            </div>
            <div class="one-dialog-content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "OneDialog",
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        width: String,
        title: String
    }
}
</script>
<style lang="less" scoped>
.one-dialog-wrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    background: var(--mask-bg-color);
    z-index: 2000;

    .one-dialog {
        position: absolute;
        background-color: var(--dialog-bg-color);
        color: var(--dialog-font-color);
        min-width: 350px;
        left: 50%;
        top: 25%;
        transform: translate(-50%);
        box-shadow: var(--dialog-box-shadow);

        .one-dialog-header {
            font-size: 16px;
            padding: 12px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .one-btn {
            cursor: pointer;

            &:hover {
                color: #38acfa;
            }
        }
    }
}
</style>