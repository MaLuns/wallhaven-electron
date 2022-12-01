import VueRouter from "vue-router";
import Vue from "vue";
import layout from "../layouts/main"
import recommendImg from '../assets/nav/recommend.png'
import wallpaperImg from '../assets/nav/wallpaper.png'
import componentImg from '../assets/nav/component.png'
import myImg from '../assets/nav/my.png'


Vue.use(VueRouter);

export const routes = [
    {
        path: "/",
        component: layout,
        meta: {
            title: "推荐",
            icon: recommendImg
        },
        children: [
            {
                path: "/",
                name: "recommend",
                meta: {
                    title: "推荐",
                },
                component: () => import("../pages/home/index")
            }
        ]
    },
    {
        path: "/wallpaper",
        component: layout,
        meta: {
            title: "壁纸",
            icon: wallpaperImg
        },
        children: [
            {
                path: "/",
                name: "wallpaper",
                meta: {
                    title: "在线壁纸",
                },
                component: () => import("../pages/wallpaper/index")
            }
        ]
    },
    {
        path: "/component",
        component: layout,
        meta: {
            title: "组件",
            icon: componentImg
        },
        children: [
            {
                path: "/",
                name: "component",
                meta: {
                    title: "桌面组件",
                },
                component: () => import("../pages/empty")
            }
        ]
    },
    {
        path: "/local",
        meta: {
            title: "我的",
            icon: myImg
        },
        component: layout,
        children: [
            {
                path: "/",
                name: "collection",
                meta: {
                    title: "我的收藏",
                },
                component: () => import("../pages/collection")
            },
            {
                path: "/download",
                name: "download",
                meta: {
                    title: "下载中心",
                },
                component: () => import("../pages/download")
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