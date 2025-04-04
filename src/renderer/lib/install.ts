import { type InstallConfiguration } from "../../types";
import { WINBOAT_DIR } from "./constants";
import YAML from "json-to-pretty-yaml";
import { createLogger } from "../utils/log";
import { createNanoEvents, type Emitter } from "nanoevents";
const fs: typeof import('fs') = require('fs');
const { exec }: typeof import('child_process') = require('child_process');
const path: typeof import('path') = require('path');
const { promisify }: typeof import('util') = require('util');
const nodeFetch: typeof import('node-fetch').default = require('node-fetch');

const execAsync = promisify(exec);
const logger = createLogger(path.join(WINBOAT_DIR, 'install.log'));

const composeFilePath = path.join(WINBOAT_DIR, 'docker-compose.yml');
const defaultCompose = {
    "name": "winboat",
    "volumes": {
        "data": null
    },
    "services": {
        "windows": {
            "image": "ghcr.io/dockur/windows:latest",
            "container_name": "WinBoat",
            "environment": {
                "VERSION": "tiny11",
                "RAM_SIZE": "4G",
                "CPU_CORES": "4",
                "DISK_SIZE": "64G",
                "USERNAME": "MyWindowsUser",
                "PASSWORD": "MyWindowsPassword",
                "HOME": "${HOME}",
                "LANGUAGE": "English",
            },
            "privileged": true,
            "ports": [
                "8006:8006",
                "3389:3389/tcp",
                "3389:3389/udp"
            ],
            "stop_grace_period": "120s",
            "restart": "on-failure",
            "volumes": [
                "data:/storage",
                "${HOME}:/shared",
                "./oem:/oem"
            ],
            "devices": [
                "/dev/kvm"
            ]
        }
    }
}
export const InstallStates = {
    IDLE: 'Preparing',
    CREATING_COMPOSE_FILE: 'Creating Compose File',
    STARTING_CONTAINER: 'Starting Container',
    MONITORING_PREINSTALL: 'Monitoring Preinstall',
    INSTALLING_WINDOWS: 'Installing Windows',
    COMPLETED: 'Completed',
    INSTALL_ERROR: 'Install Error'
} as const;

export type InstallState = typeof InstallStates[keyof typeof InstallStates];
interface InstallEvents {
    stateChanged: (state: InstallState) => void;
    preinstallMsg: (msg: string) => void;
    error: (error: Error) => void;
}

export class InstallManager {
    conf: InstallConfiguration;
    emitter: Emitter<InstallEvents>;
    state: InstallState;
    preinstallMsg: string;

    constructor(conf: InstallConfiguration) {
        this.conf = conf;
        this.state = InstallStates.IDLE;
        this.preinstallMsg = ""
        this.emitter = createNanoEvents<InstallEvents>();
    }

    changeState(newState: InstallState) {
        this.state = newState;
        this.emitter.emit('stateChanged', newState);
        logger.info(`New state: "${newState}"`);
    }

    setPreinstallMsg(msg: string) {
        if (msg === this.preinstallMsg) return;
        this.preinstallMsg = msg;
        this.emitter.emit('preinstallMsg', msg);
        logger.info(`Preinstall: "${msg}"`);
    }

    sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    createComposeFile() {
        this.changeState(InstallStates.CREATING_COMPOSE_FILE);

        // Ensure the directory exists
        if (!fs.existsSync(WINBOAT_DIR)) {
            fs.mkdirSync(WINBOAT_DIR);
            logger.info(`Created directory: ${WINBOAT_DIR}`);
        }

        // Configure the compose file
        const composeContent = { ...defaultCompose }

        composeContent.services.windows.environment.RAM_SIZE = `${this.conf.ramGB}G`;
        composeContent.services.windows.environment.CPU_CORES = `${this.conf.cpuThreads}`;
        composeContent.services.windows.environment.DISK_SIZE = `${this.conf.diskSpaceGB}G`;
        composeContent.services.windows.environment.VERSION = this.conf.windowsVersion;
        composeContent.services.windows.environment.LANGUAGE = this.conf.windowsLanguage;
        composeContent.services.windows.environment.USERNAME = this.conf.username;
        composeContent.services.windows.environment.PASSWORD = this.conf.password;


        // Write the compose file
        const composeYAML = YAML.stringify(composeContent).replaceAll("null", "");
        fs.writeFileSync(composeFilePath, composeYAML, { encoding: 'utf8' });
        logger.info(`Creating compose file at: ${composeFilePath}`);
        logger.info(`Compose file content: ${JSON.stringify(composeContent, null, 2)}`);
    }

    async startContainer() {
        this.changeState(InstallStates.STARTING_CONTAINER);
        logger.info('Starting container...');

        // Start the container
        try {
            // execSync(`docker compose -f ${composeFilePath} up -d`, { stdio: 'inherit' });
            const { stdout, stderr } = await execAsync(`docker compose -f ${composeFilePath} up -d`);
            if (stderr) {
                logger.error(stderr);
            }
        } catch (e) {
            this.changeState(InstallStates.INSTALL_ERROR);
            logger.error('Failed to start container.');
            logger.error(e);
            throw e;
        }
        logger.info('Container started successfully.');
    }

    async monitorContainer() {
        // Sleep a bit to make sure the webserver is up in the container
        await this.sleep(3000);

        this.changeState(InstallStates.MONITORING_PREINSTALL);
        logger.info('Starting preinstall monitoring...');

        while (true) {
            try {
                const response = await nodeFetch('http://127.0.0.1:8006/msg.html');
                if (response.status === 404) {
                    logger.info('Received 404, preinstall completed');
                    return; // Exit the method when we get 404
                }
                const message = await response.text();
                const re = />([^<]+)</;
                const messageFormatted = message.match(re)?.[1] || message;
                this.setPreinstallMsg(messageFormatted);
            } catch (error) {
                if (error instanceof Error && error.message.includes('404')) {
                    logger.info('Received 404, preinstall completed');
                    return; // Exit the method when fetch throws 404
                }
                logger.error(`Error monitoring container: ${error}`);
                this.changeState(InstallStates.INSTALL_ERROR);
                throw error;
            }

            // Wait 500ms before next check
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }


    async install() {
        logger.info('Starting installation...');
        this.createComposeFile();
        await this.startContainer();
        await this.monitorContainer();
        this.changeState(InstallStates.INSTALLING_WINDOWS);
        // this.changeState(InstallStates.COMPLETED);
        // logger.info('Installation completed successfully.');
    }
}