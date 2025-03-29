<template>
    <main class="h-screen w-screen">
        <x-titlebar
            @minimize="handleMinimize()"
            @buttonclick="handleTitleBarEvent"
        class="bg-grey-900">
            <x-label>WinBoat</x-label>
        </x-titlebar>

        <div v-if="useRoute().name !== 'SetupUI'" class="flex flex-row">
            <x-nav class="w-64 flex flex-col gap-0.5">
                <div class="p-4 flex flex-row items-center gap-4">
                    <img class="rounded-full w-16"
                        src="https://i.redd.it/windows-xp-user-icons-part-1-v0-soali9nw74qb1.jpg?width=1063&format=pjpg&auto=webp&s=e9002d903bd25dca2af09ebbcb87cb8f5460c607"
                        alt="Profile Picture">
                    <div>
                        <x-label class="text-lg font-semibold">Kókánymester</x-label>
                        <x-label class="text-[0.8rem]">Helyi Fiók</x-label>
                    </div>
                </div>
                <RouterLink v-for="route of routes" :to="route.path" :key="route.path">
                    <x-navitem value="first">
                        <Icon class="w-5 h-5 mr-4" :icon="route.meta!.icon"></Icon>
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

onMounted(() => {
    useRouter().push('/setup')
})

function handleMinimize() {
    console.log("Minimize")
    window.electronAPI.minimizeWindow();
}

function handleTitleBarEvent(e: CustomEvent) {
    console.log("ClickEvt", e);
    switch(e.detail) {
        case "close":
            window.electronAPI.closeWindow();
            break;
        case "maximize":
            window.electronAPI.maximizeWindow();
            break;
        case "minimize":
            window.electronAPI.minimizeWindow();
            break;
    }
}
</script>