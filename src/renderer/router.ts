import { createMemoryHistory, createRouter, RouteRecordRaw } from 'vue-router'

import Home from './views/Home.vue'
import Adblock from './views/Adblock.vue'
import InstallCenter from './views/InstallCenter.vue'
import Personalization from './views/Personalization.vue'
import SetupUI from './views/SetupUI.vue'

export const routes: RouteRecordRaw[] = [
    { path: '/', name: "Home", component: Home, meta: { icon: 'fluent:home-32-filled' } },
    { path: '/setup', name: "SetupUI", component: SetupUI, meta: { icon: 'fluent-mdl2:install-to-drive' } },
    { path: '/adblock', name: "Reklámvédelem", component: Adblock, meta: { icon: 'fluent:shield-32-filled' } },
    { path: '/install-center', name: "Telepítő Központ", component: InstallCenter, meta: { icon: 'fluent:apps-32-filled' } },
    { path: '/personalization', name: "Téma és Felület", component: Personalization, meta: { icon: 'fluent:paint-brush-32-filled' } },
    { path: '/special-settings', name: "Speciális Beállítások", component: Home, meta: { icon: 'fluent:settings-32-filled' } },
    { path: '/supervision-tools', name: "Felügyeleti Eszközök", component: Home, meta: { icon: 'fluent:glasses-32-filled' } },
    { path: '/foxcomm', name: "OpenFox Eszközök", component: Home, meta: { icon: 'fluent:animal-paw-print-32-filled' } },
    { path: '/cell-menu', name: "Cell Menü", component: Home, meta: { icon: 'fluent:panel-right-32-filled' } },
    { path: '/windows-components', name: "Windows Komponensek", component: Home, meta: { icon: 'fluent:window-apps-32-filled' } },
    { path: '/network', name: "Hálozat és VPN", component: Home, meta: { icon: 'fluent:plug-connected-32-filled' } },
    { path: '/domain', name: "Tartománykezelő", component: Home, meta: { icon: 'fluent:globe-32-filled' } },
    { path: '/about', name: "About", component: Home, meta: { icon: 'fluent:info-32-filled' } },

]

export const router = createRouter({
    history: createMemoryHistory(),
    routes,
})