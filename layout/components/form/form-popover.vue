<template>
    <div class="popover">
        <transition :name="transition">
            <div ref="popper" class="popover-content" v-show="showPopper" :style="{ width: width + 'px' }">
                <slot></slot>
            </div>
        </transition>
        <div ref="wrapper">
            <slot name="reference"></slot>
        </div>
    </div>
</template>
<script>
import { on, off } from '@/libs/dom'

export default {
    name: "FormPopover",
    props: {
        placement: {
            type: String,
            default: 'bottom',
            validator: value => ['top', 'bottom', 'left', 'right'].includes(value)
        },
        transition: {
            type: String,
            default: 'fade-in-linear'
        },
        width: {}
    },
    data() {
        return {
            showPopper: false
        }
    },
    mounted() {
        const reference = this.$refs.wrapper.children[0];

        on(reference, "click", this.doToggle)
        on(document, 'click', this.handleDocumentClick);
    },
    destroyed() {
        const reference = this.$refs.wrapper.children[0];

        off(reference, "click", this.doToggle)
        off(document, 'click', this.handleDocumentClick);
    },
    methods: {
        doToggle() {
            this.showPopper = !this.showPopper;
            if (this.showPopper && document.body !== this.$refs.popper.parentElement) {
                document.body.appendChild(this.$refs.popper)
            }

            const { left, top, right, bottom, width, height } = this.$refs.wrapper.getBoundingClientRect();

            switch (this.placement) {
                case 'top':
                    this.$refs.popper.style.left = `${left + width / 2}px`
                    this.$refs.popper.style.top = `${top - 10}px`
                    this.$refs.popper.style.transform = `translate(-50%, -100%)`
                    break;
                case 'bottom':
                    this.$refs.popper.style.left = `${left + width / 2}px`
                    this.$refs.popper.style.top = `${bottom + 10}px`
                    this.$refs.popper.style.transform = `translateX(-50%)`
                    break;
                case 'left':
                    this.$refs.popper.style.left = `${left - 10}px`
                    this.$refs.popper.style.top = `${top + height / 2}px`
                    this.$refs.popper.style.transform = `translate(-100%,-50%)`
                    break;
                case 'right':
                    this.$refs.popper.style.left = `${right + 10}px`
                    this.$refs.popper.style.top = `${top + height / 2}px`
                    this.$refs.popper.style.transform = `translateY(-50%)`
                    break;
                default:
                    break;
            }
        },
        handleDocumentClick(e) {
            const reference = this.$refs.wrapper.children[0];
            const popper = this.$refs.popper;

            if (!this.$el ||
                !reference ||
                this.$el.contains(e.target) ||
                reference.contains(e.target) ||
                !popper ||
                popper.contains(e.target))
                return;
            this.showPopper = false;
        },
    }
}
</script>
<style lang="less" scoped>
.popover-content {
    font-size: 12px;
    color: #aaaaaa;
    background-color: #201b2deb;
    border: 1px solid rgba(65, 63, 63, 0.623);
    word-break: break-all;
    position: absolute;
    padding: 1rem;
    border-radius: 4px;
}
</style>