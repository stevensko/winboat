<template>
    <div class="relative size-full p-16 overflow-hidden">
        <div class="size-full rounded-3xl bg-[#1F1F1F] shadow-lg shadow-black/50 gap-4 p-5 grid grid-cols-2">
            <div>
                <div id="stepStatus" class="flex flex-row justify-center gap-4 pt-2">
                    <div
                        v-for="(step, idx) of steps"
                        :key="idx"
                        class="w-4 h-4 rounded-full bg-neutral-700 transition duration-1000"
                        :class="{
                            'bg-neutral-500': idx < currentStepIdx,
                            'bg-violet-400': idx === currentStepIdx,
                            'bg-neutral-700': idx > currentStepIdx,
                        }"
                    ></div>
                </div>
                <Transition name="bounce" mode="out-in">
                    <div :key="currentStepIdx" id="stepIcon" class="flex items-center justify-center relative h-full">
                        <Icon key="icon1" class="size-[60%] text-violet-400 z-30 relative" :icon="currentStep.icon"></Icon>
                        <Icon key="icon-gradient" class="size-[60%] text-violet-400 brightness-75 z-20 absolute top-[50%] translate-y-[-50%] blur-2xl" :icon="currentStep.icon"></Icon>
                        <Icon key="icon2" class="size-[60%] text-violet-400 brightness-75 z-20 absolute top-[51.5%] translate-y-[-50%] translate-x-[1.5%]" :icon="currentStep.icon"></Icon>
                        <Icon key="icon3" class="size-[60%] text-violet-400 brightness-50 z-10 absolute top-[53%] translate-y-[-50%] translate-x-[3%]" :icon="currentStep.icon"></Icon>                    
                    </div>
                </Transition>
            </div>

            <Transition name="bouncedown" mode="out-in">
                <div :key="currentStepIdx" id="stepContent" class="overflow-scroll">
                    <!-- Welcome -->
                    <div v-if="currentStep.id === StepID.WELCOME" class="flex flex-col gap-4 h-full">
                        <h1 class="text-3xl font-semibold">Welcome to WinBoat</h1>
                        <p class="text-lg text-gray-400">
                            WinBoat is a full fledged app that helps you natively run Windows applications on your Linux machine with ease.
                        </p>
                        <p class="text-lg text-gray-400">
                            We will go through a few required steps to get you started in no time.
                        </p>
                        <div class="flex flex-row gap-4">
                            <x-button toggled class="px-6" @click="currentStepIdx++">Next</x-button>
                        </div>
                    </div>
    
                    <!-- License -->
                    <div v-if="currentStep.id === StepID.LICENSE" class="flex flex-col gap-4 h-full">
                        <h1 class="text-3xl font-semibold">License Agreement</h1>
                        <p class="text-lg text-gray-400">
                            WinBoat is open-source software licensed under the MIT License. Please review the license agreement below.
                        </p>
                        <pre class="text-sm text-gray-400 bg-neutral-800 p-4 rounded-lg overflow-auto">{{ license }}</pre>
                        <div class="flex flex-row gap-4">
                            <x-button class="px-6" @click="currentStepIdx--">Back</x-button>
                            <x-button toggled class="px-6" @click="currentStepIdx++">I Agree</x-button>
                        </div>
                    </div>

                    <!-- Pre-Requisites -->
                    <div v-if="currentStep.id === StepID.PREREQUISITES" class="flex flex-col gap-4 h-full">
                        <h1 class="text-3xl font-semibold">Pre-Requisites</h1>
                        <p class="text-lg text-gray-400">
                            In order to run WinBoat, your computer must meet the following requirements.
                        </p>
                        <ul class="text-lg text-gray-400 list-none space-y-2 bg-neutral-800 py-4 rounded-lg">
                            <li class="flex items-center gap-2">
                                <span v-if="specs.ramGB >= 4" class="text-green-500">✔</span>
                                <span v-else class="text-red-500">✘</span>
                                At least 4 GB of RAM (Detected: {{ specs.ramGB }} GB)
                            </li>
                            <li class="flex items-center gap-2">
                                <span v-if="specs.cpuThreads >= 2" class="text-green-500">✔</span>
                                <span v-else class="text-red-500">✘</span>
                                At least 2 CPU threads (Detected: {{ specs.cpuThreads }} threads)
                            </li>
                            <li class="flex items-center gap-2">
                                <span v-if="specs.kvmEnabled" class="text-green-500">✔</span>
                                <span v-else class="text-red-500">✘</span>
                                KVM enabled
                                <a href="https://linux-kvm.org/page/FAQ" target="_blank" class="text-violet-400 hover:underline ml-1">How?</a>
                            </li>
                            <li class="flex items-center gap-2">
                                <span v-if="specs.dockerInstalled" class="text-green-500">✔</span>
                                <span v-else class="text-red-500">✘</span>
                                Docker installed
                                <a href="https://docs.docker.com/get-docker/" target="_blank" class="text-violet-400 hover:underline ml-1">How?</a>
                            </li>
                        </ul>
                        <div class="flex flex-row gap-4 mt-6">
                            <x-button class="px-6" @click="currentStepIdx--">Back</x-button>
                            <x-button 
                                toggled 
                                class="px-6" 
                                @click="currentStepIdx++" 
                                :disabled="!(specs.ramGB >= 4 && specs.cpuThreads >= 2 && specs.kvmEnabled && specs.dockerInstalled)"
                            >
                                Next
                            </x-button>
                        </div>
                    </div>
    
                    <!-- Windows Configuration -->
                    <div v-if="currentStep.id === StepID.WINDOWS_CONFIG" class="flex flex-col gap-4 h-full">
                        <h1 class="text-3xl font-semibold">Configure Windows</h1>
                        <p class="text-lg text-gray-400">
                            Pick the version of Windows you want to install, and the language you'd like to use.
                        </p>
    
                        <p class="text-lg text-gray-400">
                            You can only change these settings now. Once the installation is complete, you will not be able to change them unless you reinstall.
                        </p>
    
    
                        <div>
                            <label for="select-edition" class="text-sm mb-4 text-neutral-400">Select Edition</label>
                            <x-select id="select-edition" @change="(e: any) => windowsVersion = e.detail.newValue" class="w-64">
                                <x-menu>
                                    <x-menuitem
                                        v-for="(version, key) in WINDOWS_VERSIONS"
                                        :key="key"
                                        :value="key"
                                        :toggled="windowsVersion === key"
                                    >
                                        <x-label>{{ version }}</x-label>
                                    </x-menuitem>
                                </x-menu>
                            </x-select>
                        </div>
    
                        <div>
                            <label for="select-language" class="text-sm mb-4 text-neutral-400">Select Language</label>
                            <x-select id="select-language" @change="(e: any) => windowsLanguage = e.detail.newValue" class="w-64">
                                <x-menu @change="(e: any) => windowsLanguage = e.detail.newValue">
                                    <x-menuitem
                                        v-for="(language, languageWithBanner) in WINDOWS_LANGUAGES"
                                        :key="language"
                                        :value="language"
                                        :toggled="windowsLanguage === language"
                                    >
                                        <x-label>{{ languageWithBanner }}</x-label>
                                    </x-menuitem>
                                </x-menu>
                            </x-select>
                        </div>
    
                        <div class="flex flex-row gap-4 mt-6">
                            <x-button class="px-6" @click="currentStepIdx--">Back</x-button>
                            <x-button toggled class="px-6" @click="currentStepIdx++">Next</x-button>
                        </div>
                    </div>
    
                    <!-- Hardware Configuration -->
                    <div v-if="currentStep.id === StepID.HARDWARE_CONFIG" class="flex flex-col gap-4 h-full">
                        <h1 class="text-3xl font-semibold">Hardware Configuration</h1>
                        <p class="text-lg text-gray-400">
                            WinBoat utilizes a containerized KVM virtual machine to run Windows applications. Please configure the hardware settings for the virtual machine.
                        </p>
    
                        <p class="text-lg text-gray-400">
                            It is not recommended to allocate more than half of your system resources to Windows. You will be able to change these settings later on if needed.
                        </p>
    
    
                        <div class="flex flex-col gap-6">
                            <div>
                                <label for="select-cpu-cores" class="text-sm text-neutral-400">Select CPU Cores</label>
                                <div class="flex flex-row gap-4 items-center">
                                    <x-slider
                                        id="select-cpu-cores"
                                        @change="(e: any) => cpuThreads = Number(e.target.value)"
                                        class="w-[50%]"
                                        :value="cpuThreads"
                                        :min="MIN_CPU_THREADS"
                                        :max="specs.cpuThreads"
                                        step="1"
                                        ticks
                                    ></x-slider>
                                    <x-label>{{ cpuThreads }} Cores</x-label>
                                </div>
                            </div>
        
                            <div>
                                <label for="select-ram" class="text-sm text-neutral-400">Select RAM</label>
                                <div class="flex flex-row gap-4 items-center">
                                    <x-slider
                                        id="select-ram"
                                        @change="(e: any) => ramGB = Number(e.target.value)"
                                        class="w-[50%]"
                                        :value="ramGB"
                                        :min="MIN_RAM_GB"
                                        :max="specs.ramGB"
                                        step="1"
                                    ></x-slider>
                                    <x-label>{{ ramGB }} GB</x-label>
                                </div>
                            </div>
        
                            <div>
                                <label for="select-disk" class="text-sm text-neutral-400">Select Disk Size</label>
                                <div class="flex flex-row gap-4 items-center">
                                    <x-slider
                                        id="select-disk"
                                        @change="(e: any) => diskGB = Number(e.target.value)"
                                        class="w-[50%]"
                                        :value="diskGB"
                                        :min="MIN_DISK_GB"
                                        :max="specs.diskSpaceGB"
                                        step="8"
                                    ></x-slider>
                                    <x-label>{{ diskGB }} GB</x-label>
                                </div>
                            </div>
                        </div>

    
                        <div class="flex flex-row gap-4 mt-6">
                            <x-button class="px-6" @click="currentStepIdx--">Back</x-button>
                            <x-button toggled class="px-6" @click="currentStepIdx++">Next</x-button>
                        </div>
                    </div>
    
                    <!-- Review -->
                    <div v-if="currentStep.id === StepID.REVIEW" class="flex flex-col gap-6 h-full">
                        <h1 class="text-3xl font-semibold text-white">Review</h1>
                        <p class="text-lg text-gray-400">
                            Please review the settings you've chosen for your WinBoat installation. If everything looks correct, click "Install" to begin.
                        </p>
    
                        <div class="bg-neutral-800 p-6 rounded-lg flex flex-col gap-4">
                            <h2 class="text-xl font-medium text-white mt-0 mb-2">Your Configuration</h2>
                            
                            <div class="grid grid-cols-2 gap-4">
                                <div class="flex flex-col">
                                    <span class="text-sm text-gray-400">Windows Version</span>
                                    <span class="text-base text-white">{{ WINDOWS_VERSIONS[windowsVersion] }}</span>
                                </div>
                                <div class="flex flex-col">
                                    <span class="text-sm text-gray-400">Language</span>
                                    <span class="text-base text-white">{{ windowsLanguage }}</span>
                                </div>
                                <div class="flex flex-col">
                                    <span class="text-sm text-gray-400">CPU Cores</span>
                                    <span class="text-base text-white">{{ cpuThreads }} Cores</span>
                                </div>
                                <div class="flex flex-col">
                                    <span class="text-sm text-gray-400">RAM</span>
                                    <span class="text-base text-white">{{ ramGB }} GB</span>
                                </div>
                                <div class="flex flex-col">
                                    <span class="text-sm text-gray-400">Disk Size</span>
                                    <span class="text-base text-white">{{ diskGB }} GB</span>
                                </div>
                            </div>
                        </div>
    
                        <div class="flex flex-row gap-4 mt-6">
                            <x-button class="px-6" @click="currentStepIdx--">Back</x-button>
                            <x-button toggled class="px-6" @click="currentStepIdx++">Install</x-button>
                        </div>
                    </div>
    
                    <!-- Installation -->
                    <div v-if="currentStep.id === StepID.INSTALL" class="flex flex-col gap-4 h-full">
                        <h1 class="text-3xl font-semibold">Installation</h1>
                        <p class="text-lg text-gray-400">
                            WinBoat is now installing Windows. Please be patient as this may take up to an hour.
                            In the meantime you can grab coffee and check the status <a href="#">in your browser</a>.
                        </p>
    
                        <div class="flex flex-col h-full items-center justify-center gap-4">
                            <x-throbber class="size-16"></x-throbber>
                            <x-label class="text-lg text-gray-400">Deploying container...</x-label>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
        <div class="absolute gradient-ball left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] -z-10"></div>
    </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { computed, onMounted, ref } from 'vue';
import { Specs } from '../../types';

type Step = {
    id: string,
    title: string,
    icon: string,
}

enum StepID {
    WELCOME = "STEP_WELCOME",
    PREREQUISITES = "STEP_PREREQUISITES",
    LICENSE = "STEP_LICENSE",
    WINDOWS_CONFIG = "STEP_WINDOWS_CONFIG",
    HARDWARE_CONFIG = "STEP_HARDWARE_CONFIG",
    REVIEW = "STEP_OVERVIEW",
    INSTALL = "STEP_INSTALL",
    FINISH = "STEP_FINISH",
}

const steps: Step[] = [
    {
        id: StepID.WELCOME,
        title: "Welcome",
        icon: "tdesign:wave-bye-filled",
    },
    {
        id: StepID.LICENSE,
        title: "License",
        icon: "line-md:text-box-multiple",
    },
    {
        id: StepID.PREREQUISITES,
        title: "Prerequisites",
        icon: "line-md:check-all",
    },
    {
        id: StepID.WINDOWS_CONFIG,
        title: "Windows Configuration",
        icon: "mage:microsoft-windows",
    },
    {
        id: StepID.HARDWARE_CONFIG,
        title: "Hardware Configuration",
        icon: "famicons:hardware-chip-outline",
    },
    {
        id: StepID.REVIEW,
        title: "Review",
        icon: "solar:pin-list-bold",
    },
    {
        id: StepID.INSTALL,
        title: "Installation",
        icon: "line-md:downloading-loop",
    },
    {
        id: StepID.FINISH,
        title: "Finish",
        icon: "bx:bxs-check-circle",
    },
]

const WINDOWS_VERSIONS = {
    "11": "Windows 11 Pro",
    "11l": "Windows 11 Pro LTSC",
    "11e": "Windows 11 Enterprise",
    "10": "Windows 10 Pro",
    "10l": "Windows 10 Pro LTSC",
    "10e": "Windows 10 Enterprise",
}

const WINDOWS_LANGUAGES = {
    "🇦🇪 Arabic": "Arabic" ,
    "🇧🇬 Bulgarian": "Bulgarian" ,
    "🇨🇳 Chinese": "Chinese" ,
    "🇭🇷 Croatian": "Croatian" ,
    "🇨🇿 Czech": "Czech" ,
    "🇩🇰 Danish": "Danish" ,
    "🇳🇱 Dutch": "Dutch" ,
    "🇬🇧 English": "English" ,
    "🇪🇪 Estonian": "Estonian" ,
    "🇫🇮 Finnish": "Finnish" ,
    "🇫🇷 French": "French" ,
    "🇩🇪 German": "German" ,
    "🇬🇷 Greek": "Greek" ,
    "🇮🇱 Hebrew": "Hebrew" ,
    "🇭🇺 Hungarian": "Hungarian" ,
    "🇮🇹 Italian": "Italian" ,
    "🇯🇵 Japanese": "Japanese" ,
    "🇰🇷 Korean": "Korean" ,
    "🇱🇻 Latvian": "Latvian" ,
    "🇱🇹 Lithuanian": "Lithuanian" ,
    "🇳🇴 Norwegian": "Norwegian" ,
    "🇵🇱 Polish": "Polish" ,
    "🇵🇹 Portuguese": "Portuguese" ,
    "🇷🇴 Romanian": "Romanian" ,
    "🇷🇺 Russian": "Russian" ,
    "🇷🇸 Serbian": "Serbian" ,
    "🇸🇰 Slovak": "Slovak" ,
    "🇸🇮 Slovenian": "Slovenian" ,
    "🇪🇸 Spanish": "Spanish" ,
    "🇸🇪 Swedish": "Swedish" ,
    "🇹🇭 Thai": "Thai" ,
    "🇹🇷 Turkish": "Turkish" ,
    "🇺🇦 Ukrainian": "Ukrainian"
}

const MIN_CPU_THREADS = 1;
const MIN_RAM_GB = 2;
const MIN_DISK_GB = 32;

const license = ref("");
const specs = ref<Specs>({
    cpuThreads: 0,
    ramGB: 0,
    diskSpaceGB: 0,
    kvmEnabled: false,
    dockerInstalled: false
})
const currentStepIdx = ref(0);
const currentStep = computed(() => steps[currentStepIdx.value]);
const windowsVersion = ref("11");
const windowsLanguage = ref("English");
const cpuThreads = ref(2);
const ramGB = ref(4);
const diskGB = ref(32);


onMounted(async () => {
    const licenseRes = await fetch("/LICENSE.txt");
    license.value = await licenseRes.text();
    specs.value = await window.electronAPI.specs();
    console.log("Specs", specs.value);
})
</script>

<style>
.gradient-ball {
    width: 90vw;
    height: 80vh;
    border-radius: 10px;
    background: linear-gradient(197.37deg, #7450DB -0.38%, rgba(138, 234, 240, 0) 101.89%), linear-gradient(115.93deg, #3E88F6 4.86%, rgba(62, 180, 246, 0.33) 38.05%, rgba(62, 235, 246, 0) 74.14%), radial-gradient(56.47% 76.87% at 6.92% 7.55%, rgba(62, 136, 246, 0.7) 0%, rgba(62, 158, 246, 0.182) 52.16%, rgba(62, 246, 246, 0) 100%), linear-gradient(306.53deg, #2EE4E3 19.83%, rgba(46, 228, 227, 0) 97.33%);
    background-blend-mode: normal, normal, normal, normal, normal, normal;
    filter: blur(50px);
}

.bounce-enter-active {
  animation: bounce-in 0.4s;
}
.bounce-leave-active {
  animation: bounce-in 0.4s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0.7) translateY(-20%);
    opacity: 0%;
  }
  100% {
    transform: scale(1) translateY(0);
  }
}

.bouncedown-enter-active {
  animation: bouncedown-in 0.5s;
}
.bouncedown-leave-active {
  animation: bouncedown-in 0.5s reverse;
}
@keyframes bouncedown-in {
  0% {
    transform: scale(0.7) translateY(-20%);
    opacity: 0%;
  }
  100% {
    transform: scale(1) translateY(0);
  }
}
</style>