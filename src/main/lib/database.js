const Store = require('electron-store');

const dbNames = ['collections', 'downFiles', 'downDoneFiles', 'appConfig']

const defaultsValue = {
    appConfig: {
        previewMode: 'waterfall',
        downloadPath: '',
        openAtLogin: false
    }
}

const db = (function (dbnames) {
    let dbs = {}
    dbnames.forEach(name => {
        dbs[name] = new Store({
            projectSuffix: '',
            name,
            defaults: defaultsValue[name],
            watch: true
        })
    })
    return dbs
})(dbNames)

module.exports = {
    db,
    dbNames
}