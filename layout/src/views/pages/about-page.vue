 <template>
    <div class="about-page">
        <div class="about">
            <p class="about-post">《One Wallhaven》是一个由个人开发的桌面壁纸类程序。 起初是由于站点（wallhaven.cc）经常无法使用以后， 实在找不到自己喜欢的壁纸类网站和程序，于是决定自己写个， 另外要申明一下，我并不会生产图片壁纸， 本程序图片内容都来源于互联网(wallhaven.cc)， 图片版权为原作者所有，若有侵权联系删除。</p>
        </div>
        <div class="wx-code">
            <img :src="wx" draggable="false" />
            <p>赏几个铜板~</p>
        </div>
        <ul class="version" v-for="(item,index) in logs" :key="index">
            <h2>
                <span>{{item.title}}</span>
                <span>{{item.time}}</span>
            </h2>
            <li v-for="(t,i) in item.childer" :key="i">{{t}}</li>
        </ul>
    </div>
</template>

<script>
    import wx from "@/assets/wx.jpg";
    import logs from "@/assets/log";
    export default {
        name: "AboutPage",
        data() {
            return {
                wx,
                logs 
            }
        }
    };
</script>

    <style lang="less" scoped>
    .about-page{
        height: 100%;
        list-style: none;
        overflow-y: auto;
    }

    .about {
        margin: 20px;
        padding: 20px;
        line-height: 32px;
        text-indent: 2em;
        color: #ececec;
        font-size: 16px;
        border-bottom: 1px solid #eee;
    }

    .version {
        color: #eee;
        margin: 20px;
        background: #16171848;
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
        /* position: absolute;
        width: 100px;
        height: 120px;
        right: 20px;
        bottom: 20px; */
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