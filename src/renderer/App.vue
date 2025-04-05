<template>
    <main class="h-screen w-screen">
        <x-titlebar
            @minimize="handleMinimize()"
            @buttonclick="handleTitleBarEvent"
        class="bg-neutral-900">
            <x-label>WinBoat</x-label>
        </x-titlebar>

        <div v-if="useRoute().name !== 'SetupUI'" class="flex flex-row">
            <x-nav class="w-64 flex flex-col gap-0.5">
                <div class="p-4 flex flex-row items-center gap-4">
                    <img class="rounded-full w-16"
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png"
                        alt="Profile Picture">
                    <div>
                        <x-label class="text-lg font-semibold">{{ os.userInfo().username }}</x-label>
                        <x-label class="text-[0.8rem]">Local Account</x-label>
                    </div>
                </div>
                <RouterLink v-for="route of routes.filter(r => r.name != 'SetupUI')" :to="route.path" :key="route.path">
                    <x-navitem value="first">
                        <Icon class="w-5 h-5 mr-4" :icon="(route.meta!.icon as string)"></Icon>
                        <x-label>{{ route.name }}</x-label>
                    </x-navitem>
                </RouterLink>
            </x-nav>
            <div class="px-5 flex-grow max-h-[calc(100vh-2.5rem)] overflow-y-auto pb-4">
                <div class="flex flex-row items-center gap-2 my-6">
                    <Icon class="w-6 h-6 opacity-60" icon="icon-park-solid:toolkit"></Icon>
                    <h1 class="text-2xl font-semibold opacity-60">
                        WinBoat
                    </h1>
                    <Icon class="w-6 h-6" icon="bitcoin-icons:caret-right-filled"></Icon>
                    <Icon class="w-6 h-6" :icon="(useRoute().meta.icon as string)"></Icon>
                    <h1 class="text-2xl font-semibold">
                        {{ useRoute().name }}
                    </h1>
                </div>
                <RouterView />
            </div>
        </div>

        <div v-else class="w-full h-[calc(100vh-2rem)]">
            <RouterView />
        </div>
    </main>
</template>

<script setup lang="ts">
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { routes } from './router';
import { Icon } from '@iconify/vue';
import { onMounted } from 'vue';
import { isInstalled } from './lib/install';
const { BrowserWindow }: typeof import('@electron/remote') = require('@electron/remote')
const os: typeof import('os') = require('os')
const path: typeof import('path') = require('path')
const remote: typeof import('@electron/remote') = require('@electron/remote');

const $router = useRouter();

onMounted(async () => {
    console.log("WinBoat app path:", path.join(remote.app.getAppPath(), "..", ".."));
    const winboatInstalled = await isInstalled();
    if (!winboatInstalled) {
        console.log("Not installed, redirecting to setup...")
        $router.push('/setup')
    }
})

function handleMinimize() {
    console.log("Minimize")
    window.electronAPI.minimizeWindow();
}

function handleTitleBarEvent(e: CustomEvent) {
    console.log("TitleBarEvt", e);
    switch(e.detail) {
        case "close":
            BrowserWindow.getFocusedWindow()!.close();
            break;
        case "maximize":
            if (BrowserWindow.getFocusedWindow()!.isMaximized()) {
                BrowserWindow.getFocusedWindow()!.unmaximize();
            } else {
                BrowserWindow.getFocusedWindow()!.maximize();
            }
            break;
        case "minimize":
            BrowserWindow.getFocusedWindow()!.minimize();
            break;
    }
}
</script>