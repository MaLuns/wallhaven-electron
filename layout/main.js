import Vue from 'vue'
import router from "@/routers/index"
import App from './App.vue'
import '@/libs/use';
import { downFile } from '@/libs/send'


new Vue({
  router,
  data() {
    return {
      collections: [],
      // 下载列表
      downFiles: [],
      downDoneFiles: []
    }
  },
  created() {
    this.collections = Object.keys(this.$store.collections.store)
    const unsubscribe = this.$store.collections.onDidAnyChange((newValue) => {
      this.collections = Object.keys(newValue)
    })

    this.$store.downFiles.onDidAnyChange((newValue) => {
      this.downFiles = Object.freeze(Object.keys(newValue))
    })

    this.$store.downDoneFiles.onDidAnyChange((newValue) => {
      this.downDoneFiles = Object.freeze(Object.keys(newValue))
    })

    this.$once("hook:beforeDestroy", () => unsubscribe());
  },
  mounted() {
    setTimeout(() => {
      document.body.classList.remove('loading')
    }, 2000);
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
    // 删除下载列表
    removeDownFile(id, downing) {
      if (downing) {
        let index = this.downFiles.findIndex(item => item.id === id);
        if (index > -1) {
          this.downFiles.splice(index, 1)
        }
      } else {
        let index = this.downDoneFiles.findIndex(item => item.id === id);
        if (index > -1) {
          this.downDoneFiles.splice(index, 1)
        }
      }

    }
  },
  render: function (h) { return h(App) },
}).$mount('#app')
