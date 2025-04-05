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

const InternalApps = {
    WINDOWS_DESKTOP: "WINDOWS_DESKTOP"
}

const presetApps: WinApp[] = [
    {
        Name: "⚙️ Windows Desktop",
        Icon: "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFLUlEQVR4nO2WWVMcVRzF+RSZXpgFvw1lWT7mxaoExBgFJHswJIZFxCSCGCPikkVJTIxiojGLWwwxMXH5ArIMAzMBDDAwwLAF61i3+97uf9/uBrofFKrmVp2qefydU797e4qKCqdwCqdwNuSJbHvydGT7ckbZ/gSOPL8M9YUlqC8uQX1pEWrlAtTqBag189B2z0Pbm4e2fw7awTlotbPQDs1Cq5uBdmQG+msz0Otz0Bty0BunoTdNQ2+ehv7GFPSWKehv8hzLQj+eRfEJI2n9xGRpiALLaQd4GYffsQR15yLUlxehVi1AfWUe2q55aHvy0PbloR1g4HMcfNYEP0rAGfTrDJxAHyPAb2VR3Dpppm0SxW+zTAwHLuCCr+Dwa63+KgEXizfm3Gs7oCedwO0TKH6H56SZ8AXKlxEpn0Vk2wgiZY8QqcggsiMDtXpKWp3rclhShYLztR1LtxkL29AM+N1xM6d43hsPWaDc9J3BT839A3GycytQKoddq+uGLmuBeyx9kkNzWCMdjxF9307wAhye+R4py0A+StWQ7TpdvZE7LoOLtf2gOwhw52NEP2D5G9EPzQQuIODZZY1UpN0FalLkkkqrt3gsLoMb0OMSNAf+iOdjljFET4+FKMDgKxeNyxrZmTa0cSi0O+W8pHT149xx4bcAl9fulKAZ8GkTOHqG5yzLaIgCHJ49kWpNFkrVMJTqISi7UlD2sPXH/Vdv5Y77gTM9ZOgzAngU0XNmYp+MIvYpy0iIAhzeeGnEZRW+U2UcqxNdHKp4gZOlz7qBY10jiJ3nuRCigANeXFbhu6SMa3VxOYXjnRK4UOMcgZaAY589MnPRTPACBF49OAFlbwrq/kGotYNQDyWhNY3Zynis7nDcF3zEBr9AgC+xZBD7nOdyJkQBsjyDn8qTS5xfgXq0376oAv4U1YVfTqEKBe+Slr7IoQlw/IsM4l+mzXSnQxQg2qgHkq5nVKvvdSrDVu+QdBGO08Vd4Bk3dHca8a94rgwbCV5AOF+fg1o74C7Q1OuEp5fU0sUHXKx92QOaA8evDiP+tZ3gBawLOw21LmloQxXSWnqt59FSRl5dXE66uBf4FQn6G5YhxK/ZCVzAem2ap40Lq9b3Q2vohdb0lwGvt2dM3+lF5a47VyeqUHCx9lUP6G95rtsJXkA8lS38jTeeSemyCt/Zx4gq0+Why2rg1wg4A74xhMSNFBI37QQv4IKf9IH3UkbShapigUvQ1yXoWykkvrMTvAD7SB3jX9f1wp93uu7QRV6crn3TA/r7QSR+sBO8gAGftZ/KVeG570IZw3VpdQncWvsWAafQPw4i8ZNIMngB6wsrnsp1wRNlhOuyLmJxCzplg1Po20kkfrYTvACFZ0+lF7y4rMJ3L2X8VvcCv02g7ySR6DFT0jMQokC79JHyWl6G91PGtboP+B0buOTuAEp+sRO8AL+01kdKPJUe8HEKT5Whq68H/C6Bvsdzn6U/RAEG3yF9pKjzq8ELZeTV1wK/J6D7UfIrzwMzwQuIS2t9YaWnUtbGD96x+irg9wdc0CUPRfqCF3BcWvH3gL42fvDCd6qMtLon+AMJ+rc+O7+HKUC8t/4e0Hd+PfBUGXl1T/A+BzTLU3+YCV6AqeP1XFrv/Drhxeo9dHWiysN+H+heM3+aCVxAebYZGylFYQpEnmnAltI6I+z3piuwpbQO2Zk8srm88XtzFsht1gJb21Y2ikLqc60rgQto+7qPKFtbV/7P1RUOX9x86XDgAoVTOIVTOEX/xfkXW1DiieUqJZgAAAAASUVORK5CYII=",
        Source: "internal",
        Path: InternalApps.WINDOWS_DESKTOP
    }
]

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
        /cert:tofu\
        +auto-reconnect\
        +clipboard\
        -wallpaper\
        /wm-class:"${app.Name}"\
        /app:program:"${app.Path}",name:"${app.Name}" &`;

        if (app.Path == InternalApps.WINDOWS_DESKTOP) {
            cmd = `xfreerdp /u:"${username}"\
                /p:"${password}"\
                /v:127.0.0.1\
                /cert:tofu\
                +auto-reconnect\
                +clipboard\
                /w:1280\
                /h:720 &`;
        }

        logger.info(`Launch command:\n${cmd}`);

        await execAsync(cmd);
    }
}