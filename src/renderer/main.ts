import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import { MotionPlugin } from '@vueuse/motion'   
import './index.css'
import { autoScroll } from "./directives/autoscroll";

createApp(App)
    .directive('auto-scroll', autoScroll)
    .use(router)
    .use(MotionPlugin)
    .mount("#app");