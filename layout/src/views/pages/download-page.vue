/* 下载
 * @Author: 白云苍狗 
 * @Date: 2020-09-21 18:56:05 
 * @Last Modified by: 白云苍狗
 * @Last Modified time: 2020-09-28 23:22:44
 */

<template>
    <div class="down-page">
        <!--  <template v-if="$root.downFiles.length>0"> -->
        <div class="down-card">
            <h2 class="title">下载中</h2>
            <template v-if="$root.downFiles.length>0">
                <div v-for="(img,index) in $root.downFiles" :key="index" class="img-item">
                    <div class="img">
                        <img draggable="false" :src="img.small" alt />
                    </div>
                    <div class="down-content">
                        <div class="img-info">
                            <div class="img-resolution">尺寸：{{ img.resolution}}</div>
                            <div class="img-size">图片大小：{{ img.size | byte}}</div>
                            <div class="img-speed" v-if="img.state === 'downing'">下载速度：{{ img.speedBytes | byte}}/s</div>
                            <div class="img-offset" v-if="img.state === 'wait'">等待中</div>
                            <div class="img-offset" v-else>已下载：{{ img.offset | byte}}</div>
                            <div class="clost-btn iconfont icon-guanbi" @click="handleClose(img)"></div>
                            <div class="opt">
                                <div v-if="['paused', 'interrupted'].includes(img.state)" class="iconfont icon-bofang" @click="handleResume(img)"></div>
                                <div v-if="img.state === 'downing'" class="iconfont icon-zanting" @click="handlePaused(img)"></div>
                            </div>
                        </div>
                        <el-progress :status="img.state | state" :percentage="img.progress"></el-progress>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="empty">任务队列已经空空如也~</div>
            </template>
        </div>
        <div class="down-card" v-if="$root.downDoneFiles.length>0">
            <h2 class="title">已完成</h2>
            <div v-for="(img,index) in $root.downDoneFiles" :key="index" class="img-item">
                <div class="img">
                    <img draggable="false" :src="img.small" alt />
                </div>
                <div class="end-content">
                    <div class="img-time">{{img.downloadtime}}</div>
                    <div class="img-resolution">尺寸：{{ img.resolution}}</div>
                    <div class="img-size">图片大小：{{ img.size | byte}}</div>
                    <div class="clost-btn iconfont icon-guanbi" @click="handleClose(img,false)"></div>
                </div>
            </div>
        </div>
        <!--  </template> -->
        <!--   <template v-else>
            <empty-page></empty-page>
        </template>-->
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
    import { pause, resume, nextresume, cancel } from "@/libs/downfile"

    export default {
        name: "DownloadPage",
        methods: {
            //暂停
            handlePaused(img) { pause(img.url) },
            //恢复下载  恢复断点下载
            handleResume(img) {
                if (img.state === 'paused') {
                    resume(img.url)
                } else {
                    nextresume(img)
                }
            },
            //取消下载
            handleClose(item, type = true) {
                //取消下载任务
                if (item.state !== "completed") {
                    cancel(item.url)
                }
                //删除列表
                this.$root.removeDownFile(item.id, type)
            }
        },
        filters: {
            state(val) {
                if (['cancelle', 'interrupted-err'].includes(val)) {
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
        padding: 20px 100px;
        height: 100%;
        overflow-y: auto;
        box-sizing: border-box;
        .down-card {
            .title {
                color: #a7a7a7;
                margin: 10px;
            }

            .img-item {
                border-radius: 3px;
                position: relative;
                display: flex;
                background-color: #7eb0da30;
                color: #fff;

                + .img-item {
                    margin-top: 30px;
                }

                .img {
                    img {
                        width: 120px;
                        height: 80px;
                        display: block;
                    }
                }

                //
                .down-content {
                    flex: 1;
                    padding: 0 20px;

                    .img-info {
                        height: 60px;
                        position: relative;

                        > div {
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

                        .opt {
                            position: absolute;
                            display: flex;
                            top: 0px;
                            right: 30px;
                            padding: 5px;

                            div {
                                font-size: 20px !important;
                            }
                        }

                        .clost-btn {
                            position: absolute;
                            top: 5px;
                            padding: 5px;
                            right: 0;
                        }
                    }

                    /deep/ .el-progress {
                        .el-progress-bar {
                            padding-right: 0;
                            margin-right: 0;
                        }

                        .el-progress__text {
                            display: none;
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
                    .img-resolution {
                        top: 50px;
                    }
                    .clost-btn {
                        top: 25px;
                        right: 20px;
                        padding: 5px;
                    }
                }
            }

            .empty {
                color: #a5a5a5;
                text-align: center;
            }

            + .down-card {
                margin-top: 30px;
            }
        }
    }
</style>