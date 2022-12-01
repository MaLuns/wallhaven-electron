<template>
    <div class="down-page">
        <!--  <template v-if="$root.downFiles.length>0"> -->
        <div class="down-card">
            <div class="down-title">
                <h2 class="title mb20">下载中</h2>
                <p>
                    <span class="path" v-text="path"></span>
                    <span class="btn" @click="handleSetDownPath">修改下载目录</span>
                </p>
            </div>
            <template v-if="downFiles.length > 0">
                <div v-for="img in downFiles" :key="img.id" class="img-item">
                    <div class="img">
                        <img draggable="false" :src="img.small" alt />
                        <div class="opt">
                            <div v-if="['paused', 'interrupted'].includes(img.state)" class="iconfont icon-bofang"
                                @click="handleResume(img)"></div>
                            <div v-if="img.state === 'downing'" class="iconfont icon-zanting"
                                @click="handlePaused(img)"></div>
                        </div>
                    </div>
                    <div class="down-content" :style="{ backgroundSize: `${img.progress}% 100%` }">
                        <div class="img-info">
                            <div class="img-resolution">
                                尺寸：{{ img.resolution }}
                            </div>
                            <div class="img-size">
                                图片大小：{{ img.size | byte }}
                            </div>
                            <div class="img-speed" v-if="img.state === 'downing'">
                                下载速度：{{ img.speedBytes | byte }}/s
                            </div>
                            <div class="img-offset" v-if="img.state === 'wait'">
                                等待中
                            </div>
                            <div class="img-offset" v-else>
                                已下载：{{ img.offset | byte }}
                            </div>
                            <div class="clost-btn iconfont icon-guanbi" @click="handleClose(img)"></div>
                        </div>
                        <!-- <el-progress :status="img.state | state" :percentage="img.progress"></el-progress> -->
                    </div>
                </div>
            </template>
            <template v-else>
                <one-result title="任务队列已经空空如也 ~"></one-result>
            </template>
        </div>
        <div class="down-card" v-if="downDoneFiles.length > 0" @click="handleOpen">
            <div class="down-title">
                <h2 class="title mb20">已完成</h2>
                <p>
                    <span class="btn" @click="handleClear">删除全部记录</span>
                </p>
            </div>
            <div v-for="img in downDoneFiles" :key="img.id" class="img-item">
                <div class="img">
                    <img draggable="false" :src="img.small" alt :data-path="img.path" />
                </div>
                <div class="end-content">
                    <div class="img-time">{{ img.downloadtime }}</div>
                    <div class="img-resolution">尺寸：{{ img.resolution }}</div>
                    <div class="img-size">大小：{{ img.size | byte }}</div>
                    <div class="img-path">地址：{{ img.path }}</div>
                    <div class="clost-btn iconfont icon-guanbi" @click="handleClose(img, false)"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/* const dataJs = {
    id: '唯一值',
    url: '下载路径',
    size: '',
    progress: '下载进度',
    speedBytes: '速度（b)',
    state: '下载实时状态',
    done: '下载状态',
    //恢复下载数据
    urlChain: ['下载地址数组'],
    offset: '已下载偏移量',
    length: '总长度',
    lastModified: '文件服务端最后修改时间',
    eTag: '标示',
    startTime: 'UNIX 下载时间'
} */
import { pause, nextresume, cancel, setPath, openPath } from "@/libs/send"

export default {
    data() {
        return {
            path: "",
            // 下载列表
            downFiles: [],
            downDoneFiles: []
        }
    },
    mounted() {
        this.path = this.$store.appConfig.get('downloadPath')

        this.downFiles = Object.freeze(Object.values(this.$store.downFiles.store))
        this.downDoneFiles = Object.freeze(Object.values(this.$store.downDoneFiles.store))

        this.$store.downFiles.onDidAnyChange((newValue) => {
            this.downFiles = Object.freeze(Object.values(newValue))
        })

        this.$store.downDoneFiles.onDidAnyChange((newValue) => {
            this.downDoneFiles = Object.freeze(Object.values(newValue))
        })
    },
    methods: {
        //暂停
        handlePaused(img) {
            pause(img.id)
        },
        //恢复下载  恢复断点下载
        handleResume(img) {
            nextresume(img)
        },
        //取消下载
        handleClose(item, type = true) {
            if (type) {
                this.$store.downDoneFiles.delete(item.id)
            } else {
                this.$store.downDoneFiles.delete(item.id)
            }
            cancel(item)
        },
        // 打开图片路径
        handleOpen(event) {
            let path = event.target.dataset.path;
            if (path !== undefined) {
                openPath(path).then(err => {
                    err && this.$message({ message: "文件不存在", type: "error", duration: 2000 })
                })
            }
        },
        handleSetDownPath() {
            setPath().then(data => {
                if (!data.canceled) {
                    localStorage.setItem('downloads', data.filePaths[0])
                    this.path = data.filePaths[0]
                }
            })
        },
        handleClear() {
            this.$store.downDoneFiles.clear()
        }
    },
    filters: {
        state(val) {
            if (['cancelled', 'interrupted-err'].includes(val)) {
                return 'exception'
            }
            // 暂停 - 或者可恢复
            else if (['paused', 'interrupted'].includes(val)) {
                return 'warning'
            }
            else if (['completed'].includes(val)) {
                return 'success'
            }
        }
    },
};
</script>

<style lang="less" scoped>
.down-page {
    padding: 20px;
    height: 100%;
    overflow-y: auto;
    box-sizing: border-box;

    .down-card {
        .down-title {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .path {
                margin-right: 10px;
                text-decoration-line: underline;
            }

            .btn {
                color: #0081ff;
                cursor: pointer;
            }
        }

        .img-item {
            border-radius: 3px;
            position: relative;
            display: flex;
            background-color: #7eb0da30;
            color: #fff;

            +.img-item {
                margin-top: 30px;
            }

            .img {
                position: relative;

                img {
                    width: 120px;
                    height: 80px;
                    display: block;
                }

                .opt {
                    position: absolute;
                    width: 120px;
                    height: 80px;
                    top: 0;
                    text-align: center;
                    line-height: 80px;
                    background: #00000096;
                    transition: background .2s;

                    div {
                        cursor: pointer;
                        font-size: 36px !important;
                        color: #a6a0ca;
                    }

                    &:hover {
                        background-color: #000000b5;
                    }
                }

            }

            //
            .down-content {
                flex: 1;
                padding: 0 20px;
                background-image: linear-gradient(0deg, #363356, #363356);
                background-repeat: no-repeat;
                transition: background-size .3s;

                .img-info {
                    height: 60px;
                    position: relative;

                    >div {
                        font-size: 14px;
                        color: rgb(173, 173, 173);
                        position: absolute;
                    }

                    .img-resolution {
                        top: 10px;
                        left: 0;
                    }

                    .img-size {
                        bottom: 5px;
                        left: 0px;
                    }

                    .img-speed {
                        bottom: 5px;
                        right: 160px;
                    }

                    .img-offset {
                        bottom: 5px;
                        right: 35px;
                    }

                    .clost-btn {
                        position: absolute;
                        top: 5px;
                        padding: 5px;
                        right: 0;
                        cursor: pointer;
                    }
                }
            }

            //
            .end-content {
                color: #aaaaaa;
                padding: 0 20px;

                div {
                    position: absolute;
                    font-size: 14px;
                }

                .img-time {
                    top: 20px;
                }

                .img-size {
                    top: 50px;
                    left: 280px;
                }

                .img-path {
                    top: 50px;
                    left: 410px;
                    width: 600px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                .img-resolution {
                    top: 50px;
                }

                .clost-btn {
                    top: 25px;
                    right: 20px;
                    padding: 5px;
                    cursor: pointer;
                }
            }
        }

        .empty {
            color: #a5a5a5;
            text-align: center;
        }

        +.down-card {
            margin-top: 30px;
        }
    }
}
</style>