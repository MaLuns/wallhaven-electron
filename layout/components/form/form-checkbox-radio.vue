<template>
    <div class="checkbox-radio-group" :class="view">
        <div class="checkbox-radio-label" v-if="view === 'view'">
            <slot name="label">{{ label }}</slot>
        </div>
        <div class="checkbox-radio-value" v-if="view === 'view'">
            <div class="checkbox-radio-item" :class="{ active: isChecked(item) }" v-for="item, index in list"
                :key="index" @click="handleClick(item)" :style="{ width }">
                <slot v-bind="{ color: item }">
                    {{ item.label || item }}
                </slot>
            </div>
        </div>
        <template v-else>
            <div class="checkbox-radio-button" :class="{ active: isChecked(item) }" v-for="item, index in list"
                :key="index" @click="handleClick(item)">
                {{ item.label || item }}
            </div>
        </template>
    </div>
</template>
<script>
export default {
    name: "FormCheckboxRadio",
    model: {
        prop: 'checked',
        event: 'change'
    },
    props: {
        label: String,
        checked: {
            type: [Array, String],
            default: () => ([])
        },
        view: {
            type: String,
            default: 'view',
            validator: value => ['view', 'button'].includes(value)
        },
        type: {
            type: String,
            default: 'checkbox',
            validator: value => ['checkbox', 'radio'].includes(value)
        },
        list: {
            type: Array,
            default: () => ([])
        },
        width: String
    },
    watch: {
        type(val) {
            if (val === 'radio') {
                this.$emit('change', '')
            } else {
                this.$emit('change', [])
            }
        }
    },
    methods: {
        isChecked(item) {
            let val = item.value === undefined ? item : item.value

            if (this.type === 'radio') {
                return this.checked === val
            } else {
                let len = this.checked.length
                return len === 0 ? false : this.checked.findIndex(item => item === val) > -1
            }
        },
        handleClick(item) {
            let val = item.value === undefined ? item : item.value

            if (this.type === 'radio') {
                this.$emit('change', val)
            } else {
                let vals = this.checked.filter(v => v !== val)
                if (vals.length === this.checked.length) vals.push(val)
                this.$emit('change', vals)
            }
        }
    }
}
</script>
<style lang="less" scoped>
@import "./checkbox-radio.less";
</style>