<template>
    <div class="radio-group">
        <div class="radio-button" :class="{ active: item.value === checked }" v-for="item, index in list" :key="index"
            @click="handleCheck(item)">
            {{ item.label }}
        </div>
    </div>
</template>
<script>
export default {
    name: "FormRadio",
    model: {
        prop: 'checked',
        event: 'change'
    },
    props: {
        checked: [Boolean, String, Number],
        list: {
            type: Array,
            default: () => ([])
        }
    },
    methods: {
        handleCheck(item) {
            this.$emit("change", item.value)
        }
    }
}
</script>
<style lang="less" scoped>
.radio-group {
    display: flex;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid #33333359;

    .radio-button {
        cursor: pointer;
        flex: 1;
        text-align: center;
        padding: 6px 14px;
        font-size: 12px;
        font-weight: 500;
        background: #323135;
        color: #a0a0a0;
        white-space: nowrap;
        transition: all .3s cubic-bezier(.645, .045, .355, 1);

        &.active {
            color: #fff;
            background-color: #5a5764;
        }
    }
}
</style>