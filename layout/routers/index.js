import VueRouter from "vue-router";
import Vue from "vue";
import layout from "../layouts/main"

Vue.use(VueRouter);

export const routes = [
    {
        path: "/",
        component: layout,
        meta: {
            title: "在线壁纸",
        },
        children: [
            {
                path: "/",
                name: "home",
                meta: {
                    title: "热门推荐",
                    icon: "icon-remen",
                },
                component: () => import("../pages/hot")
            },
            {
                path: "/acg",
                name: "acg",
                meta: {
                    title: "动漫精选",
                    icon: "icon-erciyuan",
                },
                component: () => import("../pages/acg")
            },
            {
                path: "/people",
                name: "people",
                meta: {
                    title: "人物精选",
                    icon: "icon-meinv",
                },
                component: () => import("../pages/people")
            },
        ]
    },
    {
        path: "/local",
        meta: {
            title: "在线壁纸",
        },
        component: layout,
        children: [
            {
                path: "/",
                name: "collection",
                meta: {
                    title: "我的收藏",
                    icon: "icon-collection-b",
                },
                component: () => import("../pages/collection")
            },
            {
                path: "/download",
                name: "download",
                meta: {
                    title: "下载中心",
                    icon: "icon-xiazai",
                },
                component: () => import("../pages/download")
            },
        ]
    },
    {
        path: "/more",
        meta: {
            title: "更多",
        },
        component: layout,
        children: [
            {
                path: "/about",
                name: "about",
                meta: {
                    title: "关于",
                    icon: "icon-guanyu",
                },
                component: () => import("../pages/about")
            },
        ]
    },
    {
        path: "*",
        meta: {
            hide: true
        },
        component: layout,
        children: [
            {
                path: "/",
                component: () => import("../pages/empty")
            }
        ]
    }
]

const router = new VueRouter({
    mode: "hash",
    routes: routes,
})

export default router