import Vue from 'vue'
import App from './App.vue'
import '@/libs/use';
import { getTime, getImgCollection, updImgCollection, getDownFiles, getDownDoneFiles, updDownFiles, updDownDoneFiles } from "@/libs/util";
import { downFile, updateDownState, initPath } from '@/libs/downfile'
// 初始化下载目录
initPath()

new Vue({
  data() {
    return {
      //收藏
      collections: getImgCollection(),
      // 下载列表
      downFiles: getDownFiles(),
      downDoneFiles: getDownDoneFiles()
    }
  },
  created() {
    updateDownState(this.updateDownState);
  },
  watch: {
    collections: {
      deep: true,
      handler(val) {
        updImgCollection(val)
      }
    },
    downFiles: {
      deep: true,
      handler(val) {
        updDownFiles(val)
      }
    },
    downDoneFiles: {
      deep: true,
      handler(val) {
        updDownDoneFiles(val)
      }
    }
  },
  methods: {
    // 添加收藏
    AddCollection(obj) {
      if (obj) this.collections.splice(0, 0, { ...obj })
    },
    // 移除收藏
    removeCollection(obj) {
      let index = this.collections.findIndex(item => item.id === obj.id);
      if (index > -1) {
        this.collections.splice(index, 1)
      }
    },
    // 下载文件
    addDownFile(obj) {
      let index = this.downFiles.findIndex(item => item.id === obj.id)
      if (index === -1) {
        obj.progress = 0;
        obj.speedBytes = 0;
        obj.state = 'wait';
        obj.done = "downing";
        this.downFiles.splice(0, 0, obj)
        downFile(obj)
      }
    },
    // 更新状态
    updateDownState(data) {
      this.$nextTick(() => {
        let { id, done, progress } = data;
        let index = this.downFiles.findIndex(item => item.id === id)
        if (done === 'end') {
          if (progress === 100) {
            let { id, path, resolution, size, small, url } = data
            this.downDoneFiles.splice(0, 0, { id, path, resolution, size, small, url, downloadtime: getTime() })
            if (index > -1) this.downFiles.splice(index, 1)
          }
        } else {
          if (index > -1) this.$set(this.downFiles, index, data)
        }
      })
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
