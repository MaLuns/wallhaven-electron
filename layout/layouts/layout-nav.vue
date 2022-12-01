<template>
    <div class="layout-nav">
        <slot></slot>
        <ul class="nav-wrapper">
            <div class="iconfont icon-fanhui back" @click="handleBack" v-show="isBack">

            </div>
            <li class="nav-item" :class="{ active: index === navIndex }" v-for="(item, index) in routes" :key="index"
                v-if="!item.meta.hide">
                <div class="nav-title" @click="handleChangeNav(item, index)">
                    <img-plus v-if="index === navIndex" :src="item.meta.icon"></img-plus>
                    <span v-else>{{ item.meta.title }}</span>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
import { routes } from "@/routers/"
export default {
    name: "LayoutNav",
    data() {
        return {
            routes,
            navIndex: 0,
            isBack: false
        };
    },
    watch: {
        $route: function (route) {
            routes.forEach((i, index) => {
                if (i.children) {
                    i.children.forEach((c, inx) => {
                        if (route.name === c.name) {
                            this.navIndex = index
                            this.isBack = inx > 0
                        }
                    })
                }
            });
        }
    },
    methods: {
        handleBack() {
            this.$router.go(-1)
        },
        handleChangeNav(item, index) {
            if (index !== this.navIndex) {
                this.navIndex = index
                this.handleNav(item.children[0])
            }
        },
        handleNav(i) {
            this.$router.push({
                name: i.name
            })
        }
    }
}
</script>
<style lang="less" scoped>
.layout-nav {
    /* background-image: url(../assets/header-bg.png);
    background-size: 100%;
    background-repeat: no-repeat; */
    height: var(--layout-header-height);
    color: var(--font-color);

    .nav-wrapper {
        backdrop-filter: blur(20px);
        list-style: none;
        display: flex;
        justify-content: center;
        align-items: center;

        .back {
            position: absolute;
            cursor: pointer;
            left: 20px;
            font-size: 28px;

            &:hover {
                color: var( --button-hover-font-color);
            }
        }

        .nav-item {
            margin-right: 20px;

            .nav-title {
                height: 80px;
                width: 94px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 16px;
                font-weight: 550;
                cursor: pointer;

                &:hover {
                    color: var( --button-hover-font-color);
                }
            }

            .nav-level2 {
                display: none;
                list-style: none;
                font-size: 14px;
                position: absolute;
                left: 0%;
                /* transform: translateX(-50%); */

                li {
                    cursor: pointer;
                    min-width: 100px;
                    line-height: 40px;
                    text-align: center;
                    margin: 0 10px;
                }

                .iconfont {
                    margin-right: 2px;
                }

                .actice {
                    background-image: url(../assets/mini.png);
                    background-repeat: no-repeat;
                    background-position: bottom center;
                    color: #38acfa;
                    font-size: 16px;
                    font-weight: 800;
                }
            }

            &.active {
                .nav-title {
                    color: #38acfa;
                }

                .nav-level2 {
                    position: absolute;
                    display: flex;
                }
            }
        }
    }
}
</style>