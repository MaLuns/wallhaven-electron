<template>
    <transition name="message-fade" @after-leave="handleAfterLeave">
        <div class="one-message" :class="type" :style="positionStyle" v-show="visible" @mouseenter="clearTimer"
            @mouseleave="startTimer">
            {{ message }}
        </div>
    </transition>
</template>
<script>
export default {
    name: "OneMessage",
    data() {
        return {
            visible: false,
            message: '',
            duration: 3000,
            type: 'info',
            verticalOffset: 0,
            closed: false,
            timer: null
        }
    },
    computed: {
        positionStyle() {
            return {
                'top': `${this.verticalOffset}px`
            };
        }
    },
    mounted() {
        this.startTimer();
    },
    watch: {
        closed(newVal) {
            if (newVal) {
                this.visible = false;
            }
        }
    },
    methods: {
        handleAfterLeave() {
            this.$destroy(true);
            this.$el.parentNode.removeChild(this.$el);
        },

        close() {
            this.closed = true;
            if (typeof this.onClose === 'function') {
                this.onClose(this);
            }
        },

        clearTimer() {
            clearTimeout(this.timer);
        },

        startTimer() {
            if (this.duration > 0) {
                this.timer = setTimeout(() => {
                    if (!this.closed) {
                        this.close();
                    }
                }, this.duration);
            }
        },
    }
}
</script>
<style lang="less" scoped>
.one-message {
    position: fixed;
    top: 20px;
    right: 20px;
    min-width: 100px;
    padding: 0 1.5em;
    box-sizing: border-box;
    transition: all 0.3s;
    height: 40px;
    line-height: 40px;
    border-radius: 6px;
    text-align: center;
    font-size: 14px;

    &.success {
        background-color: #3a53c2;
        color: #fff;
    }

    &.warning {
        background-color: #fb9a2c;
        color: #fff;
    }

    &.info {
        background-color: #6a7a9a;
        color: #fff;
    }

    &.error {
        background-color: #ff5959;
        color: #fff;
    }
}
</style>