import { type WindowsVersionKey } from "./renderer/lib/constants";

export type Specs = {
    cpuThreads: number;
    ramGB: number;
    diskSpaceGB: number;
    kvmEnabled: boolean;
    dockerInstalled: boolean;
    ipTablesLoaded: boolean;
    iptableNatLoaded: boolean;
}

export type InstallConfiguration = {
    windowsVersion: WindowsVersionKey;
    windowsLanguage: string;
    cpuThreads: number;
    ramGB: number;
    diskSpaceGB: number;
    username: string;
    password: string;
}