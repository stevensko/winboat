import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    sendMessage: (message: string) => ipcRenderer.send('message', message),
    executeShellCommand: (command: string) => ipcRenderer.invoke('execute_shell_command', command),
    openLink: (link: string) => ipcRenderer.invoke('open_link', link),
    minimizeWindow: () => ipcRenderer.send('minimize-window'),
    maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
    closeWindow: () => ipcRenderer.invoke('close-window'),
    specs: () => ipcRenderer.invoke('specs'),
})
