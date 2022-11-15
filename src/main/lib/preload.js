const { contextBridge, ipcRenderer } = require('electron')

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
    "set_wallpaper"
]


invokes.forEach(item => {
    invokesApi[item] = (...res) => ipcRenderer.invoke(item, ...res)
})

const handlesApi = {}
const handles = [
    'update_down_state'
]
handles.forEach(item => {
    handlesApi[item] = (callback) => ipcRenderer.on(item, callback)
});

contextBridge.exposeInMainWorld('send', invokesApi)
contextBridge.exposeInMainWorld('handle', handlesApi)