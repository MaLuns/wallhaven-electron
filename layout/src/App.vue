<template>
    <div id="app" class="app">
        <aside class="aside">
            <div class="logo">
                <img draggable="false" :src="logo" alt />
                <div>One Wallhaven</div>
            </div>
            <aside-nav @change="handleClick"></aside-nav>
        </aside>
        <main class="main">
            <div class="main-header">
                <nav-stuats :title="title"></nav-stuats>
            </div>
            <div class="component">
                <transition name="slide-fade">
                    <keep-alive exclude="AboutPage">
                        <component :key="cname" :is="cname" class="page-component"></component>
                    </keep-alive>
                </transition>
            </div>
        </main>
        <img-view :data="view"></img-view>
        <div class="app-bg" :class="cname"></div>
    </div>
</template>

<script>
    import logo from "@/assets/logo.svg";
    export default {
        name: "App",
        data() {
            return {
                logo,
                title: "热门推荐",
                cname: "HotPage",
                include: ['people', 'acg', 'hot'],
                view: {}
            };
        },
        mounted() {
            this.$root.$on("imgview", (data) => this.view = data)
        },
        methods: {
            handleClick({ url, title, component }) {
                this.title = title;
                this.cname = component;
            }
        }
    };
</script>

<style lang="less" scoped>
    .app {
        font-size: 12px;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        display: flex;
        box-shadow: 8px 8px 10px grey;

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

        .main {
            flex: 1;
            overflow: hidden;

            .main-header {
                height: 40px;
                color: #fff;
            }

            .component {
                height: calc(100% - 40px);
                position: relative;

                .page-component {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
            }
        }

        .app-bg {
            position: absolute;
            width: 100vw;
            height: 100vh;
            background-color: #0c0e29;
            background-image: url(./assets/bg.jpg);
            background-size: 100% 100%;
            top: 0;
            left: 0;
            z-index: -1;
            transition: background 0.8s;

            &::before {
                content: "";
                position: absolute;
                width: 100vw;
                height: 100vh;
                top: 0;
                left: 0;
                backdrop-filter: blur(20px);
            }
        }
    }

    .slide-fade-leave-active,
    .slide-fade-enter-active {
        transition: all 0.4s;
    }

    .slide-fade-enter,
    .slide-fade-leave-to {
        overflow: hidden;
        transform: scale(0.6) translateY(100px);
        opacity: 0;
    }

    .slide-fade-leave-to {
        position: absolute;
    }
</style>