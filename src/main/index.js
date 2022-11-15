const { app, BrowserWindow } = require('electron');

//获取单例锁
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
    app.quit()
} else {
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
            //resizable: false,
            //useContentSize: true,
            /* transparent: true, */

            icon: path.resolve(__dirname, "./icon/logo.png"),
            frame: false,
            show: false,
            webPreferences: {
                preload: path.resolve(__dirname, "./lib/preload.js"),
                webSecurity: false,
            }
        })

        /* win.maximize(); */
        // console.log(app.isPackaged)

        mainWindowIpcStart(win)

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
    })

    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // 当运行第二个实例时,将会聚焦到myWindow这个窗口
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
        }
    })


    app.on('quit', () => {
        app.releaseSingleInstanceLock();//释放所有的单例锁
    });
}