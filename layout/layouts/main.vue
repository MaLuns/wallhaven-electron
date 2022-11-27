<template>
    <div class="app">
        <layout-aside></layout-aside>
        <main class="main">
            <layout-header></layout-header>
            <div class="component">
                <transition name="slide-fade">
                    <keep-alive>
                        <router-view class="page-component"></router-view>
                    </keep-alive>
                </transition>
            </div>
        </main>
        <img-view :data="view"></img-view>
        <div class="app-bg"></div>
    </div>
</template>

<script>
import LayoutAside from "./layout-aside"
import LayoutHeader from "./layout-header"

export default {
    name: "App",
    components: {
        LayoutAside,
        LayoutHeader
    },
    data() {
        return {
            view: {}
        };
    },
    mounted() {
        this.$root.$on("imgview", (data) => this.view = data);
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

    .main {
        flex: 1;
        overflow: hidden;

       
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
        background-image: url(../assets/bg.jpg);
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