const { app, ipcMain, session, Notification, shell, BrowserWindow, dialog } = require('electron');
const wallpaper = require('wallpaper');
const path = require("path")
const fs = require('fs');
const { db } = require('./database');

const handle = (name, callback) => {
    ipcMain.handle(name, (e, ...par) => callback(BrowserWindow.fromWebContents(e.sender), e, ...par))
}

//缓存下载项
let cacheDownItem = {}

// 打开调试
handle("toggle_dev_tools", () => win.webContents.toggleDevTools())

// 重启
handle("restart", () => {
    app.relaunch();
    app.exit(0)
})

// 隐藏窗口
handle("close", (win) => win.hide())

// 最小化
handle("min", (win) => win.minimize())

// 最大化
handle("max", (win) => {
    if (win.isMaximized()) {
        win.unmaximize()
    } else {
        win.maximize()
    }
})

// 配置下载地址
handle("set_path", async (e) => {
    let files = await dialog.showOpenDialog({
        title: '选择下载目录',
        defaultPath: app.getPath('downloads'),
        properties: ['openDirectory']
    })
    if (!files.canceled) {// 如果有选中
        app.setPath('downloads', files.filePaths[0])
    }
    return files;
})

// 打开指定路径
handle("open_path", (win, e, path) => new Promise(resolve => {
    path = path || app.getPath('downloads');
    fs.access(path, fs.constants.F_OK, (err) => {
        if (!err) {
            shell.showItemInFolder(path + '\\')
        }
        resolve(err)
    });
}))

// 下载文件
handle("down_file", (win, e, data) => {
    let { id, url } = data
    if (!cacheDownItem[id]) {
        cacheDownItem[id] = { ...data }
        session.defaultSession.downloadURL(url)
    }
})

// 暂停下载
handle("down_file_pause", (win, e, id) => {
    let t = cacheDownItem[id]
    if (t) t._downFileItem.pause()
})

// 继续下载
handle("down_file_resume", (win, e, id) => {
    let t = cacheDownItem[id]
    if (t) t._downFileItem.resume()
})

// 取消下载
handle("down_file_cancel", (win, e, { id, path }) => {
    let t = cacheDownItem[id]
    if (t) {
        t._downFileItem.cancel()
    } else {
        // 删除 temp 临时文件
        fs.access(path + '.temp', fs.constants.F_OK, (err) => {
            if (!err) {
                fs.unlink(path + '.temp', () => { })
            }
        });
    }
})

// 断点恢复下载
handle("resume_download", (win, e, data) => {
    let t = cacheDownItem[data.id]
    if (t) t._downFileItem.resume()
    else {
        cacheDownItem[data.id] = { ...data }
        resumeDownload(data)
    }
})

// 设置壁纸
handle('set_wallpaper', (win, e, path) => wallpaper.set(path))

// 恢复下载
const resumeDownload = (obj = {}) => {
    let { id, url, path = '', urlChain = [], offset = 0, length = 0, lastModified, eTag, startTime, _temp } = obj;
    if (!path || urlChain.length === 0 || length == 0) {
        return;
    }

    // 还原下文件名
    if (_temp) {
        fs.renameSync(path + '.temp', path)
        cacheDownItem[id]._temp = false
    }

    session.defaultSession.createInterruptedDownload({
        path, urlChain, offset, length, lastModified, eTag, startTime
    })
}

// 监听下载
session.defaultSession.on('will-download', (e, item) => {
    try {

        const name = item.getFilename()
        const id = name.split('-')[1].split('.')[0]
        let cacheItem = cacheDownItem[id] || {
            notSend: true
        };
        // 获取文件的总大小
        const totalBytes = item.getTotalBytes();
        // 设置下载路径
        const filePath = path.join(app.getPath("downloads"), name);
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

            if (!cacheItem.notSend) db.downFiles.set(id, cacheItem)

            // 默认情况下，下载中断时下载中文件会被删除，复制文件避免删除
            if (cacheItem._temp) fs.copyFileSync(cacheItem.path, cacheItem.path + '.temp')
        })

        // 下载完成
        item.once('done', (event, state) => {
            cacheItem.done = 'end'
            switch (state) {
                case 'interrupted':
                    cacheItem.state = 'interrupted-err'
                    break;
                case 'cancelled':
                    cacheItem.state = 'cancelled'
                    break;
                default:
                    cacheItem.state = 'completed'
                    // win 禁用通知后会造成卡顿，需要用三方包提前判断 https://www.electronjs.org/zh/docs/latest/tutorial/notifications
                    // notification(cacheItem.path)
                    break;
            }

            if (!cacheItem.notSend) {
                if (['completed', 'interrupted-err'].includes(cacheItem.state)) {
                    db.downDoneFiles.set(id, cacheItem)
                    db.downFiles.delete(id)
                } else {
                    db.downFiles.delete(id)
                }
            }

            if (cacheItem.state === 'completed' && cacheItem.isSetWallpaper) {
                wallpaper.set(cacheItem.path)
            }

            //删除缓存
            delete cacheDownItem[id]
            cacheItem = null;
            item = null;
        })

        // 恢复下载
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
                element._temp = true
                if (element._downFileItem.isPaused()) {
                    fs.copyFileSync(element.path, element.path + '.temp')
                    db.downFiles.set(key, cacheItem)
                } else {
                    element._downFileItem.pause()
                }
            }
        }
    }
}

app.on("before-quit", function () {
    cacheDownItemClose()
})

app.on("child-process-gone", function (e, details) {
    cacheDownItemClose()
})

const notification = (url) => {
    let noti = new Notification({
        title: "下载成功",
        bodyString: url,
        silentBoolean: false,
        icon: url
    })
    noti.show()
    noti.once("click", () => {
        shell.showItemInFolder(url)
    })

}