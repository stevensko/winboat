<template>
    <div>
        <div class="flex items-center justify-between mb-6">
            <x-label class="text-neutral-300">Apps</x-label>
            <x-input
                id="select-username"
                class="w-64 max-w-64"
                type="text"
                maxlength="32"
                :value="searchInput"
                @input="(e: any) => searchInput = e.target.value"
            >
                <x-icon href="#search"></x-icon>
                <x-label>Search</x-label>
            </x-input>
        </div>
        <div class="px-2">
            <main>
                <div v-if="apps.length" class="grid app-grid gap-4">
                    <x-card
                        v-for="app of computedApps" :key="app.Name"
                        class="cursor-pointer generic-hover p-2 my-0 flex flex-row gap-2 items-center justify-between bg-neutral-800/20 backdrop-brightness-150 backdrop-blur-xl"
                        @click="winboat.launchApp(app)"
                    >
                        <div class="flex flex-row items-center gap-2 w-[85%]">
                            <img class="size-10 rounded-md" :src="`data:image/jpeg;charset=utf-8;base64,${app.Icon}`"></img>
                            <x-label class="text-ellipsis truncate">{{ app.Name }}</x-label>
                        </div>
                        <Icon icon="cuida:caret-right-outline"></Icon>
                    </x-card>
                </div>
                <div v-else class="flex justify-center items-center mt-40">
                    <x-throbber class="w-16 h-16"></x-throbber>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { computed, onMounted, ref } from 'vue';
import { Winboat } from '../lib/winboat';
import { type WinApp } from '../../types';

const winboat = new Winboat();
const apps = ref<WinApp[]>([]);
const searchInput = ref('');

const computedApps = computed(() => {
    if (!searchInput.value) return apps.value.sort((a, b) => a.Name.localeCompare(b.Name));
    return apps.value
        .filter(app => app.Name.toLowerCase().includes(searchInput.value.toLowerCase()))
        .sort((a, b) => a.Name.localeCompare(b.Name));
})

onMounted(async () => {
    apps.value = await winboat.getApps();
})
</script>

<style scoped>
.app-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
</style>