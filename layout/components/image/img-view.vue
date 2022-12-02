<template>
    <div v-if="show" class="animation-content" ref="animationContent">
        <!-- <div style="backdrop-filter:blur(20px);position: absolute;width: 100%;height: 100%;"></div> -->
        <div class="img-view" ref="imgContent">
            <img @error="handleError" ref="img" draggable="false" v-dragwidth :style="imgStyle" :src="path" />
            <div class="zoom-bage">{{ zoom }}</div>
        </div>
        <div class="btns">
            <div @click="handleClose" class="one-button iconfont icon-guanbi"></div>
            <div title="还原" class="one-button iconfont icon-huifu" @click="handleRef"></div>
            <div title="下载" class="one-button iconfont icon-xiazai" @click="() => this.handleDownFile(this.data)"></div>
            <div title="设为壁纸" class="one-button iconfont icon-zhuomian"
                @click="() => this.handleDownFile(this.data, true)"></div>
            <div title="取消收藏" v-if="getCollection(data.id)" @click="handleRemoveCollection(data)"
                class="one-button iconfont icon-collection-b shoucang"></div>
            <div title="收藏" v-else @click="handleAddCollection(data)" class="one-button iconfont icon-collection-b">
            </div>
        </div>
    </div>
</template>

<script>
import { aspectRatioToWH } from "@/libs/util";
import { getImgBlod } from "@/libs/ajax";
import errimg from "@/assets/errimg.svg"
import Minix from './minix'

export default {
    name: "ImgView",
    mixins: [Minix],
    data() {
        return {
            show: false,
            path: '',
            zoom: 0,// 缩放比 %
            imgStyle: {
                width: 0,
                height: 0,
                transform: 'none'
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
            let { thumbs_height = 200, thumbs_width = 300, thumbs, original, dimension_x, dimension_y, path, ratio, rect } = this.data;
            let { clientWidth, clientHeight } = this
            this.show = true;
            this.path = original || thumbs.small;
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

                    this.$refs.imgContent.addEventListener("wheel", this.setImgWH);
                    this.minImg = { width, height }
                    this.zoom = parseInt(width / dimension_x * 100)

                    getImgBlod(path).then(res => {
                        /* setTimeout(() => { */
                        this.imgStyle = {
                            width: width + 'px',
                            height: height + 'px',
                            transform: `translate(${(clientWidth - width) / 2}px, ${(clientHeight - height) / 2}px)`
                        }
                        /* }, 300) */
                        this.path = res;
                        // this.$refs.animationContent.style['background-color'] = 'rgba(31, 31, 31, .7)';
                        // this.$refs.animationContent.style['backdrop-filter'] = 'blur(20px)';

                    }).catch(res => {
                        this.$message.error('图片加载失败')
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
            this.$refs.img.style.transform = this.imgStyle.transform
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
        }
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
    background-color: var(--mask-bg-color);
    position: fixed;
    width: 100vw;
    height: 100vh;
    z-index: 10;
    overflow: hidden;
    top: 0;
    left: 0;

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
            right: 0;
            left: 0;
            margin: 0 auto;
            bottom: 20px;
            color: #cacaca;
            width: 88px;
            text-align: center;
            font-size: 18px;
            font-family: fantasy;
        }
    }

    .btns {
        position: absolute;
        right: 20px;
        top: 50vh;
        transform: translateY(-50%);
        z-index: 9999;

        div {
            margin: 10px 0;
            padding: 16px;
            border-radius: 50%;
            transition: all 0.2s;
            cursor: pointer;

            &.shoucang {
                color: var(--button-plain-font-color);
            }
        }
    }
}
</style>