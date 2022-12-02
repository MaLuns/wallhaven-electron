<template>
    <div class="app">
        <layout-nav>
            <layout-header></layout-header>
        </layout-nav>
        <main class="main">
            <!-- <transition name="slide-fade"> -->
            <keep-alive>
                <router-view ref="routerView"></router-view>
            </keep-alive>
            <!-- </transition> -->
        </main>
        <img-view :data="view"></img-view>
    </div>
</template>

<script>
import LayoutHeader from "./layout-header"
import LayoutNav from "./layout-nav"

export default {
    name: "App",
    components: {
        LayoutNav,
        LayoutHeader
    },
    data() {
        return {
            view: {
                id: ""
            }
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
    box-shadow: 8px 8px 10px grey;
    background-color: var(--bg-color);

    .main {
        height: calc(100vh - var(--layout-header-height));
        position: relative;
        overflow: hidden;
    }
}

/* .slide-fade-leave-active,
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
} */
</style>