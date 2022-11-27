import Vue from 'vue';
import { Message, Select, Option, Input, Loading, Badge } from 'element-ui';
import { byte } from "@/libs/util"

import Store from '@/store';
import "@/components/index.js"

import 'element-ui/lib/theme-chalk/index.css';
import '@/style/iconfont.css';
import '@/style/index.less';

Vue.use(Store)
Vue.use(Select)
Vue.use(Option)
Vue.use(Input)
Vue.use(Badge)
Vue.use(Loading.directive);
Vue.prototype.$ELEMENT = { size: 'mini', zIndex: 3000 };
Vue.prototype.$message = Message;
Vue.config.productionTip = false

Vue.filter('byte', byte);