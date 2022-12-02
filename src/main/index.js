const { app, Tray, Menu, nativeImage, ipcMain } = require('electron');

//获取单例锁
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
    app.quit()
} else {
    const path = require('path');
    const package = require('../../package.json')
    const Store = require('electron-store');
    
    // 初始化 electron-store  需在主进程
    Store.initRenderer();
    
    global.appDirname = __dirname;
    global.mainWindow = null;
    
    app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
    const { createConfigWindow, createWindow } = require('./lib/window');
    
    let configWindow;
    let tray;

    const createTray = async () => {
        const icon = nativeImage.createFromPath(path.resolve(__dirname, "./icon/logo.png"))
        tray = new Tray(icon)

        const contextMenu = Menu.buildFromTemplate([
            {
                label: '打开壁纸程序',
                type: 'normal',
                icon: await nativeImage.createThumbnailFromPath(path.resolve(__dirname, "./icon/app.png"), { height: 16, width: 16 }),
                click: () => {
                    global.mainWindow.show()
                }
            },
            {
                label: '设置', type: 'normal',
                icon: await nativeImage.createThumbnailFromPath(path.resolve(__dirname, "./icon/setting.png"), { height: 16, width: 16 }),
                click: () => {
                    if (configWindow) {
                        configWindow.show()
                    } else {
                        configWindow = createConfigWindow()
                    }
                }
            },
            {
                label: '退出',
                icon: await nativeImage.createThumbnailFromPath(path.resolve(__dirname, "./icon/exit.png"), { height: 16, width: 16 }),
                type: 'normal',
                role: "quit"
            }
        ])

        tray.setContextMenu(contextMenu)
        tray.setToolTip(`${package.name}
版本号：${package.version}`)
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

        ipcMain.handle("open_config", () => {
            if (configWindow) {
                configWindow.show()
            } else {
                configWindow = createConfigWindow()
            }
        })
    }

    app.whenReady().then(() => {
        init()
        global.mainWindow = createWindow();
        createTray()
    })

    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // 当运行第二个实例时,将会聚焦到myWindow这个窗口
        if (global.mainWindow) {
            if (global.mainWindow.isMinimized()) global.mainWindow.restore()
            global.mainWindow.focus()
        }
    })

    app.on('quit', () => {
        app.releaseSingleInstanceLock();//释放所有的单例锁
    });
}