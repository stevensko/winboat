<template>
    <div>
        <x-label class="mb-2 text-neutral-300">Böngésző</x-label>
        <div class="grid grid-cols-2 mb-4 gap-2">
            <x-card
                @click="openLink('https://addons.mozilla.org/en-US/firefox/addon/ublock-origin')"
                class="cursor-pointer generic-hover p-2 my-0 flex flex-row gap-2 items-center"
            >
                <Icon class="size-10" icon="mdi:firefox"></Icon>
                <div>
                    <x-label>Firefox Reklámvédelem</x-label>
                    <x-label class="mt-1 text-[0.65rem] text-neutral-400">uBlock Origin segítségével</x-label>
                </div>
                <Icon class="size-5 ml-auto" icon="bitcoin-icons:caret-right-filled"></Icon>
            </x-card>
            <x-card
                @click="openLink('https://chromewebstore.google.com/detail/ublock-origin-lite/ddkjiahejlhfcafbddmgiahcphecmpfh')"
                class="cursor-pointer generic-hover p-2 my-0 flex flex-row gap-2 items-center"
            >
                <Icon class="size-10" icon="lineicons:chrome"></Icon>
                <div>
                    <x-label>Chrome Reklámvédelem</x-label>
                    <x-label class="mt-1 text-[0.65rem] text-neutral-400">uBlock Origin Lite (Manifest v3) segítségével</x-label>
                </div>
                <Icon class="size-5 ml-auto" icon="bitcoin-icons:caret-right-filled"></Icon>
            </x-card>
        </div>
        <x-label class="mb-2 text-neutral-300">Általános</x-label>
        <div class="flex flex-col gap-4">
            <x-card v-for="(setting, index) in settings" :key="index"
                class="flex items-center p-2 flex-row justify-between w-full py-0 my-0">
                <div>
                    <x-label>{{ setting.label }}</x-label>
                    <x-label class="mt-1 text-[0.65rem] text-neutral-400">{{ setting.description }}</x-label>
                </div>
                <div class="flex flex-row justify-center items-center gap-2">
                    <x-label>{{ setting.value ? 'Be' : 'Ki' }}</x-label>
                    <x-switch v-model="setting.value"></x-switch>
                </div>
            </x-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

async function openLink(link: string) {
    await window.electronAPI.openLink(link);
}

interface Setting {
    label: string;
    description: string;
    value: boolean;
    actions?: {
        // A beállítás állapotának ellenőrzése
        scan:  () => void;
        // A beállítás bekapcsolása
        on: () => void;
        // A beállítás kikapcsolása
        off: () => void;
    }
}

const settings = ref<Setting[]>([
    {
        label: 'A File Explorer hirdetések letiltása',
        description: 'Megakadályozza a hirdetések megjelenítését a Fájlkezelőben. (Fájlkezelő átláthatóbbá tétele)',
        value: false,
    },
    {
        label: 'Kapcsolja ki az "Üdvözöljük" hirdetéseket',
        description: 'Letiltja az "Üdvözlünk!" élményben megjelenő hirdetéseket. (Tisztább kezdés)',
        value: true,
    },
    {
        label: 'Tiltsa le a Beállítások hirdetéseket',
        description: 'Megakadályozza a szponzorált tartalmak és hirdetések megjelenítését a Beállítások alkalmazásban. (Zavaró tényezők elkerülése)',
        value: true,
    },
    {
        label: 'Általános tippek és hirdetések letiltása',
        description: 'Letiltja az operációs rendszer által megjelenített tippeket és hirdetéseket. (Fókuszáltabb használat)',
        value: false,
    },
    {
        label: 'A "Testreszabott élmények" letiltása',
        description: 'Megakadályozza a személyre szabott hirdetések és javaslatok megjelenítését. (Adatvédelem növelése)',
        value: false,
    },
    {
        label: 'A "Beállítás befejezése" hirdetések letiltása',
        description: 'Letiltja a beállítások véglegesítése után megjelenő hirdetéseket és javaslatokat. (Rendszer indítási élmény javítása)',
        value: true,
    },
    {
        label: 'A Start menü hirdetéseinek letiltása',
        description: 'Megakadályozza a hirdetések megjelenítését a Start menü ajánlott alkalmazások részében. (Letisztultabb Start menü)',
        value: true,
    },
    {
        label: 'Tiltsa le a zárolási képernyőre vonatkozó tippeket és hirdetéseket',
        description: 'Letiltja a zárolási képernyőn megjelenő tippeket, trükköket és hirdetéseket. (Zavaró tényezők elkerülése, adatvédelem növelése)',
        value: true,
    },
    {
        label: 'Értesítési javaslatok letiltása',
        description: 'Letiltja az alkalmazások és a rendszer által küldött javaslatokat az értesítési központban. (Csak a legfontosabb értesítések megjelenítése)',
        value: true,
    },
    {
        label: 'Reklámok szűrése HOST lista',
        description: 'A HOST fájl használatáva blokkolja a ismert hirdetési szervereket. (Összességében hatékony hirdetésblokkolás)',
        value: false,
    },
    {
        label: 'Tiltsa le a Bing keresést helyi kereséskor',
        description: 'Megakadályozza, hogy a Bing keresőt használják a helyi keresésekhez. (Saját kereső használata)',
        value: true,
    },
    {
        label: 'A személyre szabott hirdetések letiltása',
        description: 'Megakadályozza a személyre szabott hirdetések megjelenítését, amelyek a felhasználói adatokon alapulnak. (Adatvédelem megőrzése)',
        value: true,
    },
]);
</script>