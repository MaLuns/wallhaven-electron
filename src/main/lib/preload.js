const { contextBridge, ipcRenderer } = require('electron')
const { db, dbNames } = require('./database')

// 消息推送
const invokesApi = {}
const invokes = [
    "toggle_dev_tools",
    "restart",
    "min",
    "max",
    "close",
    "set_path",
    "open_path",
    "down_file",
    "down_file_pause",
    "down_file_resume",
    "down_file_cancel",
    "resume_download",
    "set_wallpaper",
    "open_config"
]
invokes.forEach(item => {
    invokesApi[item] = (...res) => ipcRenderer.invoke(item, ...res)
})


// 消息监听
const handlesApi = {}
const handles = [
    "wallpaper"
]
handles.forEach(item => {
    handlesApi[item] = (callback) => ipcRenderer.on(item, callback)
})

// 数据操作
const storesApi = {}
const stores = [...dbNames]
stores.forEach(name => {
    const funs = ['set', 'get', 'reset', 'has', 'delete', 'clear', 'onDidChange', 'onDidAnyChange']
    const attrs = ['size', 'store', 'path']

    let obj = Object.create(null)

    funs.forEach(fun => {
        obj[fun] = (...res) => db[name][fun](...res)
    })

    attrs.forEach(attr => {
        obj['get_' + attr] = () => db[name][attr]

        // 不支持注入 getter setter
        /* Object.defineProperty(obj, attr, {
            get () {
                return db[name][attr]
            }
        }) */
    })

    storesApi[name] = obj
})


contextBridge.exposeInMainWorld('send', invokesApi)
contextBridge.exposeInMainWorld('handle', handlesApi)
contextBridge.exposeInMainWorld('store', storesApi)