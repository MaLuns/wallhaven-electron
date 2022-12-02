
/**
 * 下载文件
 * @param {*} obj 
 */
export const downFile = (obj) => window.send.down_file(obj)

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

/**
 * 打开配置页
 * @returns 
 */
export const openConfig = () => window.send.open_config()

/**
 * 壁纸设置完成
 * @param {*} cb 
 * @returns 
 */
export const handleWallpaper = (cb) => window.handle.wallpaper(cb)