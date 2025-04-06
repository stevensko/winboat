<template>
    <div>
        <x-label class="text-neutral-300">Apps</x-label>
        <div class="px-2">
            <x-accordion v-for="group of appGroups">
                <header>
                    <x-label>{{ group.category }}</x-label>
                </header>

                <main>
                    <div class="grid app-grid gap-4">
                        <x-card v-for="app of group.apps" :key="app.package"
                            @click="isAppSelected(app) ? removeApp(app) : addApp(app)"
                            class="cursor-pointer generic-hover p-2 my-0 flex flex-row gap-2 items-center">
                            <Icon v-if="!app.icon?.startsWith('http')" class="size-10" :icon="app.icon!"></Icon>
                            <img v-else class="size-10 rounded-md" :src="app.icon!"></img>
                            <div>
                                <x-label>{{ app.name }}</x-label>
                            </div>
                            <x-checkbox class="ml-auto" :toggled="isAppSelected(app)"></x-checkbox>
                        </x-card>
                    </div>
                </main>
            </x-accordion>
        </div>

        <div class="mt-6 flex flex-col gap-4">
            <x-label>Telepítendő Csomagok ({{ selectedApps.length }})</x-label>
            <x-label v-if="!selectedApps.length" class="px-2 text-neutral-400">
                Válassz ki legalább egy csomagot ahhoz, hogy telepíthess
            </x-label>
            <div class="flex flex-col gap-4">
                <div class="flex flex-row flex-wrap gap-2">
                    <x-tag v-for="app of selectedApps" :key="app.package" :value="app.package"
                        @click="selectedApps = selectedApps.filter(selectedApp => selectedApp.package !== app.package)">
                        <Icon icon="material-symbols:close-rounded"></Icon>
                        <x-label class="pr-1">{{ app.name }}</x-label>
                    </x-tag>
                </div>
                <x-button v-if="selectedApps.length" @click="mockInstall" toggled>
                    <x-label>Telepítés</x-label>

                    <dialog id="install-dialog" class="text-white">
                        <main class="flex flex-col items-center justify-center w-[50vw]">
                            <div class="flex flex-row gap-2 justify-center items-center">
                                <Icon class="size-32" icon="hugeicons:package-open"></Icon>
                                <Icon class="size-20 mx-6" icon="cil:arrow-right"></Icon>
                                <Icon class="size-32" icon="hugeicons:hard-drive"></Icon>
                            </div>
                            <h2 v-if="!installCompleted" class="mb-1 text-xl text-center">Az OpenFox módosításokat hajt végre a rendszeren</h2>
                            <h2 v-else class="mb-1 text-xl text-center">Az OpenFox sikeresen telepítette a csomagokat</h2>

                            <x-progressbar v-if="!installCompleted" class="my-6"></x-progressbar>

                            <div v-if="!installCompleted" class="flex flex-row justify-center items-center gap-2">
                                <x-throbber class="size-6"></x-throbber>
                                <x-label>
                                    Csomagok Telepítése {{ installProgress + 1 }} / {{ selectedApps.length }}
                                    <span class="ml-1 mr-2">·</span>  
                                    <span class="inline-block translate-y-1">
                                        <Icon v-if="!selectedApps[installProgress].icon?.startsWith('http')" class="size-4" :icon="selectedApps[installProgress].icon!"></Icon>
                                        <img v-else class="size-4" :src="selectedApps[installProgress].icon!"></img>
                                    </span>
                                    {{ selectedApps[installProgress].name }}
                                </x-label>
                            </div>
                            <div v-else class="flex flex-row gap-2 items-center mt-2">
                                <Icon icon="mdi:check-bold" class="size-6 text-green-500"></Icon>
                                Minden csomag sikeresen telepítve
                            </div>
                        </main>

                        <footer v-if="installCompleted">
                            <x-button autofocus toggled id="close-button" @click="closeInstallDialog()">
                                <x-label>Befejezés</x-label>
                            </x-button>
                        </footer>
                    </dialog>
                </x-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { ref } from 'vue';
import { appGroups, type App } from '../data/appgroups';

const selectedApps = ref<App[]>([]);
const installCompleted = ref(false);
const installProgress = ref(0);

function addApp(app: App) {
    selectedApps.value.push(app);
}

function removeApp(app: App) {
    selectedApps.value = selectedApps.value.filter(selectedApp => selectedApp.package !== app.package);
}

function isAppSelected(app: App) {
    console.log("Checking if app is selected", app);
    return selectedApps.value.some(selectedApp => selectedApp.package === app.package);
}

function mockInstall() {
    // Prevent a bug occuring where the "Close" button triggers the install dialog to open again
    if (installCompleted.value) return;

    console.log(`chocolatey install ${selectedApps.value.map(app => app.package).join(' ')} -y`);

    // Install from 0 to selectedApps.length with interval of 2 second
    installCompleted.value = false;
    installProgress.value = 0;
    const interval = setInterval(() => {
        if (installProgress.value < selectedApps.value.length) {
            installProgress.value++;
        } else {
            clearInterval(interval);
            installCompleted.value = true;
        }
    }, 2000);
}

function closeInstallDialog() {
    const dialog = document.getElementById('install-dialog') as HTMLDialogElement;
    dialog?.close();
}
</script>

<style scoped>
.app-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
</style>