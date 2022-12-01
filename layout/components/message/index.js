import Vue from 'vue';
import Main from './index.vue'

let MessageConstructor = Vue.extend(Main)

let instance;
let instances = [];
let seed = 1;
let zIndex = 2000

function Message(options) {
    options = options || {};
    if (typeof options === 'string') {
        options = {
            message: options
        };
    }
    let userOnClose = options.onClose;
    let id = 'message_' + seed++;

    options.onClose = function () {
        Message.close(id, userOnClose);
    };

    instance = new MessageConstructor({
        data: options
    });
    instance.id = id;
    instance.$mount();
    document.body.appendChild(instance.$el);

    instance.verticalOffset = (options.offset || 50) + (instances.length * 56);
    instance.visible = true;
    instance.$el.style.zIndex = zIndex;
    instances.push(instance);
    return instance;

}

['success', 'warning', 'info', 'error'].forEach(type => {
    Message[type] = (options) => {
        if (typeof options === 'string') {
            return Message({
                type,
                message: options
            });
        }
        return Message({
            ...options,
            type
        });
    };
});

Message.close = function (id, userOnClose) {
    let len = instances.length;
    let index = -1;
    let removedHeight;
    for (let i = 0; i < len; i++) {
        if (id === instances[i].id) {
            removedHeight = instances[i].$el.offsetHeight;
            index = i;
            if (typeof userOnClose === 'function') {
                userOnClose(instances[i]);
            }
            instances.splice(i, 1);
            break;
        }
    }
    if (len <= 1 || index === -1 || index > instances.length - 1) return;
    for (let i = index; i < len - 1; i++) {
        let dom = instances[i].$el;
        dom.style['top'] = parseInt(dom.style['top'], 10) - removedHeight - 16 + 'px';
    }
};

Message.closeAll = function () {
    for (let i = instances.length - 1; i >= 0; i--) {
        instances[i].close();
    }
};


export default Message