<template>
    <div class="checkbox-group">
        <div class="checkbox-button" :class="{ active: isChecked(item.value) }" v-for="item, index in list" :key="index"
            @click="handleCheck(item)">
            {{ item.label }}
        </div>
    </div>
</template>
<script>
export default {
    name: "FormCheckbox",
    model: {
        prop: 'checked',
        event: 'change'
    },
    props: {
        checked: {
            type: Array,
            default: () => ([])
        },
        list: {
            type: Array,
            default: () => ([])
        }
    },
    methods: {
        isChecked(val) {
            return this.checked.findIndex(item => item === val) > -1
        },
        handleCheck(item) {
            let vals = this.checked.filter(v => v !== item.value)
            if (vals.length === this.checked.length) vals.push(item.value)
            this.$emit("change", vals)
        }
    }
}
</script>
<style lang="less" scoped>
.checkbox-group {
    display: flex;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid #33333359;

    .checkbox-button {
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

        &+.checkbox-button {
            border-left: 1px solid #4e4f50;
        }
    }
}
</style>