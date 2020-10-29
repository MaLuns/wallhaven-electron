const { app, BrowserWindow } = require('electron');
const { mainWindowIpcStart } = require("./lib/ipcMain")
const path = require('path');
global.appDirname = __dirname;

app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');

let winURL = path.resolve(__dirname, "../renderer/index.html");

let mainWindow;
function createWindow() {
    const win = new BrowserWindow({
        width: 1580,
        height: 888,
        resizable: false,
        useContentSize: true,
        /* transparent: true, */
        icon: path.resolve(__dirname, "./icon/logo.png"),
        frame: false,
        show: false,
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true,
            webviewTag: true
        }
    })
    /* win.maximize(); */
    if (app.isPackaged) {
        win.loadURL(`file://${winURL}`)
    } else {
        win.loadURL("http://localhost:8080")
        win.webContents.openDevTools()
    }

    win.on('closed', () => { mainWindow = null; })
    win.on('ready-to-show', () => { win.show() })

    return win
}


app.on("ready", function () {
    mainWindow = new createWindow();
    mainWindowIpcStart(mainWindow)


})