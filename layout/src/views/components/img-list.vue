<template>
    <ul ref="imglist" class="imglist">
        <template v-if="skeleton">
            <li v-for="item in 12" :key="item" class="skeleton">
                <div class="img"></div>
                <div class="desc">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </li>
        </template>
        <template v-else>
            <template v-if="list.length>0">
                <li v-for="(item,index) in list" :key="item.id+index" @contextmenu.prevent="openMenu($event)">
                    <div class="img">
                        <img @error="handleError" loading="lazy" draggable="false" :src="item.thumbs.small" @click="handleView(item)" />
                        <div class="img-info">
                            <span>{{ item.file_size | byte }}</span>
                            <span>{{ item.file_type }}</span>
                        </div>
                    </div>
                    <div class="desc">
                        <span :key="item.id+'cxx'" v-if="getCollection(item.id)" @click="handleRemoveCollection(item)" class="iconfont icon-collection-b shoucang"></span>
                        <span :key="item.id+'cx'" v-else @click="handleAddCollection(item)" class="iconfont icon-collection-b"></span>
                        <span>{{item.resolution}}</span>
                        <span @click="handleDownFile(item)">下载</span>
                    </div>
                </li>
            </template>
            <template v-else>
                <empty-page title="未找到图片信息~"></empty-page>
            </template>
        </template>
        <!-- <context-menu class="right-menu" :offset="menuOffset">
            <template v-slot:menuItem>
                <li>收藏</li>
                <li>下载</li>
                <li>查看</li>
            </template>
        </context-menu>-->
    </ul>
</template>

<script>
    import errimg from "@/assets/errimg.svg"

    export default {
        name: "ImgList",
        data() {
            return {
                scrollTop: 0,
                menuOffset: {
                    offsetLeft: 0,
                    offsetWidth: 0,
                    clientX: 0,
                    clientY: 0
                },
            };
        },
        props: {
            skeleton: {
                type: Boolean,
                default: false
            },
            list: {
                type: Array,
                default: []
            }
        },
        mounted() {
            this.$refs.imglist.addEventListener("scroll", this.handlerScroll);
            this.$once("hook:beforeDestroy", () => {
                this.$refs.imglist.removeEventListener("scroll", this.handlerScroll);
            });
        },
        activated() {
            this.$refs.imglist.scrollTop = this.scrollTop;
        },
        methods: {
            //
            handleError(e) {
                e.target.src = errimg
            },
            // 列表滚动
            handlerScroll(e) {
                let { scrollHeight, clientHeight, scrollTop } = e.target;
                this.scrollTop = scrollTop
                if (scrollHeight < scrollTop + clientHeight + 500) {
                    this.$emit("next");
                }
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
                this.$message({ message: "取消收藏", type: "success", duration: 2000 });
            },
            // 获取收藏状态
            getCollection(id) {
                let collections = this.$root.collections;
                return collections.length > 0 && collections.findIndex(item => id == item.id) !== -1;
            },
            //查看
            handleView(item) {
                this.$root.$emit("imgview", { ...item })
            },
            // 下载
            handleDownFile(item) {
                let { id, path: url, file_size: size, resolution, thumbs: { small } } = item;
                this.$root.addDownFile({ id, url, size, resolution, small, _img: item })
                this.$message({ message: "已加入下载", type: "success", duration: 2000 });
            },
            openMenu(e, data) {
                this.menuOffset.offsetLeft = this.$el.getBoundingClientRect().left // container margin left
                this.menuOffset.offsetWidth = this.$el.offsetWidth // container width
                this.menuOffset.clientX = e.clientX
                this.menuOffset.clientY = e.clientY

            }
        }
    };
</script>

<style lang="less">
    .imglist {
        height: 100%;
        list-style: none;
        padding-left: 20px;
        overflow-y: auto;
        text-align: center;
        li {
            margin: 10px;
            width: 300px;
            height: 240px;
            border-radius: 3px;
            overflow: hidden;
            display: inline-block;
            transition: transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02), 0 4px 8px #00000042;
            position: relative;
            z-index: 1;

            &:hover {
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02),
                    0 16px 32px -4px #000000a3;
                transform: translateY(-5px);
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

                img {
                    display: block;
                    width: 100%;
                    height: 100%;
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

                .shoucang {
                    color: #38acfa;
                }
            }
        }

        .skeleton {
            .desc {
                align-items: center;

                span {
                    display: inline-block;
                    width: 30%;
                    height: 20px;
                    background: linear-gradient(
                        60deg,
                        #ffffff17 25%,
                        #e2e2e217 37%,
                        #e4e4e41f 63%
                    );
                    background-size: 400% 100%;
                    animation: skeleton-loading 1.4s ease infinite;
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