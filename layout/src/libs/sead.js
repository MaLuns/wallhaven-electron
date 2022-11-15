
/**
 * 下载文件
 * @param {*} obj 
 */
export const downFile = (obj) => window.send.down_file(obj)

/**
 * 更新下载状态
 * @param {*} cb 
 */
export const updateDownState = (cb) => window.handle.update_down_state(cb)

/**
 * 暂停下载
 * @param {*} url 
 */
export const pause = (url) => window.send.down_file_pause(url)

/**
 * 取消下载
 * @param {*} url 
 */
export const cancel = (item) => window.send.down_file_cancel(item)

/**
 * 恢复下载
 * @param {*} url 
 */
export const resume = (url) => window.send.down_file_resume(url)

/**
 * 恢复或断点续下载
 * @param {*} obj 
 */
export const nextresume = (obj) => window.send.resume_download(obj)


/**
 * 初始化下载地址
 * @param {*} path 下载路径
 */
export const initPath = () => {
    let path = localStorage.getItem('downloads') || 'not';
    window.send.set_path(path).then(data => {
        localStorage.setItem('downloads', data)
    })
}

/**
 * 设置下载路径
 * @returns 
 */
export const setPath = () => window.send.set_path()

/**
 * 打开文件夹
 * @param {*} path 
 * @returns 
 */
export const openPath = (path) => window.send.open_path(path)

/**
 * 设置壁纸
 * @param {*} path 
 * @param {*} cb 
 */
export const setWallpaper = (path) => window.send.set_wallpaper(path)