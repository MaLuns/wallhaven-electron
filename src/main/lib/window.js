const path = require('path');
const { app, BrowserWindow } = require('electron')

const getURL = (url) => require('url').format({
    protocol: 'file',
    slashes: true,
    pathname: path.resolve(__dirname, "../../renderer/", url)
})

const createWindow = (function () {
    let win = null
    return () => {
        if (win) return win;
        win = new BrowserWindow({
            width: 1300,
            height: 800,
            backgroundColor: "#201f29",
            icon: path.resolve(__dirname, "../icon/logo.png"),
            frame: false,
            show: false,
            webPreferences: {
                preload: path.resolve(__dirname, "./preload.js"),
                webSecurity: false,
            }
        })

        if (app.isPackaged) {
            win.loadURL(getURL('index.html'))
        } else {
            win.loadURL("http://localhost:8080")
            win.webContents.openDevTools()
        }

        win.on('closed', () => { win = null; })
        win.on('ready-to-show', () => { win.show() })

        return win
    }
})()

const createConfigWindow = (function () {
    let win = null
    return () => {
        if (win) return win;

        win = new BrowserWindow({
            width: 450,
            height: 340,
            maxWidth: 450,
            maxHeight: 340,
            maximizable: false,
            icon: path.resolve(__dirname, "../icon/logo.png"),
            resizable: false,
            show: false,
            frame: false,
            transparent: true,
            backgroundColor: "#00ffffff",
            fullscreenable: false,
            webPreferences: {
                preload: path.resolve(__dirname, "./preload.js"),
            }
        })

        if (app.isPackaged) {
            win.loadURL(getURL('config.html'))
        } else {
            win.loadURL("http://localhost:8080/config.html")
        }

        win.on('closed', () => { win = null; })
        win.on('ready-to-show', () => { win.show() })

        return win;
    }
})()

module.exports = {
    createWindow,
    createConfigWindow
}