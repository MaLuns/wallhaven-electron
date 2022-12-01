<template>
    <OneDialog title="皮肤" width="400px" :visible.sync="show">
        <div class="theme-wrapper">
            <div v-for="(item, index) in themes" :key="index">
                <div @click="change(item)" :class="{ [item.type]: true, acitve: theme === item.type }"></div>
                <div>{{ item.text }}</div>
            </div>

        </div>
    </OneDialog>
</template>
<script>
export default {
    data() {
        return {
            show: false,
            theme: "",
            themes: [
                {
                    type: 'light',
                    text: '经典白'
                },
                {
                    type: 'dark',
                    text: '炫酷黑'
                }
            ]
        }
    },
    created() {
        this.theme = this.$store.appConfig.get('theme')
    },
    methods: {
        change(item) {
            if (this.theme !== item.type) {
                this.theme = item.type
                this.$store.appConfig.set('theme', item.type)
                document.documentElement.classList.toggle('dark')
            }
        },
        doToggle() {
            this.show = !this.show
        }
    }
}
</script>
<style lang="less" scoped>
.theme-wrapper {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    height: 160px;
    text-align: center;
    line-height: 40px;

    .light {
        background-image: url(../../assets/light.png);
    }

    .dark {
        background-image: url(../../assets/dark.png);
    }

    .light,
    .dark {
        position: relative;
        width: 132px;
        height: 74px;
        border: 2px solid transparent;
        border-radius: 16px;
        cursor: pointer;
        overflow: hidden;

        &.acitve {
            border-color: #3da7fe;

            &::before {
                content: '';
                background-image: url(../../assets/check.png);
                width: 32px;
                height: 32px;
                position: absolute;
                bottom: 0;
                right: 0;
            }
        }
    }
}
</style>