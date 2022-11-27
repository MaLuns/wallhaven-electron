export default {
    install(Vue) {
        const storesApi = {}
        const stores = ['collections', 'downFiles', 'downDoneFiles', 'appConfig']

        stores.forEach(name => {
            const funs = ['set', 'get', 'reset', 'has', 'delete', 'clear', 'onDidChange', 'onDidAnyChange']
            const attrs = ['size', 'store', 'path']

            let obj = Object.create(null)

            funs.forEach(fun => {
                obj[fun] = (...res) => window.store[name][fun](...res)
            })

            attrs.forEach(attr => {
                Object.defineProperty(obj, attr, {
                    get() {
                        return window.store[name]['get_' + attr]()
                    }
                })
            })

            storesApi[name] = obj
        })

        Vue.prototype.$store = storesApi
    }
}