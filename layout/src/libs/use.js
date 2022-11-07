import Vue from 'vue';
import { Message, Select, Option, Checkbox, CheckboxButton, CheckboxGroup, Input, Loading, Progress, Badge } from 'element-ui';
import { byte } from "@/libs/util"

import "@/views/index.js"

import 'element-ui/lib/theme-chalk/index.css';
import '@/style/iconfont.css';
import '@/style/index.less';

Vue.use(Select)
Vue.use(Checkbox)
Vue.use(Option)
Vue.use(CheckboxButton)
Vue.use(CheckboxGroup)
Vue.use(Input)
Vue.use(Progress)
Vue.use(Badge)
Vue.use(Loading.directive);
Vue.prototype.$ELEMENT = { size: 'mini', zIndex: 3000 };
Vue.prototype.$message = Message;
Vue.config.productionTip = false

Vue.filter('byte', byte);