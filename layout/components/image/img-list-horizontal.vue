<template>
    <div ref="imgListHorizontal" class="img-list-horizontal">
        <div class="img-list-left" @click="handleScroll('left')"></div>
        <template v-if="list.length">
            <ul ref="visibleList" class="visible-list" :style="style">
                <li ref="imgs" v-for="item in list" :key="item.id" class="visible-list-item">
                    <div class="img" @click="handleView($event, item)">
                        <img-plus :src="item.thumbs.small"></img-plus>
                        <div class="img-info">
                            <span>{{ item.file_size | byte }}</span>
                            <span>{{ item.resolution }}</span>
                            <span>{{ item.file_type }}</span>
                        </div>
                    </div>
                    <div class="desc">
                        <span title="取消收藏" :key="item.id + 'cxx'" v-if="getCollection(item.id)"
                            @click="handleRemoveCollection(item)" class="iconfont icon-collection-b shoucang"></span>
                        <span title="收藏" :key="item.id + 'cx'" v-else @click="handleAddCollection(item)"
                            class="iconfont icon-collection-b"></span>
                        <span title="设为壁纸" class="iconfont icon-zhuomian" @click="handleDownFile(item, true)"></span>
                        <span title="下载" class="iconfont icon-xiazai" @click="handleDownFile(item)"></span>
                    </div>
                </li>
            </ul>
        </template>
        <template v-else>
            <div ref="visibleList" class="skeleton-wrapper">
                <li v-for="item in 10" :key="item" class="skeleton">
                    <div class="img"></div>
                    <div class="desc">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </li>
            </div>
        </template>
        <div class="img-list-right" @click="handleScroll('right')"></div>
    </div>
</template>
<script>
import Minix from './minix'

export default {
    name: "ImgListHorizontal",
    mixins: [Minix],
    data() {
        return {
            scroll: 0
        }
    },
    props: {
        list: {
            type: Array,
            default: () => ([])
        }
    },
    computed: {
        style() {
            return {
                transform: `translateX(-${this.scroll}px)`
            }
        }
    },
    methods: {
        handleScroll(type) {
            if (type === 'left') {
                this.scroll = Math.max(this.scroll - 400, 0)
            } else {
                this.cWidth = this.$refs.imgListHorizontal.clientWidth
                this.vWidth = this.$refs.visibleList.clientWidth
                this.scroll = Math.min(this.scroll + 400, this.vWidth - this.cWidth)
            }
        }
    }
}
</script>
<style lang="less" scoped>
.img-list-horizontal {
    position: relative;

    .img-list-left,
    .img-list-right {
        position: absolute;
        top: 75px;
        z-index: 5;
        cursor: pointer;
        height: 60px;
        width: 50px;
        border-radius: 4px;
        background-color: rgba(0, 0, 0, 0.596);
        background-repeat: no-repeat;
        background-position: center;
        opacity: .5;
        transition: opacity .3s;

        &:hover {
            opacity: 1;
        }
    }

    .img-list-left {
        left: 10px;
        background-image: url(../../assets/left.png);
    }

    .img-list-right {
        right: 10px;
        background-image: url(../../assets/right.png);
    }

    .visible-list {
        display: flex;
        transition: transform .3s;
        width: fit-content;

        .visible-list-item {
            position: relative;
            border-radius: 8px;
            overflow: hidden;
            transition: transform .8s ease-in-out, box-shadow 0.3s ease-in-out;
            z-index: 1;
            flex-shrink: 0;

            &:hover {
                box-shadow: var(--card-box-shadow);
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
                    position: absolute;
                    top: 0;
                    line-height: 30px;
                    width: 100%;
                    box-sizing: border-box;
                    display: flex;
                    justify-content: space-between;
                    transform: translateY(-100%);
                    transition: transform 0.4s;
                    padding: 0 10px;
                    font-weight: 600;
                    opacity: .8;
                    background: var(--card-desc-bg-color);
                    color: var(--card-desc-font-color);
                    font-family: fantasy;
                }

                &:hover {
                    .img-info {
                        transform: translateY(0);
                    }

                    img {
                        transform: scale(1.2);
                    }
                }
            }

            .desc {
                line-height: 40px;
                height: 40px;
                background: var(--card-desc-bg-color);
                color: var(--card-desc-font-color);
                font-size: 12px;
                padding: 0 10px;
                display: flex;
                justify-content: space-between;

                span {
                    cursor: pointer;
                    font-size: 18px;
                }

                .shoucang {
                    color: var(--button-plain-font-color);
                }
            }

            +.visible-list-item {
                margin-left: 20px;
            }
        }
    }
}

.skeleton-wrapper {
    display: flex;
    transition: transform .3s;
    width: fit-content;

    .skeleton {
        list-style: none;

        +.skeleton {
            margin-left: 20px;
        }

        .img {
            position: relative;
            width: 300px;
            height: 200px;
            background: linear-gradient(60deg, #18171717 25%, #0c0c0c17 37%, #3a3a3a1f 63%);
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
                background: linear-gradient(60deg, #a0a0a017 25%, #e2e2e217 37%, #e4e4e41f 63%);
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