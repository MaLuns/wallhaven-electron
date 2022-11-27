<template>
    <aside class="aside">
        <div class="logo">
            <img draggable="false" :src="logo" alt />
            <div>One Wallhaven</div>
        </div>

        <ul class="nav">
            <li v-for="(item, index) in routes" :key="index" v-if="!item.meta.hide">
                <div class="nav-title">{{ item.meta.title }}</div>
                <ul>
                    <li :class="{ actice: i.name === $route.name }" v-for="(i, idx) in item.children" :key="idx"
                        @click="handleNav(i)">
                        <i class="iconfont" :class="i.meta.icon"></i>
                        {{ i.meta.title }}
                        <el-badge is-dot v-if="i.name === 'download' && downing"></el-badge>
                    </li>
                </ul>
            </li>
        </ul>
    </aside>
</template>

<script>
import logo from "@/assets/logo.svg";
import { routes } from "@/routers/"

export default {
    name: "LayoutAside",
    data() {
        return {
            logo,
            routes,
            downing: false
        };
    },
    mounted() {
        this.$store.downFiles.onDidAnyChange((newValue) => {
            this.downing = Object.values(newValue).length > 0
        })
    },
    methods: {
        handleNav(i) {
            this.$router.push({
                name: i.name
            })
        }
    }
};
</script>

<style lang="less" scoped>
.aside {
    width: 260px;
    background-color: #201f2908;
    box-shadow: -10px 0 20px 0px #000000c4;
    color: #fff;
    /*  -webkit-app-region: drag; */

    .logo {
        -webkit-app-region: no-drag;
        text-align: center;
        font-size: 20px;
        line-height: 30px;
        font-weight: 700;

        img {
            width: 120px;
            margin-top: 30px;
        }
    }
}

.nav {
    padding: 20px 30px;
    user-select: none;
    /*  -webkit-app-region: no-drag; */

    li {
        list-style: none;
        line-height: 50px;
        padding-left: 20px;
        color: #c6c6c6;
        font-size: 14px;
        position: relative;
        transition: all .3s;

        .nav-title {
            color: #ffffff75;
            font-size: 14px;
        }

        &:hover {
            color: #fefefe;
        }

        li {
            display: inline-block;
            padding: 0 10px;
            margin: 0 18px;
            cursor: pointer;

            &::before {
                content: "";
                position: absolute;
                bottom: 0;
                height: 2px;
                width: 100px;
                left: 0;
                /*  right: 0; */
                /* margin: 0 auto; */
                border-radius: 4px;
                background: linear-gradient(45deg, #0081ff, #22ebff);
                transition: transform 0.85s cubic-bezier(0.215, 0.61, 0.355, 1),
                    opacity 0.85s cubic-bezier(0.215, 0.61, 0.355, 1);
                transform: scaleX(0);
                transform-origin: bottom right;
                opacity: 0;
            }

            &.actice::before {
                transform-origin: bottom left;
                transform: scaleX(1);
                opacity: 1;
                /*  animation: ttt 0.8s forwards; */
            }

            @keyframes ttt {
                0% {
                    width: 10%;
                }

                100% {
                    width: 100%;
                }
            }
        }
    }
}
</style>