<template>
    <div class="popover">
        <transition :name="transition">
            <div ref="popper" class="popover-content one-border" :class="locationClass" v-show="showPopper"
                :style="{ width: width + 'px' }">
                <slot></slot>
                <span ref="popperTag" class="popover-content-tag"></span>
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
    computed: {
        locationClass() {
            if (this.placement === "top") {
                return "bottom"
            } else if (this.placement === "left") {
                return "right"
            } else if (this.placement === "right") {
                return "left"
            } else {
                return ""
            }
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
            if (!this.showPopper) return;
            if (this.showPopper && document.body !== this.$refs.popper.parentElement) {
                document.body.appendChild(this.$refs.popper)
            }

            const { left, top, right, bottom, width, height } = this.$refs.wrapper.getBoundingClientRect();

            // 间距
            const gap = 20
            this.$nextTick(() => {
                const docWidth = document.documentElement.clientWidth
                const docHeight = document.documentElement.clientHeight

                const popper = this.$refs.popper
                const popperTag = this.$refs.popperTag

                const { clientWidth, clientHeight } = popper;

                let tb_left = Math.max(left + width / 2, clientWidth / 2 + 20)
                let lr_top = Math.max(top + height / 2, clientHeight / 2 + 20)

                tb_left = Math.min(tb_left, docWidth - (clientWidth / 2 + 20))
                lr_top = Math.min(lr_top, docHeight - (clientHeight / 2 + 20))

                switch (this.placement) {
                    case 'top':
                        popper.style.left = `${tb_left}px`
                        popper.style.top = `${top - gap}px`
                        popper.style.transform = `translate(-50%, -100%)`
                        break;
                    case 'bottom':
                        popper.style.left = `${tb_left}px`
                        popper.style.top = `${bottom + gap}px`
                        popper.style.transform = `translateX(-50%)`

                        popperTag.style.top = `-4px`
                        popperTag.style.left = `${clientWidth / 2 - (tb_left - (left + width / 2))}px`
                        break;
                    case 'left':
                        popper.style.left = `${left - gap}px`
                        popper.style.top = `${lr_top}px`
                        popper.style.transform = `translate(-100%,-50%)`
                        break;
                    case 'right':
                        popper.style.left = `${right + gap}px`
                        popper.style.top = `${lr_top}px`
                        popper.style.transform = `translateY(-50%)`
                        break;
                    default:
                        break;
                }
            })
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
.popover-content-tag {
    position: absolute;
    width: 0px;
    height: 0px;
    border-top: 10px solid #3da7fe;
    border-bottom: 10px solid transparent;
    border-left: 10px solid #3da7fe;
    border-right: 10px solid transparent;
    transform: rotate(45deg) translateX(-50%);
}


.popover-content {
    position: fixed;
    font-size: 12px;
    padding: 1rem;
    word-break: break-all;
    color: var(--dialog-font-color);
    background-color: var(--dialog-bg-color);
    box-shadow: var(--dialog-box-shadow);
    z-index: 10;

    /* &::before {
        width: calc(100% - 10px);
        left: 3px;
        top: 0px;
    }

    &.bottom::before {
        top: auto;
        bottom: 0;
    }

    &.left::before {
        height: 100%;
        width: 6px;
    }

    &.right::before {
        height: 100%;
        width: 6px;
        left: auto;
        right: 0;
    } */
}
</style>