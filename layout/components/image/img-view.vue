<template>
    <div v-if="show" class="animation-content" ref="animationContent">
        <!-- <div style="backdrop-filter:blur(20px);position: absolute;width: 100%;height: 100%;"></div> -->
        <div class="img-view" ref="imgContent" v-loading="loading">
            <img @error="handleError" ref="img" draggable="false" v-dragwidth :style="imgStyle" :src="path" />
            <div class="zoom-bage">{{ zoom }}</div>
        </div>
        <div class="btns">
            <div @click="handleClose" class="iconfont icon-guanbi"></div>
            <div title="还原" class="iconfont icon-huifu" @click="handleRef"></div>
            <div title="下载" class="iconfont icon-xiazai" @click="handleDownFile()"></div>
            <div title="设为壁纸" class="iconfont icon-tupian" @click="handleSetwallpaper()"></div>
            <div title="取消收藏" v-if="getCollection(data.id)" @click="handleRemoveCollection(data)"
                class="iconfont icon-collection-b shoucang"></div>
            <div title="收藏" v-else @click="handleAddCollection(data)" class="iconfont icon-collection-b"></div>
        </div>
    </div>
</template>

<script>
import { aspectRatioToWH, getTime } from "@/libs/util";
import { setWallpaper } from "@/libs/send";
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
            imgStyle: {
                width: 0,
                height: 0,
                transform: 0
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
            handler() {
                this.init()
            }
        }
    },
    mounted() {
        const resize = () => {
            let { height, width } = document.documentElement.getBoundingClientRect()
            this.clientWidth = width;
            this.clientHeight = height;
        }

        resize()

        window.addEventListener('resize', resize)
        this.$once("hook:beforeDestroy", () => {
            window.removeEventListener("resize", resize);
        });
    },
    methods: {
        init() {
            let { thumbs_height, thumbs_width, original, dimension_x, dimension_y, path, ratio, rect } = this.data;
            let { clientWidth, clientHeight } = this
            this.show = true;
            this.path = original;
            this.originalW = dimension_x;
            this.imgStyle = {
                width: thumbs_width + 'px',
                height: thumbs_height + 'px',
                transform: `translate(${(clientWidth - thumbs_width) / 2}px, ${(clientHeight - thumbs_height) / 2}px)`
            }

            this.$nextTick(() => {
                const keyframes = [
                    { transform: `translate(${rect.x}px, ${rect.y}px)` },
                    { transform: this.imgStyle.transform },
                ]

                const options = {
                    duration: 300,
                    easing: "cubic-bezier(0,0,0.32,1)",
                }

                const animate = this.$refs.img.animate(keyframes, options)

                animate.onfinish = () => {
                    const { width, height } = aspectRatioToWH(clientWidth - 200, clientHeight - 200, ratio, dimension_x, dimension_y)

                    this.loading = true;
                    this.$refs.imgContent.addEventListener("wheel", this.setImgWH);
                    this.minImg = { width, height }
                    this.zoom = parseInt(width / dimension_x * 100)

                    getImgBlod(path).then(res => {
                        this.path = res;
                        setTimeout(() => {
                            this.loading = false;
                            this.imgStyle = {
                                width: width + 'px',
                                height: height + 'px',
                                transform: `translate(${(clientWidth - width) / 2}px, ${(clientHeight - height) / 2}px)`
                            }

                            // this.$refs.animationContent.style['background-color'] = 'rgba(31, 31, 31, .7)';
                            // this.$refs.animationContent.style['backdrop-filter'] = 'blur(20px)';
                        }, 300)

                    }).catch(res => {
                        //this.$message.error('图片加载失败')
                        this.loading = false;
                    })
                };

            })
        },
        //还原位置
        handleRef() {
            let { clientWidth, clientHeight, minImg: { width, height } } = this
            this.imgStyle = {
                width: width + 'px',
                height: height + 'px',
                transform: `translate(${(clientWidth - width) / 2}px, ${(clientHeight - height) / 2}px)`
            }
        },
        // 图片加载失败
        handleError() {
            this.path = errimg;
            this.imgStyle = { width: '600px', h: '600px' }
        },
        // 获取等比高度
        setImgWH(e) {
            let img = this.$refs.img;
            if (img) {
                let { x, y } = img.getBoundingClientRect()

                let { width, height } = this.imgStyle
                width = parseFloat(width.replace('px', ''))
                height = parseFloat(height.replace('px', ''))

                let oX = x + width / 2
                let oY = y + height / 2

                if (e.wheelDeltaY > 0) {
                    width += width * 0.1
                    height += height * 0.1
                } else {
                    width -= width * 0.1
                    height -= height * 0.1
                }

                if (width < this.minImg.width) {
                    width = this.minImg.width;
                }

                if (height < this.minImg.height) {
                    height = this.minImg.height;
                }

                this.imgStyle.width = width + 'px'
                this.imgStyle.height = height + 'px'

                img.style.transform = `translate(${oX - width / 2}px, ${oY - height / 2}px)`

                this.zoom = parseInt(width / this.originalW * 100)
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
        // 设置壁纸
        handleSetwallpaper() {
            this.handleDownFile(this.data, true);
        },
        // 下载
        handleDownFile(item = this.data, isSetWallpaper = false) {
            let { id, path: url, file_size: size, resolution, thumbs: { small } } = item;
            if (/^blob:/.test(this.path)) {
                const downPath = localStorage.getItem('downloads');
                const name = `one- ${id}${url.substr(url.lastIndexOf('.'))}`;
                const a = document.createElement("a")
                a.href = this.path
                a.download = name
                a.click()
                setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 3000)
                const path = downPath + '\\' + name
                this.$root.downDoneFiles.splice(0, 0, { id, resolution, size, small, url, downloadtime: getTime(), path })
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
            return this.$store.collections.has(id)
        },
    },
    directives: {
        dragwidth: {
            bind: function (el, binding, vnode) {
                let odiv = el;
                let x = 0;
                let y = 0;
                let isDown = false;

                odiv.onmousedown = function (e) {
                    if (e.button === 0) {
                        //获取x坐标和y坐标
                        x = e.clientX;
                        y = e.clientY;
                        let rect = odiv.getBoundingClientRect()

                        isDown = true;

                        document.onmousemove = function (e) {
                            if (isDown) {
                                let nx = e.clientX;
                                let ny = e.clientY;
                                vnode.context.imgStyle.transform = `translate(${nx - (x - rect.x)}px, ${ny - (y - rect.y)}px)`
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
    background-color: #102148de;
    position: fixed;
    width: 100vw;
    height: 100vh;
    z-index: 9;
    overflow: hidden;
    /* transition: background-color 1s; */
    /* backdrop-filter: blur(20px); */

    .img-view {
        position: relative;
        width: 100vw;
        height: 100vh;

        img {
            left: 0;
            top: 0;
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
            background: #8ba9ee4f;

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
</style>