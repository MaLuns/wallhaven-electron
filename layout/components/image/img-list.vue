<template>
    <div ref="visibleContainer" class="visible-container" key="visible-container">
        <template v-if="skeleton">
            <li v-for="item in 18" :key="item" class="skeleton">
                <div class="img"></div>
                <div class="desc">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </li>
        </template>
        <template v-else>
            <template v-if="visibleList.length > 0">
                <ul class="visible-list" :style="visibleListStyle">
                    <li ref="imgs" v-for="item in visibleList" :key="item.id" :style="item.style"
                        class="visible-list-item" :id="item.id">
                        <div class="img" :style="{ height: item.thumbs_height + 'px' }">
                            <img-plus :src="item.original" @click="handleView($event, item)"></img-plus>
                            <div class="img-info">
                                <span>{{ item.file_size | byte }}</span>
                                <span>{{ item.resolution }}</span>
                                <span>{{ item.file_type }}</span>
                            </div>
                        </div>
                        <div class="desc">
                            <span title="取消收藏" :key="item.id + 'cxx'" v-if="getCollection(item.id)"
                                @click="handleRemoveCollection(item)"
                                class="iconfont icon-collection-b shoucang"></span>
                            <span title="收藏" :key="item.id + 'cx'" v-else @click="handleAddCollection(item)"
                                class="iconfont icon-collection-b"></span>
                            <span title="设为壁纸" class="iconfont icon-tupian" @click="handleDownFile(item, true)"></span>
                            <span title="下载" class="iconfont icon-xiazai" @click="handleDownFile(item)"></span>
                        </div>
                    </li>
                </ul>
                <div :style="{ height: placeholderHeight + 'px' }" key="placeholder"></div>
            </template>
            <template v-else>
                <!-- <empty-page title="未找到图片信息~"></empty-page> -->
            </template>
        </template>
    </div>
</template>

<script>
import { debounce, toTwoDimensionalArray, minValIndex, maxVal, getTransforms, getRandom } from "@/libs/util";

export default {
    name: "ImgList",
    data() {
        return {
            // 占位高度
            placeholderHeight: 0,
            // 滚动条高度
            scrollTop: 0,
            // 虚拟列表容器可视区大小
            clientHeight: 0,
            clientWidth: 0,
            visibleList: [],
            // 虚拟列表样式
            visibleListStyle: {}
        };
    },
    props: {
        skeleton: {
            type: Boolean,
            default: false
        },
        mode: {
            type: String,
            default: ""
        }
    },
    computed: {
        changeTime: function () {
            return {
                placeholderHeight: this.placeholderHeight,
                scrollTop: this.scrollTop,
                clientHeight: this.clientHeight,
            }
        },
    },
    watch: {
        changeTime: {
            deep: true,
            handler: function () { this.updateVisibleList() },
        },
    },
    beforeCreate() {
        // 单行显示个数
        this.column = 3;
        // 单个元素宽度
        this.width = 300;
        // 间隔
        this.gap = 20;
        // 缓存列表
        this.catchList = [];
        this.catchKeys = {}
        // 缓存下标和滚动高度
        this.catchIndex = 0;
        this.catchScrollTop = 0;

        // 动画标识 仅在 column 发生变化时执行
        this.isAnimate = false

        this.updateScrollTop = debounce((scrollTop) => {
            this.isAnimate = false
            this.scrollTop = scrollTop
        }, 50)
    },
    created() {
        // 预览模式
        this.previewMode = this.mode || this.$store.appConfig.get('previewMode')
    },
    mounted() {
        const visibleContainer = this.$refs.visibleContainer;

        const updateVisibleContainerInfo = (dom) => {
            this.clientHeight = dom.clientHeight;
            this.clientWidth = dom.clientWidth;
            this.visibleListStyle = {
                'transform': `translateX(${(dom.clientWidth + this.gap) % (this.width + this.gap) / 2}px)`,
            }
            return (Math.max(parseInt((dom.clientWidth + this.gap) / (this.width + this.gap)), 1))
        }

        const observer = debounce((e) => {
            const column = updateVisibleContainerInfo(visibleContainer)
            if (column !== this.column) {
                this.column = column
                this.resetLayout()
            }
        }, 300)

        const resizeObserver = new ResizeObserver(e => observer(e));

        this.column = updateVisibleContainerInfo(visibleContainer)
        this.reset(this.column)

        visibleContainer.addEventListener("scroll", this.handlerScroll);

        this.$once("hook:beforeDestroy", () => {
            visibleContainer.removeEventListener("scroll", this.handlerScroll);
            resizeObserver.disconnect();
        });

        this.$on("hook:activated", () => {
            resizeObserver.observe(visibleContainer);
            this.$refs.visibleContainer.scrollTop = this.scrollTop;
        });

        this.$on("hook:deactivated", () => {
            resizeObserver.unobserve(visibleContainer)
        });
    },
    methods: {
        reset(column) {
            this.catchList = []
            this.catchKeys = {}
            this.sumHeight = toTwoDimensionalArray(column, 0)
            this.$refs.visibleContainer.scrollTo(0, 0)
            this.catchIndex = 0;
            this.catchScrollTop = 0;
        },
        // 更新虚拟列表
        updateVisibleList() {
            /* let top = this.scrollTop - this.clientHeight
            let bottom = this.scrollTop + this.clientHeight * 2
            let visibleList = this.catchList.filter(img => img._top > top && img._top < bottom)
            this.visibleList = Object.freeze(visibleList); */

            let startIndex = this.catchIndex
            let startItem = this.catchList[startIndex]
            if (!startItem) return;
            let top = this.scrollTop - this.clientHeight
            let bottom = this.scrollTop + this.clientHeight * 2
            let len = this.catchList.length

            const find = (index, catchList, comparefun) => {
                let startIndex = index
                let endIndex = index + 1
                let startState = true
                let endState = true
                let len = catchList.length
                let list = []

                while (startState || endState) {
                    if (startState) {
                        if (startIndex >= 0) {
                            let item = catchList[startIndex]
                            if (item && comparefun(item)) {
                                list.push(item)
                                startIndex--;
                            } else {
                                startState = false
                            }
                        } else {
                            startState = false
                        }
                    }

                    if (endState) {
                        if (endIndex < len) {
                            let item = catchList[endIndex]
                            if (item && comparefun(item)) {
                                list.push(item)
                                endIndex++;
                            } else {
                                endState = false
                            }
                        } else {
                            endState = false
                        }
                    }
                }
                return list;
            }

            // 当前缓存下标不在范围内
            if (!(startItem._top > top && startItem._top < bottom)) {
                let scrollSize = this.catchScrollTop - this.scrollTop
                let func = scrollSize < 0 ? (i, z = 1) => i + z : (i, z = 1) => i - z;

                if (Math.abs(scrollSize) > 3000) {
                    startIndex = func(startIndex, (parseInt(Math.abs(scrollSize) / 350)) * this.column)
                    startIndex = scrollSize < 0 ? Math.min(len - 1, startIndex) : Math.max(0, startIndex)
                }

                let flag = true
                let endIndex = startIndex

                while (flag) {
                    --startIndex
                    ++endIndex

                    let img = this.catchList[startIndex]
                    let img2 = this.catchList[endIndex]

                    if (img && img._top > top && img._top < bottom) {
                        flag = false
                    }

                    if (img2 && img2._top > top && img2._top < bottom) {
                        flag = false
                        startIndex = endIndex
                    }

                    if (startIndex <= 0 && endIndex >= len) {
                        flag = false
                    }
                }

                // 更新下标
                this.catchIndex = startIndex
            }

            this.visibleList = Object.freeze(find(startIndex, this.catchList, (img) => img._top > top && img._top < bottom));
            this.catchScrollTop = this.scrollTop

            // 过渡动画
            const prevImgs = this.$refs.imgs
            if (prevImgs && this.isAnimate) {
                this.isAnimate = false
                const prevPositions = getTransforms(prevImgs)
                this.$nextTick(() => {
                    const currentPositions = getTransforms(prevImgs)

                    prevImgs.forEach((imgRef) => {
                        const id = imgRef.id
                        const currentPosition = currentPositions.get(id)
                        let prevPosition = prevPositions.get(id)
                        if (!prevPosition) {
                            prevPosition = `translate(${getRandom(0, this.clientWidth)}px, ${getRandom(top, bottom)}px)`
                        }
                        const keyframes = [
                            { transform: prevPosition },
                            { transform: currentPosition },
                        ]

                        const options = {
                            duration: 600,
                            easing: "cubic-bezier(0,0,0.32,1)",
                        }

                        const animation = imgRef.animate(keyframes, options)
                    })
                })
            }
        },
        // 大小变更 重新布局
        resetLayout() {
            this.sumHeight = toTwoDimensionalArray(this.column, 0)

            const { width, gap, sumHeight } = this
            this.catchList.forEach(img => {
                let minIndex = minValIndex(sumHeight)

                img._top = sumHeight[minIndex]
                img.style = {
                    width: img.thumbs_width + 'px',
                    height: img.thumbs_height + 40 + 'px',
                    //"contain-intrinsic-size": `${width}px ${img.thumbs_height + 40}px`,
                    transform: `translate(${minIndex * (width + gap)}px, ${sumHeight[minIndex]}px)`
                }

                sumHeight[minIndex] = sumHeight[minIndex] + img.thumbs_height + gap + 40
            })

            this.isAnimate = true
            this.placeholderHeight = maxVal(sumHeight)
        },
        // 添加数据
        add(imgs, reset = false) {
            if (reset) this.reset(this.column);

            const { width, gap, sumHeight, catchKeys } = this
            const newImgs = []

            imgs.forEach(img => {
                if (!catchKeys[img.id]) {
                    const minIndex = minValIndex(sumHeight)

                    img.original = img.thumbs.original
                    img.thumbs_width = width;
                    img.thumbs_height = this.previewMode === 'waterfall' ? parseInt(Math.max(width / img.ratio, 200)) : 200;
                    img.original = img.thumbs_height === 200 ? img.thumbs.small : img.thumbs.original
                    img._top = sumHeight[minIndex]
                    img._collection = this.$store.collections.has(img.id)
                    img.style = {
                        width: img.thumbs_width + 'px',
                        height: img.thumbs_height + 40 + 'px',
                        //"contain-intrinsic-size": `${width}px ${img.thumbs_height + 40}px`,
                        transform: `translate(${minIndex * (width + gap)}px, ${sumHeight[minIndex]}px)`
                    }

                    sumHeight[minIndex] = sumHeight[minIndex] + img.thumbs_height + gap + 40
                    newImgs.push(img);
                    catchKeys[img.id] = true
                }
            })

            this.catchList.push(...newImgs)
            this.placeholderHeight = maxVal(sumHeight)
        },
        // 列表滚动
        handlerScroll(e) {
            let { scrollHeight, clientHeight, scrollTop } = e.target;
            if (scrollHeight < scrollTop + clientHeight + 1000) {
                this.$emit("loadMore");
            }
            this.updateScrollTop(scrollTop)
        },
        // 添加收藏
        handleAddCollection(item) {
            this.$root.AddCollection(item);
            this.$message({ message: "收藏成功", type: "success", duration: 2000 });
        },
        // 移除收藏
        handleRemoveCollection(item) {
            this.$root.removeCollection(item);
            this.$message({ message: "取消收藏", type: "success", duration: 2000 });
        },
        // 获取收藏状态
        getCollection(id) {
            return this.$root.collections.findIndex(item => item === id) > -1
        },
        //查看
        handleView(e, item) {
            let { x, y } = e.target.getClientRects()[0]
            this.$root.$emit("imgview", { ...item, rect: { x, y } })
        },
        // 下载
        handleDownFile(item, isSetWallpaper = false) {
            let { id, path: url, file_size: size, resolution, thumbs: { small } } = item;
            this.$root.addDownFile({ id, url, size, resolution, small, _img: item, isSetWallpaper })
            this.$message({ message: isSetWallpaper ? "壁纸设置中... " : "已加入下载", type: "success", duration: 2000 });
        }
    }
};
</script>

<style lang="less">
.visible-container {
    height: 100%;
    margin: 10px 10px 20px;
    overflow-y: scroll;
    overflow-x: hidden;
    text-align: center;

    &::-webkit-scrollbar {
        width: 10px;
    }

    .visible-list {
        position: relative;
        list-style: none;
        transition: transform .2s;
    }

    .visible-list-item {
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 3px;
        overflow: hidden;
        transition:
            /* transform .8s ease-in-out, */
            box-shadow 0.3s ease-in-out;
        z-index: 1;

        &:hover {
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02),
                0 16px 32px -4px #000000a3;
        }

        &::before {
            content: "";
            height: 150%;
            width: 150%;
            position: absolute;
            background: rgba(0, 0, 0, 0.205);
            left: -25%;
            top: -25%;
            filter: blur(50px);
            z-index: -1;
        }

        .img {
            position: relative;
            width: 300px;
            height: 200px;
            overflow: hidden;

            img {
                display: block;
                width: 100%;
                height: 100%;
                transition: transform 0.4s;
            }

            .img-info {
                top: 0;
                position: absolute;
                width: 100%;
                box-sizing: border-box;
                line-height: 30px;
                background: #00000099;
                position: absolute;
                color: #ffffffa8;
                display: flex;
                justify-content: space-between;
                padding: 0 10px;
                transform: translateY(-100%);
                transition: transform 0.4s;
            }

            &:hover {
                .img-info {
                    transform: translateY(0);
                }

                /* img {
                    transform: scale(1.1);
                } */
            }
        }

        .desc {
            line-height: 40px;
            height: 40px;
            background: #1e2336;
            color: #888888;
            font-size: 12px;
            padding: 0 10px;
            display: flex;
            justify-content: space-between;

            span {
                cursor: pointer;
            }

            .shoucang {
                color: #38acfa;
            }
        }
    }

    .skeleton {
        display: inline-block;
        margin: 10px;

        .img {
            position: relative;
            width: 300px;
            height: 200px;
            background: linear-gradient(60deg,
                    #18171717 25%,
                    #0c0c0c17 37%,
                    #3a3a3a1f 63%);
            background-size: 400% 100%;
            animation: skeleton-loading 1.4s ease infinite;
        }

        .desc {
            display: flex;
            justify-content: space-between;
            line-height: 40px;
            height: 40px;

            span {
                display: inline-block;
                flex: 1;
                background: linear-gradient(60deg,
                        #ffffff17 25%,
                        #e2e2e217 37%,
                        #e4e4e41f 63%);
                background-size: 400% 100%;
                //animation: skeleton-loading 1.4s ease infinite;
            }

            @keyframes skeleton-loading {
                0% {
                    background-position: 100% 50%;
                }

                100% {
                    background-position: 0 50%;
                }
            }
        }
    }
}
</style>