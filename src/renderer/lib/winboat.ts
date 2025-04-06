import { ref, type Ref } from "vue";
import { WINBOAT_DIR, WINBOAT_GUEST_API } from "./constants";
import { ComposeConfig, WinApp } from "../../types";
import { createLogger } from "../utils/log";
import { AppIcons } from "../data/appicons";
import YAML from 'yaml';
import { InternalApps } from "../data/internalapps";
const nodeFetch: typeof import('node-fetch').default = require('node-fetch');
const path: typeof import('path') = require('path');
const fs: typeof import('fs') = require('fs');
const { promisify }: typeof import('util') = require('util');
const { exec }: typeof import('child_process') = require('child_process');

const execAsync = promisify(exec);

let instance: Winboat | null = null;
const logger = createLogger(path.join(WINBOAT_DIR, 'winboat.log'));

const presetApps: WinApp[] = [
    {
        Name: "⚙️ Windows Desktop",
        Icon: AppIcons[InternalApps.WINDOWS_DESKTOP],
        Source: "internal",
        Path: InternalApps.WINDOWS_DESKTOP
    },
    {
        Name: "⚙️ Windows Explorer",
        Icon: AppIcons[InternalApps.WINDOWS_EXPLORER],
        Source: "internal",
        Path: "%windir%\\explorer.exe"
    }
]

export const ContainerStatus = {
    "Created": "created",
    "Restarting": "restarting",
    "Running": "running",
    "Paused": "paused",
    "Exited": "exited",
    "Dead": "dead"
} as const;

type ContainerStatusValue = typeof ContainerStatus[keyof typeof ContainerStatus];

export class Winboat {
    #healthInterval: NodeJS.Timeout | null = null;
    isOnline: Ref<boolean> = ref(false);
    #containerInterval: NodeJS.Timeout | null = null;
    containerStatus: Ref<ContainerStatusValue> = ref(ContainerStatus.Exited)

    constructor() {
        if (instance) return instance;
        
        this.#healthInterval = setInterval(async () => {
            const _isOnline = await this.getHealth();
            if (_isOnline !== this.isOnline.value) {
                this.isOnline.value = _isOnline;
                logger.info(`Winboat Guest API went ${this.isOnline ? 'online' : 'offline'}`);
            }
        }, 1000);

        this.#containerInterval = setInterval(async () => {
            const _containerStatus = await this.getContainerStatus();
            if (_containerStatus !== this.containerStatus.value) {
                this.containerStatus.value = _containerStatus;
                logger.info(`Winboat Container state changed to ${_containerStatus}`);
            }
        }, 1000);

        instance = this;

        return instance;
    }

    async getHealth() {
        // If /health returns 200, then the guest is ready
        const res = await nodeFetch(`${WINBOAT_GUEST_API}/health`);
        return res.status === 200;
    }

    async getContainerStatus() {
        const { stdout: _containerStatus } = await execAsync(`docker inspect --format="{{.State.Status}}" WinBoat`);
        return _containerStatus as ContainerStatusValue;
    }

    async getApps() {
        const res = await nodeFetch(`${WINBOAT_GUEST_API}/apps`);
        const apps = await res.json() as WinApp[];
        apps.push(...presetApps);
        return apps;
    }

    parseCompose() {
        const composeFile = fs.readFileSync(path.join(WINBOAT_DIR, 'docker-compose.yml'), 'utf-8');
        const composeContents = YAML.parse(composeFile) as ComposeConfig;
        return composeContents;
    }

    getCredentials() {
        const compose = this.parseCompose();
        return {
            username: compose.services.windows.environment.USERNAME,
            password: compose.services.windows.environment.PASSWORD
        }
    }

    async launchApp(app: WinApp) {
        if (!this.isOnline) throw new Error('Cannot launch app, Winboat is offline');

        const { username, password } = this.getCredentials();
        logger.info(`Launching app: ${app.Name} at path ${app.Path}`);

        let cmd = `xfreerdp /u:"${username}"\
        /p:"${password}"\
        /v:127.0.0.1\
        /cert:ignore\
        +clipboard\
        -wallpaper\
        /sound:sys:pulse\
        /microphone:sys:pulse\
        /floatbar\
        /compression\
        /wm-class:"${app.Name}"\
        /app:program:"${app.Path}",name:"${app.Name}" &`;

        if (app.Path == InternalApps.WINDOWS_DESKTOP) {
            cmd = `xfreerdp /u:"${username}"\
                /p:"${password}"\
                /v:127.0.0.1\
                /cert:ignore\
                +clipboard\
                +f\
                /sound:sys:pulse\
                /microphone:sys:pulse\
                /floatbar\
                /compression &`;
        }

        cmd = cmd.replace(/\s+/g, " ");

        logger.info(`Launch command:\n${cmd}`);

        await execAsync(cmd);
    }
}