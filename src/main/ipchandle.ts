import { ipcMain, BrowserWindow } from "electron";
import { shell } from "electron";

export function setupIPCHandles() {
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
}
