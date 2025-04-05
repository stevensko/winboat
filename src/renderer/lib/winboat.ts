import { WINBOAT_DIR, WINBOAT_GUEST_API } from "./constants";
import { createLogger } from "../utils/log";
import { ref, type Ref } from "vue";
import { ComposeConfig, WinApp } from "../../types";
import YAML from 'yaml';
const nodeFetch: typeof import('node-fetch').default = require('node-fetch');
const path: typeof import('path') = require('path');
const fs: typeof import('fs') = require('fs');
const { promisify }: typeof import('util') = require('util');
const { exec }: typeof import('child_process') = require('child_process');

const execAsync = promisify(exec);

let instance: Winboat | null = null;
const logger = createLogger(path.join(WINBOAT_DIR, 'winboat.log'));

export class Winboat {
    #healthInterval: NodeJS.Timeout | null = null;
    isOnline: Ref<boolean> = ref(false);

    constructor() {
        if (!instance) {
            instance = this;
        }

        this.#healthInterval = setInterval(async () => {
            const _isOnline = await this.getHealth();
            if (_isOnline !== this.isOnline.value) {
                this.isOnline.value = _isOnline;
                logger.info(`Winboat went ${this.isOnline ? 'online' : 'offline'}`);
            }
        }, 1000);

        return instance;
    }

    async getHealth() {
        // If /health returns 200, then the guest is ready
        const res = await nodeFetch(`${WINBOAT_GUEST_API}/health`);
        return res.status === 200;
    }

    async getApps() {
        const res = await nodeFetch(`${WINBOAT_GUEST_API}/apps`);
        const apps = await res.json() as WinApp[];
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

        const cmd = `xfreerdp /u:"${username}"\
        /p:"${password}"\
        /v:127.0.0.1\
        /cert:tofu\
        +auto-reconnect\
        +clipboard\
        -wallpaper\
        /wm-class:"${app.Name}"\
        /app:program:"${app.Path}",name:"${app.Name}" &`;

        await execAsync(cmd);
    }
}