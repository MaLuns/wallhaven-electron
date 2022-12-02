import { setWallpaper } from "@/libs/send";
import { getTime } from "@/libs/util";

export default {
    methods: {
        //查看
        handleView(e, item) {
            let { x, y } = e.target.getClientRects()[0]
            this.$root.$emit("imgview", { ...item, rect: { x, y } })
        },
        // 添加收藏
        handleAddCollection(item) {
            this.$root.AddCollection(item);
            this.$message.success("收藏成功");
        },
        // 移除收藏
        handleRemoveCollection(item) {
            this.$root.removeCollection(item);
            this.$message.warning("取消收藏");
        },
        // 获取收藏状态
        getCollection(id) {
            return this.$root.collections.findIndex(item => item === id) > -1
        },
        // 下载、设置壁纸
        handleDownFile(item, isSetWallpaper = false) {
            let { id, path: url, file_size: size, resolution, thumbs: { small } } = item;
            if (/^blob:/.test(this.path)) {
                const downPath = localStorage.getItem('downloads');
                const name = `wallhaven-${id}${url.substr(url.lastIndexOf('.'))}`;
                const a = document.createElement("a")
                a.href = this.path
                a.download = name
                a.click()
                setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 3000)
                const path = downPath + '\\' + name
                this.$store.downDoneFiles.set(id, {
                    id, resolution, size, small, url, downloadtime: getTime(), path
                })
                if (isSetWallpaper) {
                    this.$message.success("壁纸设置中...");
                    setWallpaper(path).then(() => {
                        this.$message.success("壁纸设置成功！");
                    })
                } else {
                    this.$message.success("下载成功！");
                }
            } else {
                this.$root.addDownFile({ id, url, size, resolution, small, _img: item, isSetWallpaper })
                this.$message({ message: "已加入下载", type: "success", duration: 2000 });
            }
        }
    }
}