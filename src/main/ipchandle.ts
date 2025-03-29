import { ipcMain, BrowserWindow } from "electron";
import { exec } from "child_process";
import { promisify } from "util";
import { shell } from "electron";
import fs from "fs";
import { type Specs } from "../types";

const execAsync = promisify(exec);

export function setupIPCHandles() {
    ipcMain.handle('execute_shell_command', async (_, command: string) => {
        try {
            const { stdout, stderr } = await execAsync(command);
            if (stderr) {
                throw new Error(stderr);
            }
            return stdout;
        } catch (error) {
            throw error;
        }
    });

    ipcMain.handle('open_link', async (_, link: string) => {
        try {
            await shell.openExternal(link);
        } catch (error) {
            throw error;
        }
    });

    ipcMain.on('minimize-window', (event) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        win?.minimize();
    });

    ipcMain.handle('maximize-window', (event) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        if (win?.isMaximized()) {
            win?.unmaximize();
        } else {
            win?.maximize();
        }
    });

    ipcMain.handle('close-window', (event) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        win?.close();
    });

    ipcMain.handle('specs', async (): Promise<Specs> => {
        const specs: Specs = {
            cpuThreads: 0,
            ramGB: 0,
            diskSpaceGB: 0,
            kvmEnabled: false,
            dockerInstalled: false
        };

        // CPU threads
        specs.cpuThreads = require('os').cpus().length;

        // RAM in GB
        const memInfo = fs.readFileSync('/proc/meminfo', 'utf8');
        const totalMemLine = memInfo.split('\n').find(line => line.startsWith('MemTotal'));
        if (totalMemLine) {
            specs.ramGB = Math.round(parseInt(totalMemLine.split(/\s+/)[1]) / 1024 / 1024 * 100) / 100;
        }

        // Disk space in GB (root partition)
        const diskStats = fs.statfsSync('/');
        specs.diskSpaceGB = Math.round(diskStats.bavail * diskStats.bsize / 1024 / 1024 / 1024 * 100) / 100;

        // Check if KVM is enabled
        try {
            const cpuInfo = fs.readFileSync('/proc/cpuinfo', 'utf8');
            if ((cpuInfo.includes('vmx') || cpuInfo.includes('svm')) && fs.existsSync('/dev/kvm')) {
                specs.kvmEnabled = true;
            }
        } catch (e) {
            // Ignore errors, assume false
        }

        // Check if Docker is installed
        try {
            await execAsync('docker --version');
            specs.dockerInstalled = true;
        } catch (e) {
            // Ignore errors, assume false
        }

        return specs;
    });

}
