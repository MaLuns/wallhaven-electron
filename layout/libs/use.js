import Vue from 'vue';
import Store from '@/store';
import Message from "@/components/message/index.js"
import { byte } from "@/libs/util"

import "@/components/index.js"
import '@/style/fonts/iconfont.css';
import '@/style/index.less';

Vue.use(Store)
Vue.prototype.$message = Message;
Vue.config.productionTip = false

Vue.filter('byte', byte);