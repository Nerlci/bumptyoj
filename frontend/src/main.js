import Vue from "vue";
import App from "./App.vue";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import { Message } from "element-ui";

import { getRequest } from "@/utils/request";
import { postRequest } from "@/utils/request";

import db from "./utils/sessionStorage";
import * as config from "./utils/config";
import router from "./router";
import store from "./store";
import VueClipboard from "vue-clipboard2";

import iconPicker from "vue-fontawesome-elementui-icon-picker";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fab } from "@fortawesome/free-brands-svg-icons";

library.add(fab);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(iconPicker);
Vue.use(VueClipboard);

Vue.prototype.$db = db;
Vue.prototype.$config = config;
Vue.prototype.$message = Message;
Vue.prototype.getRequest = getRequest;
Vue.prototype.postRequest = postRequest;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
