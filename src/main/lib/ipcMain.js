const { app, ipcMain, session, Notification, shell, DownloadItem } = require('electron');
const path = require("path")


//缓存下载项
let cacheDownItem = {}


const mainWindowIpcStart = function (win) {

    // 打开调试
    ipcMain.on("toggle_dev_tools", function (event, arg) {
        win.webContents.toggleDevTools();
    })

    // 重启
    ipcMain.on("restart", function () {
        app.relaunch();
        app.exit(0)
    })

    // 最小化
    ipcMain.on("min", function () {
        win.minimize()
    })

    // 最大化
    ipcMain.on("max", function () {
        if (win.isMaximized()) {
            win.unmaximize()
        } else {
            win.maximize()
        }
    })

    // 关闭程序
    ipcMain.on("close", function () {
        cacheDownItemClose()
        win.close();
    })


    // 下载
    ipcMain.on("down-file", function (e, data) {
        let { url } = data
        if (!cacheDownItem[url]) {
            cacheDownItem[url] = { ...data }
            downfile(url)
        } else {
            /*   e.sender("down-file", "文件正在下载") */
        }
    })

    // 暂停
    ipcMain.on("down-file-pause", function (e, data) {
        let { url } = data
        let t = cacheDownItem[url]
        if (t) {
            t._downFileItem.pause()
        }
        e.reply("down-file-pause-" + url, '已暂停')
    })

    // 继续
    ipcMain.on("down-file-resume", function (e, data) {
        let { url } = data
        let t = cacheDownItem[url]
        if (t) {
            t._downFileItem.resume()
        }
        e.reply("down-file-resume-" + url, '已恢复下载')
    })

    // 取消下载
    ipcMain.on("down-file-cancel", function (e, data) {
        let { url } = data
        let t = cacheDownItem[url]
        if (t) {
            t._downFileItem.cancel()
        } else {
            // 删除未下在完成文件
        }
        e.reply("down-file-cancel-" + url, '已取消下载')
    })

    // 断点恢复下载
    ipcMain.on("resume-download", function (e, data) {
        let { url } = data
        let t = cacheDownItem[url]
        if (t) {
            t._downFileItem.resume()
        } else {
            cacheDownItem[url] = { ...data }
            resumeDownload(data)
        }
        e.reply("down-file-resume-" + url, '已恢复下载')
    })

    // 下载文件
    const downfile = (url) => {
        session.defaultSession.downloadURL(url)
    }

    // 恢复下载
    const resumeDownload = (obj = {}) => {
        let { path = '', urlChain = [], offset = 0, length = 0, lastModified, eTag, startTime } = obj;
        if (!path || urlChain.length === 0 || length == 0) {
            return;
        }
        session.defaultSession.createInterruptedDownload({
            path, urlChain, offset, length, lastModified, eTag, startTime
        })
    }

    // 监听下载
    session.defaultSession.on('will-download', (e, item) => {
        try {

            const url = item.getURL()
            let cacheItem = cacheDownItem[url] || {
                notSend: true
            };
            // 获取文件的总大小
            const totalBytes = item.getTotalBytes();
            // 设置下载路径
            const filePath = path.join(app.getPath("downloads"), item.getFilename());
            item.setSavePath(filePath);

            // 缓存downitem
            cacheItem._downFileItem = item;
            cacheItem.path = item.getSavePath();
            cacheItem.eTag = item.getETag();
            cacheItem.urlChain = item.getURLChain();
            cacheItem.length = totalBytes
            cacheItem.lastModified = item.getLastModifiedTime()
            cacheItem.startTime = item.getStartTime();

            let lastBytes = 0;

            // 监听下载过程，计算并设置进度条进度
            item.on('updated', (event, state) => {
                if (state === 'interrupted') {
                    cacheItem.state = 'interrupted'
                } else if (state === 'progressing') {
                    if (item.isPaused()) {
                        cacheItem.state = 'paused'
                    } else {
                        let offset = item.getReceivedBytes();
                        cacheItem.state = 'downing';
                        cacheItem.speedBytes = offset - lastBytes;
                        cacheItem.progress = parseInt((offset / totalBytes) * 100);
                        cacheItem.offset = offset
                        lastBytes = offset
                    }
                }
                !cacheItem.notSend && win.webContents.send("update-down-state", JSON.parse(JSON.stringify(cacheItem)));
            })

            // 下载完成
            item.once('done', (event, state) => {
                cacheItem.done = 'end'
                switch (state) {
                    case 'interrupted':
                        cacheItem.state = 'interrupted-err'
                        break;
                    case 'cancelle':
                        cacheItem.state = 'cancelle'
                        break;
                    default:
                        cacheItem.state = 'completed'
                        notification(cacheItem.path)
                        break;
                }

                !cacheItem.notSend && win.webContents.send("update-down-state", JSON.parse(JSON.stringify(cacheItem)))

                //删除缓存
                delete cacheDownItem[url]
                cacheItem = null;
                item = null;
            })

            // 恢复
            if (item.canResume) {
                item.resume()
            }

        } catch (error) {
            console.log(error)
        }
    })


    // 暂停所有下载任务
    const cacheDownItemClose = () => {
        for (let key in cacheDownItem) {
            if (cacheDownItem.hasOwnProperty(key)) {
                let element = cacheDownItem[key];
                if (element._downFileItem) {
                    element._downFileItem.pause()
                    element._downFileItem = null
                }
            }
        }
    }

    app.on("gpu-process-crashed", function () {
        cacheDownItemClose()
    })

    app.on("renderer-process-crashed", function () {
        cacheDownItemClose()
    })

    let noti
    const notification = (url) => {
        console.log(url)
        noti = new Notification({
            title: "下载成功",
            bodyString: url,
            silentBoolean: false,
            icon: url
        })
        noti.show()
        noti.once("click", () => {
            shell.openPath(url)
        })

    }
}

module.exports = {
    mainWindowIpcStart
}