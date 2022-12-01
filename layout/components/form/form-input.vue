<template>
    <div class="input" :class="{
        prepend: !!$slots.prepend,
        append: !!$slots.append
    }">
        <div class="input-prepend" v-if="$slots.prepend">
            <slot name="prepend"></slot>
        </div>
        <input :type="type" :placeholder="placeholder" @input="$emit('input', $event.target.value)" />
        <div class="input-append" v-if="$slots.append">
            <slot name="append"></slot>
        </div>
    </div>
</template>
<script>
export default {
    name: "FormInput",
    props: {
        type: {
            type: String,
            default: 'text'
        },
        placeholder: {
            type: String,
            default: ''
        }
    }
}
</script>
<style lang="less" scoped>
.input {
    display: flex;

    input {
        background: transparent;
        padding: 0 0.5em;
        width: 100%;
        height: 28px;
        border-radius: 4px;
        color: var(--font-color);
        border: 1px solid var(--form-border-color-base);

        &:hover {
            border-color: var(--form-border-active-color-base);
        }

        &:focus {
            outline-offset: 0px;
            outline: none;
            border-color: var(--form-border-active-color-base);
        }

        &::placeholder {
            font-size: 0.9em;
            color: var(--font-color2);
        }
    }

    &.prepend {
        input {
            vertical-align: middle;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            border-left: 0;
        }
    }

    &.append {
        input {
            vertical-align: middle;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
            border-right: 0;
        }
    }

    .input-prepend,
    .input-append {
        color: var(--input-append-font-color);
        background-color: var(--input-append-bg-color);
        border: 1px solid var(--input-append-border-color);
        border-radius: 4px;
        height: 28px;
        line-height: 28px;
        white-space: nowrap;
        cursor: pointer;
    }

    .input-prepend {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }

    .input-append {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
}
</style>