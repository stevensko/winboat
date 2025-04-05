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

export type WinApp = {
    Name: string;
    Path: string;
    Icon: string;
    Source: string;
}

export type ComposeConfig = {
    name: string;
    volumes: {
        [key: string]: null | string;
    };
    services: {
        [serviceName: string]: {
            image: string;
            container_name: string;
            environment: {
                VERSION: string;
                RAM_SIZE: string;
                CPU_CORES: string;
                DISK_SIZE: string;
                USERNAME: string;
                PASSWORD: string;
                HOME: string;
                LANGUAGE: string;
                [key: string]: string; // Allow additional env vars
            };
            privileged: boolean;
            ports: string[];
            stop_grace_period: string;
            restart: string;
            volumes: string[];
            devices: string[];
        };
    };
};