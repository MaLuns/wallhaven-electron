const { app, BrowserWindow, Tray, Menu, nativeImage } = require('electron');

//获取单例锁
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
    app.quit()
} else {
    const Store = require('electron-store');
    // 初始化 electron-store  需在主进程
    Store.initRenderer();

    const path = require('path');
    global.appDirname = __dirname;
    app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');

    let baseURL = path.resolve(__dirname, "../renderer");
    let mainWindow;
    let configWindow;
    let tray;

    const createWindow = () => {
        const win = new BrowserWindow({
            width: 1580,
            height: 888,
            backgroundColor: "#201f29",
            icon: path.resolve(__dirname, "./icon/logo.png"),
            frame: false,
            show: false,
            webPreferences: {
                preload: path.resolve(__dirname, "./lib/preload.js"),
                webSecurity: false,
            }
        })

        if (app.isPackaged) {
            win.loadURL(`file://${baseURL}/index.html`)
        } else {
            win.loadURL("http://localhost:8080")
            win.webContents.openDevTools()
        }

        win.on('closed', () => { mainWindow = null; })
        win.on('ready-to-show', () => { win.show() })

        return win
    }

    const createConfigWindow = () => {
        const win = new BrowserWindow({
            width: 450,
            height: 340,
            maxWidth: 450,
            maxHeight: 340,
            maximizable: false,
            icon: path.resolve(__dirname, "./icon/logo.png"),
            resizable: false,
            show: false,
            frame: false,
            transparent: true,
            backgroundColor: "#00ffffff",
            fullscreenable: false,
            webPreferences: {
                preload: path.resolve(__dirname, "./lib/preload.js"),
            }
        })

        if (app.isPackaged) {
            win.loadURL(`file://${baseURL}/config.html`)
        } else {
            win.loadURL("http://localhost:8080/config.html")
        }

        win.on('closed', () => { mainWindow = null; })
        win.on('ready-to-show', () => { win.show() })

        return win;
    }

    const createDynamicWallpaper = () => {
        const win = new BrowserWindow({
            resizable: false,
            frame: false,
            show: false,
            fullscreen: true,
            type: "desktop",
            webPreferences: {
                devTools: false
            }
        })


        if (app.isPackaged) {
            win.loadURL(`file://${baseURL}`)
        } else {
            win.loadURL("http://localhost:8080")
        }

        win.on('ready-to-show', () => { win.show() })

        return win
    }

    const createTray = () => {
        const icon = nativeImage.createFromPath(path.resolve(__dirname, "./icon/logo.png"))
        tray = new Tray(icon)

        const contextMenu = Menu.buildFromTemplate([
            {
                label: '打开壁纸程序', type: 'normal',
                click: () => {
                    mainWindow.show()
                }
            },
            /* { label: '刷新壁纸', type: 'normal' }, */
            {
                label: '设置', type: 'normal',
                click: () => {
                    if (configWindow) {
                        configWindow.show()
                    } else {
                        configWindow = createConfigWindow()
                    }
                }
            },
            { label: '退出', type: 'normal', role: "quit" }
        ])

        tray.setContextMenu(contextMenu)

        tray.setToolTip('This is my application')
    }

    const init = () => {
        require("./lib/ipcMain")
        const { db } = require('./lib/database')
        const { downloadPath } = db.appConfig.get()

        if (!downloadPath) {
            app.setPath('downloads', downloadPath)
        } else {
            db.appConfig.set('downloadPath', app.getPath('downloads'))
        }

        db.appConfig.onDidChange("downloadPath", function (newValue) {
            app.setPath('downloads', newValue)
        })

        db.appConfig.onDidChange("openAtLogin", function (newValue) {
            app.setLoginItemSettings({
                openAtLogin: newValue
            })
        })
    }

    app.whenReady().then(() => {
        init()
        mainWindow = createWindow();
        createTray()
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