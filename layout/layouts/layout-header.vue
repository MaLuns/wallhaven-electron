<template>
    <div class="layout-header">
        <div class="logo">
            <img draggable="false" :src="logo" alt />
            <div>One Wallhaven</div>
        </div>
        <div class="opt">
            <form-popover width="180" ref="popover">
                <div class="opt-btn iconfont icon-caidan" slot="reference"></div>
                <div class="dropdown-extended">
                    <div v-for="item in navs" class="menu-nav" @click="handleNavClick(item.type)">
                        <span class="iconfont" :class="item.icon"></span>
                        <div class="menu-nav-title">{{ (item.title) }}</div>
                    </div>
                </div>
            </form-popover>
            <span class="opt-btn iconfont icon-zuixiaohua" @click="handleTitleClick('min')"></span>
            <span class="opt-btn iconfont icon-guanbi" @click="handleTitleClick('close')"></span>
        </div>
        <ThemeDialog ref="theme"></ThemeDialog>
        <AboutDialog ref="about"></AboutDialog>
        <LogDialog ref="log"></LogDialog>
    </div>
</template>

<script>
import logo from "@/assets/logo.png";
import ThemeDialog from './components/theme'
import AboutDialog from './components/about'
import LogDialog from './components/log'
import { openConfig } from "../libs/send";

export default {
    name: "LayoutHeader",
    components: {
        ThemeDialog,
        AboutDialog,
        LogDialog
    },
    data() {
        return {
            logo,
            navs: [
                {
                    title: '下载',
                    type: 'down',
                    icon: 'icon-xiazai'
                },
                {
                    title: '皮肤',
                    type: 'theme',
                    icon: 'icon-a-huaban2fuben9'
                },
                {
                    title: '设置',
                    type: 'set',
                    icon: 'icon-shezhi'
                },
                {
                    title: '日志',
                    type: 'log',
                    icon: 'icon-xitongrizhi'
                },
                {
                    title: '关于',
                    type: 'about',
                    icon: 'icon-guanyu1'
                }
            ]
        }
    },
    methods: {
        handleTitleClick(type) {
            window.send[type](type);
        },
        handleNavClick(type) {
            this.$refs.popover.doToggle()
            if (type === 'set') {
                openConfig()
            } else if (type === 'down') {
                this.$router.push({
                    name: 'download'
                })
            } else {
                this.$refs[type].doToggle()
            }
        }
    }
};
</script>

<style lang="less" scoped>
.layout-header {
    -webkit-app-region: drag;
    background-color: var(--head-bg-color);
    color: var(--head-font-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
    flex-wrap: nowrap;
    height: 30px;
    line-height: 30px;

    >div {
        flex-shrink: 0;
    }

    .logo {
        width: 160px;
        display: flex;
        align-items: center;
        padding: 0 10px;

        img {
            width: 20px;
            margin-right: 6px;
        }
    }

    .title {
        flex: 1;
        text-align: center;
    }

    .opt {
        width: 160px;
        letter-spacing: 2px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        -webkit-app-region: no-drag;

        .opt-btn {
            font-size: 14px;
            width: 40px;
            text-align: center;
            cursor: pointer;

            &:hover {
                color: #38acfa;
            }
        }
    }
}

.dropdown-extended {
    .menu-nav {
        width: 50px;
        height: 60px;
        margin: 5px;
        cursor: pointer;
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .iconfont {
            color: var(--dialog-font-color);
            font-size: 24px;
        }

        .menu-nav-title {
            line-height: 2;
        }

        &:hover,
        &:hover .iconfont {
            color: var(--button-hover-font-color);
        }
    }
}
</style>