 <template>
    <div>
        <div class="about">
            <p class="about-post">《One Wallhaven》是一个由个人开发的桌面壁纸类程序。 起初是由于站点（wallhaven.cc）经常无法使用以后， 实在找不到自己喜欢的壁纸类网站和程序，于是决定自己写个， 另外要申明一下，我并不会生产图片壁纸， 本程序图片内容都来源于互联网(wallhaven.cc)， 图片版权为原作者所有，若有侵权联系删除。</p>
        </div>
        <ul class="version" v-for="(item,index) in update" :key="index">
            <h2>
                <span>{{item.title}}</span>
                <span>update：{{item.time}}</span>
            </h2>
            <li v-for="(t,i) in item.childer" :key="i">{{t}}</li>
        </ul>
        <div class="wx-code">
            <img :src="wx" draggable="false" />
            <p>赏几个铜板~</p>
        </div>
    </div>
</template>

<script>
    import wx from "@/assets/wx.jpg";
    export default {
        name: "AboutPage",
        data() {
            return {
                wx,
                update: [
                    {
                        title: 'v1.0.1',
                        time: '2020-12-19',
                        childer: [
                            '优化单例运行',
                            '优化图片预览',
                            '修复下载列表显示异常',
                            '支持指定下载目录',
                            '已下载列表支持打开本地目录'
                        ]
                    },
                    {
                        title: 'v1.0.0',
                        time: '2020-09-30',
                        childer: [
                            '支持热门、动漫、人物三个分类',
                            '支持按大小、类型、不同排序搜索',
                            '支持图片预览',
                            '支持本地收藏',
                            '支持断点续下载',
                        ]
                    }
                ]
            }
        }
    };
</script>

<style lang="less" scoped>
    .about {
        margin: 20px;
        padding: 20px;
        line-height: 32px;
        text-indent: 2em;
        color: #ececec;
        font-size: 16px;
        border-bottom: 1px solid #eee;
    }
    .ttt {
        color: #fff;
        display: flex;
        justify-content: center;

        div {
            width: 80px;
            height: 80px;
            background: #000;
            margin: 100px 20px;
        }
    }

    .version {
        color: #eee;
        margin: 20px;
        background: #0000007d;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 4px 5px 20px 0px #00000030;

        h2 {
            color: #eee;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
        }

        li {
            margin-left: 20px;
            line-height: 26px;
            font-size: 15px;
        }
    }

    .wx-code {
        position: absolute;
        width: 100px;
        height: 120px;
        right: 20px;
        bottom: 20px;
        color: #e0e0e0;
        text-align: center;

        img {
            width: 100px;
            height: 100px;
        }

        p {
            line-height: 20px;
        }
    }
</style>