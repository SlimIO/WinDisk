declare namespace Windrive {

    export interface LogicalDrive {
        name: string;
        bytesPerSect: number;
        type: string;
        freeClusters: number;
        totalClusters: number;
        usedClusterPourcent: number;
        freeClusterPourcent: number;
    }

    export interface DevicePerformance {
        bytesRead: number;
        bytesWritten: number;
        readTime: number;
        writeTime: number;
        idleTime: number;
        readCount: number;
        writeCount: number;
        queueDepth: number;
        splitCount: number;
        queryTime: number;
        storageDeviceNumber: number;
        storageManagerName: string;
    }

    export interface DeviceGeometry {
        mediaType: number;
        cylinders: number;
        bytesPerSector: number;
        sectorsPerTrack: number;
        tracksPerCylinder: number;
    }

    export interface DiskCacheInformation {
        parametersSavable: boolean;
        readCacheEnabled: boolean;
        writeCacheEnabled: boolean;
        prefetchScalar: boolean;
        readRetentionPriority: "EqualPriority" | "KeepPrefetchedData" | "KeepReadData";
        writeRetentionPriority: number;
        disablePrefetchTransferLength: number;
        scalarPrefetch?: {
            minimum: number;
            maximum: number;
            maximumBlocks: number;
        };
        blockPrefetch?: {
            minimum: number;
            maximum: number;
        };
    }

    export interface DosDevices {
        [name: string]: string;
    }

    export function getLogicalDrives(): Promise<LogicalDrive[]>;
    export function getDiskCacheInformation(deviceName: string): Promise<DiskCacheInformation>;
    export function getDevicePerformance(deviceName: string): Promise<DevicePerformance>;
    export function getDeviceGeometry(deviceName: string): Promise<DeviceGeometry>;
    export function getDosDevices(): Promise<DosDevices>;
}

export as namespace Windrive;
export = Windrive;
