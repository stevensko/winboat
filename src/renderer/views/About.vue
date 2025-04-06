<template>
    <div class="flex flex-col items-center justify-center h-[calc(100vh-9rem)]">
        <img class="w-48 contrast-75" src="/img/winboat_logo.png">
        <h2 class="mb-0">WinBoat</h2>
        <p class="text-gray-500 text-sm">Windows for 🐧 penguins</p>
        <p class="text-gray-400 !mt-4">WinBoat Pre-Release Alpha {{ appVer }}</p>
        <div>

        </div>
        <p class="text-gray-400 !mt-16">
            WinBoat is
            <a @click="openAnchorLink" href="https://github.com/TibixDev/WinBoat">open-source software</a>
        </p>
        <p class="text-gray-400 !mt-0">Copyright (c) 2025 TibixDev</p>
    </div>
</template>

<script setup lang="ts">
import { openAnchorLink } from '../utils/openLink';
const appVer = import.meta.env.VITE_APP_VERSION;
</script>