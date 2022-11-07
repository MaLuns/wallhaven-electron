<template>
    <transition name="slide">
        <div v-if="show" class="animation-content">
            <div class="img-view" ref="imgContent" v-loading="loading">
                <img @error="handleError" ref="img" draggable="false" v-dragwidth :width="img.w" :height="img.h" :src="path" />
                <div class="zoom-bage">{{zoom}}</div>
            </div>
            <div class="btns">
                <div @click="handleClose" class="iconfont icon-guanbi"></div>
                <div title="还原" class="iconfont icon-huifu" @click="handleRef"></div>
                <div title="下载" class="iconfont icon-xiazai" @click="handleDownFile()"></div>
                <div title="设为壁纸" class="iconfont icon-tupian" @click="handleSetwallpaper()"></div>
                <div title="取消收藏" v-if="getCollection(data.id)" @click="handleRemoveCollection(data)" class="iconfont icon-collection-b shoucang"></div>
                <div title="收藏" v-else @click="handleAddCollection(data)" class="iconfont icon-collection-b"></div>
            </div>
        </div>
    </transition>
</template>

<script>
    import { aspectRatioToWH, getTime } from "@/libs/util";
    import { setWallpaper } from "@/libs/downfile";
    import { getImgBlod } from "@/libs/ajax";
    import errimg from "@/assets/errimg.svg"

    export default {
        name: "ImgView",
        data() {
            return {
                loading: false,
                show: false,
                path: '',
                zoom: 0,// 缩放比 %
                img: {
                    w: 0,
                    h: 0
                },
            }
        },
        props: {
            data: {
                type: Object,
                default() {
                    return {}
                }
            }
        },
        watch: {
            data: {
                deep: true,
                handler(val) {
                    let { dimension_x, dimension_y, path, ratio } = val;
                    this.show = true;
                    this.path = val.thumbs.original;//先填充原图等比例的 略缩图
                    this.img = aspectRatioToWH(this.clientWidth - 100, this.clientHeight - 200, ratio, dimension_x, dimension_y)
                    this.originalW = dimension_x;
                    this.zoom = parseInt(this.img.w / dimension_x * 100)
                    this.minImg = { ...this.img }
                    this.loading = true;
                    // 等待动画完成后
                    setTimeout(() => {
                        this.$refs.img.style.left = 'auto'
                        this.$refs.img.style.top = 'auto'
                        this.$refs.imgContent.addEventListener("wheel", this.setImgWH);
                    }, 800);

                    // 获取原始图片
                    getImgBlod(path).then(res => {
                        this.path = res;
                        this.img = aspectRatioToWH(this.clientWidth - 100, this.clientHeight - 200, ratio, dimension_x, dimension_y)
                        this.loading = false;
                    }).catch(res => {
                        //this.$message.error('图片加载失败')
                        console.log(res)
                        this.loading = false;
                    })
                }
            }
        },
        mounted() {
            let { height, width } = document.documentElement.getBoundingClientRect()
            this.clientWidth = width;
            this.clientHeight = height;
        },
        methods: {
            //还原位置
            handleRef() {
                this.$refs.img.style.left = 'auto'
                this.$refs.img.style.top = 'auto'
                this.img = { ...this.minImg }
            },
            // 图片加载失败
            handleError() {
                this.path = errimg;
                this.img = { w: 600, h: 600 }
            },
            // 获取等比高度
            setImgWH(e) {
                let img = this.$refs.img;
                if (img) {
                    let oX = img.offsetLeft + this.img.w / 2
                    let oY = img.offsetTop + this.img.h / 2

                    if (e.wheelDeltaY > 0) {
                        this.img.w += this.img.w * 0.1
                        this.img.h += this.img.h * 0.1
                    } else {
                        this.img.w -= this.img.w * 0.1
                        this.img.h -= this.img.h * 0.1
                    }

                    if (this.img.w < this.minImg.w) {
                        this.img.w = this.minImg.w;
                    }

                    if (this.img.h < this.minImg.h) {
                        this.img.h = this.minImg.h;
                    }

                    img.style.left = (oX - this.img.w / 2) + 'px'
                    img.style.top = (oY - this.img.h / 2) + 'px'

                    this.zoom = parseInt(this.img.w / this.originalW * 100)
                }
            },
            // 关闭
            handleClose() {
                this.show = false;
            },
            // 添加收藏
            handleAddCollection(item) {
                this.$root.AddCollection(item);
                this.$message({
                    message: "收藏成功",
                    type: "success",
                    duration: 2000
                });
            },
            // 移除收藏
            handleRemoveCollection(item) {
                this.$root.removeCollection(item);
                this.$message({
                    message: "取消收藏",
                    type: "success",
                    duration: 2000
                });
            },
            handleSetwallpaper() {
                this.handleDownFile(this.data, true);
            },
            // 下载
            handleDownFile(item = this.data, isSetWallpaper = false) {
                let { id, path: url, file_size: size, resolution, thumbs: { small } } = item;
                if (/^blob:/.test(this.path)) {
                    const downPath = localStorage.getItem('downloads');
                    const name = `one-${id}${url.substr(url.lastIndexOf('.'))}`;
                    const a = document.createElement("a")
                    a.href = this.path
                    a.download = name
                    a.click()
                    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 3000)
                    const path =  downPath + '\\' + name
                    this.$root.downDoneFiles.splice(0, 0, { id, resolution, size, small, url, downloadtime: getTime() , path })
                    if (isSetWallpaper) {
                        setWallpaper(path)
                        this.$message({ message: "设置成功", type: "success", duration: 2000 });
                    } else {
                        this.$message({ message: "下载成功", type: "success", duration: 2000 });
                    }
                } else {
                    this.$root.addDownFile({ id, url, size, resolution, small, _img: item, isSetWallpaper })
                    this.$message({ message: "已加入下载", type: "success", duration: 2000 });
                }
            },
            // 获取收藏状态
            getCollection(id) {
                let collections = this.$root.collections;
                return collections.length > 0 && collections.findIndex(item => id == item.id) !== -1;
            },
        },
        directives: {
            dragwidth: {
                bind: function (el, binding, vnode) {
                    let odiv = el;
                    let x = 0;
                    let y = 0;
                    let l = 0;
                    let t = 0;
                    let isDown = false;

                    odiv.onmousedown = function (e) {
                        if (e.button === 0) {
                            //获取x坐标和y坐标
                            x = e.clientX;
                            y = e.clientY;
                            //获取左部和顶部的偏移量
                            l = odiv.offsetLeft;
                            t = odiv.offsetTop;
                            isDown = true;

                            document.onmousemove = function (e) {
                                if (isDown) {
                                    let nx = e.clientX;
                                    let ny = e.clientY;
                                    odiv.style.left = nx - (x - l) + 'px';
                                    odiv.style.top = ny - (y - t) + 'px';
                                }
                            }

                            document.onmouseup = function () {
                                isDown = false;

                                document.onmousemove = null;
                                document.onmouseup = null;
                            }
                        }
                    }
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .animation-content {
        background: rgba(0, 0, 0, 0.363);
        position: fixed;
        width: 100vw;
        height: 100vw;
        z-index: 9;
        backdrop-filter: blur(20px);
        overflow: hidden;

        .img-view {
            position: absolute;
            width: 100vw;
            height: 100vh;
            top: 0;
            left: 0;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
                position: absolute;
            }

            .zoom-bage {
                position: absolute;
                right: 0px;
                bottom: 10px;
                font-size: 14px;
                color: #fff;
                width: 88px;
                text-align: center;
            }
        }

        .btns {
            position: absolute;
            right: 20px;
            top: 50vh;
            transform: translateY(-50%);
            color: #ffffff9e;
            z-index: 9999;

            div {
                margin: 10px 0;
                padding: 16px;
                border-radius: 50%;
                transition: all 0.2s;
                cursor: pointer;
                background: #0016484f;

                &:hover {
                    background: #38acfa;
                    color: #ffffff;
                }

                &.shoucang {
                    color: #38acfa;
                    &:hover {
                        color: #ffffff;
                    }
                }
            }
        }
    }

    .slide-enter-active {
        transition: all 0.5s, border-radius 0.6s 0.3s;
    }
    .slide-leave-active {
        transition: all 0.6s;
    }

    .slide-enter,
    .slide-leave-to {
        opacity: 0;
        border-radius: 0 0 100vw 0;
        width: 10px;
        height: 10px;
    }

    .slide-leave-to {
        border-radius: 0 0 0 100vw;
        right: 0;
    }
</style>