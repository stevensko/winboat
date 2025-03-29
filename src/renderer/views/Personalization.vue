<template>
    <div>
        <x-label class="mb-2 text-neutral-300">Eszközök</x-label>
        <div class="flex flex-col gap-4">
            <x-card
                class="flex items-center p-2 flex-row justify-between w-full py-0 my-0">
                <div class="flex flex-row gap-2 items-center">
                    <div>
                        <x-label>UX Theme Patcher</x-label>
                        <x-label class="mt-1 text-[0.65rem] text-neutral-400">
                            A UX Theme Patcher szükséges az egyedi témák használatához, mivel a Windows nem támogatja azokat alapértelmezetten
                        </x-label>
                    </div>
                </div>
                <div class="flex flex-row justify-center items-center gap-2">
                    <x-label>{{ uxThemeEnabled ? 'Be' : 'Ki' }}</x-label>
                    <x-switch @click="uxThemeEnabled = !uxThemeEnabled" class="ml-auto" :toggled="uxThemeEnabled"></x-switch>
                </div>
            </x-card>
            <x-card
                class="flex items-center p-2 flex-row justify-between w-full py-0 my-0">
                <div class="flex flex-row gap-2 items-center">
                    <div>
                        <x-label>StartAllBack</x-label>
                        <x-label class="mt-1 text-[0.65rem] text-neutral-400">
                            A StartAllBack segítségével a Windows 11 Start menüje visszakapcsolható a régi kinézetre, illetve számos egyéb tweak is elérhetővé válik
                        </x-label>
                    </div>
                </div>
                <div class="flex flex-row justify-center items-center gap-2">
                    <x-label>{{ sabEnabled ? 'Be' : 'Ki' }}</x-label>
                    <x-switch @click="sabEnabled = !sabEnabled" class="ml-auto" :toggled="sabEnabled"></x-switch>
                </div>
            </x-card>
        </div>

        <x-label class="mt-6 mb-2 text-neutral-300">Ikontéma</x-label>
        <div class="flex flex-col gap-4">
            <x-card
                class="flex items-center p-2 flex-row justify-between w-full py-0 my-0">
                <div class="flex flex-row gap-2 items-center">
                    <div>
                        <x-label>UX Theme Patcher</x-label>
                        <x-label class="mt-1 text-[0.65rem] text-neutral-400">
                            A UX Theme Patcher szükséges az egyedi témák használatához, mivel a Windows nem támogatja azokat alapértelmezetten
                        </x-label>
                    </div>
                </div>
                <div class="flex flex-row justify-center items-center gap-2">
                    <x-label>{{ uxThemeEnabled ? 'Be' : 'Ki' }}</x-label>
                    <x-switch @click="uxThemeEnabled = !uxThemeEnabled" class="ml-auto" :toggled="uxThemeEnabled"></x-switch>
                </div>
            </x-card>
            <x-card
                class="flex items-center p-2 flex-row justify-between w-full py-0 my-0">
                <div class="flex flex-row gap-2 items-center">
                    <div>
                        <x-label>StartAllBack</x-label>
                        <x-label class="mt-1 text-[0.65rem] text-neutral-400">
                            A StartAllBack segítségével a Windows 11 Start menüje visszakapcsolható a régi kinézetre, illetve számos egyéb tweak is elérhetővé válik
                        </x-label>
                    </div>
                </div>
                <div class="flex flex-row justify-center items-center gap-2">
                    <x-label>{{ sabEnabled ? 'Be' : 'Ki' }}</x-label>
                    <x-switch @click="sabEnabled = !sabEnabled" class="ml-auto" :toggled="sabEnabled"></x-switch>
                </div>
            </x-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const uxThemeEnabled = ref(false);
const sabEnabled = ref(false);

interface IconTheme {
    name: string;
    image: string;
}

const iconThemes: IconTheme[] = [
    {
        name: 'Windows 11',
        image: 'https://cdn-icons-png.flaticon.com/512/732/732221.png'
    },
    {
        name: 'Windows 10',
        image: 'https://cdn-icons-png.flaticon.com/512/732/732221.png'
    },
    {
        name: 'Windows 8',
        image: 'https://cdn-icons-png.flaticon.com/512/732/732221.png'
    },
    {
        name: 'Windows 7',
        image: 'https://cdn-icons-png.flaticon.com/512/732/732221.png'
    }
]
</script>