import Vue from 'vue'
import router from "@/routers/index"
import App from './App.vue'
import '@/libs/use';
import { downFile, handleWallpaper } from '@/libs/send'


new Vue({
  router,
  data() {
    return {
      collections: [],
    }
  },
  created() {
    this.collections = Object.keys(this.$store.collections.store)
    const unsubscribe = this.$store.collections.onDidAnyChange((newValue) => {
      this.collections = Object.keys(newValue)
    })

    this.$once("hook:beforeDestroy", () => unsubscribe());
  },
  mounted() {
    setTimeout(() => {
      document.body.classList.remove('loading')
    }, 2000);

    handleWallpaper(() => {
      this.$message.success('壁纸设置成功！')
    })
  },
  methods: {
    // 添加收藏
    AddCollection({ _top, style, ...img }) {
      this.$store.collections.set(img.id, img)
    },
    // 移除收藏
    removeCollection(obj) {
      this.$store.collections.delete(obj.id)
    },
    // 下载文件
    addDownFile(obj) {
      downFile(obj)
    },
  },
  render: function (h) { return h(App) },
}).$mount('#app')
