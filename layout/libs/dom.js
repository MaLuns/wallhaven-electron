/**
 * 事件绑定
 */
export const on = (function () {
    return function (element, event, handler) {
        if (element && event && handler) {
            element.addEventListener(event, handler, false);
        }
    };
})();

/**
 * 事件取消
 */
export const off = (function () {
    return function (element, event, handler) {
        if (element && event) {
            element.removeEventListener(event, handler, false);
        }
    };
})();