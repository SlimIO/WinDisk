# Windrive
![version](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/SlimIO/Windrive/master/package.json?token=AOgWw3vrgQuu-U4fz1c7yYZyc7XJPNtrks5catjdwA%3D%3D&query=$.version&label=Version)
![N-API](https://img.shields.io/badge/N--API-v3-green.svg)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/SlimIO/Windrive/commit-activity)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)
![dep](https://img.shields.io/david/SlimIO/Windrive.svg)
![size](https://img.shields.io/bundlephobia/min/@slimio/windrive.svg)
[![Known Vulnerabilities](https://snyk.io/test/github/SlimIO/Windrive/badge.svg?targetFile=package.json)](https://snyk.io/test/github/SlimIO/Windrive?targetFile=package.json)
[![Build Status](https://travis-ci.com/SlimIO/Windrive.svg?branch=master)](https://travis-ci.com/SlimIO/Windrive)

SlimIO Windrive is a Node.js binding which expose low-level Microsoft APIs on Logical Drive, Disk and Devices.

This binding expose the following methods/struct:

- [GetLogicalDrives](https://docs.microsoft.com/en-us/windows/desktop/api/fileapi/nf-fileapi-getlogicaldrives)
- [GetDiskFreeSpace](https://docs.microsoft.com/en-us/windows/desktop/api/fileapi/nf-fileapi-getdiskfreespacea)
- [GetDriveType](https://docs.microsoft.com/en-us/windows/desktop/api/fileapi/nf-fileapi-getdrivetypea)
- [QueryDosDevice](https://docs.microsoft.com/en-us/windows/desktop/api/winbase/nf-winbase-querydosdevicea)
- [DISK_PERFORMANCE](https://docs.microsoft.com/en-us/windows/desktop/api/winioctl/ns-winioctl-_disk_performance)
- [DISK_GEOMETRY_EX](https://docs.microsoft.com/en-us/windows/desktop/api/winioctl/ns-winioctl-_disk_geometry_ex)
- [DISK_CACHE_INFORMATION](https://docs.microsoft.com/en-us/windows/desktop/api/winioctl/ns-winioctl-_disk_cache_information)

## Requirements
- [Node.js](https://nodejs.org/en/) v12 or higher

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm i @slimio/windrive
# or
$ yarn add @slimio/windrive
```

## Usage example

Get all active logical drives and retrieve disk performance for each of them!

```js
const windrive = require("@slimio/windrive");

async function main() {
    const logicalDrives = await windrive.getLogicalDrives();

    for (const drive of logicalDrives) {
        console.log(`drive name: ${drive.name}`);
        const diskPerformance = await windrive.getDevicePerformance(drive.name);
        console.log(diskPerformance);
    }
}
main().catch(console.error);
```

## API
<details><summary>getLogicalDrives(): Promise< LogicalDrive[] ></summary>
<br />

Retrieves the currently available disk drives. An array of LogicalDrive is returned.

```ts
type LogicalDriveType = "UNKNOWN" | "NO_ROOT_DIR" | "REMOVABLE" | "FIXED" | "REMOTE" | "CDROM" | "RAMDISK";

export interface LogicalDrive {
    name: string;
    type: LogicalDriveType;
    bytesPerSect?: number;
    freeClusters?: number;
    totalClusters?: number;
    usedClusterPourcent?: number;
    freeClusterPourcent?: number;
}
```

Possible drive types are:

| type | description |
| --- | --- |
| UNKNOWN | The drive type cannot be determined. |
| NO_ROOT_DIR | The root path is invalid; for example, there is no volume mounted at the specified path. |
| REMOVABLE | The drive has removable media; for example, a floppy drive, thumb drive, or flash card reader. |
| FIXED | The drive has fixed media; for example, a hard disk drive or flash drive. |
| REMOTE | The drive is a remote (network) drive. |
| CDROM | The drive is a CD-ROM drive. |
| RAMDISK | The drive is a RAM disk. |

> CDROM Type have no FreeSpaces (only name and type are returned).
</details>

<details><summary>getDosDevices(): Promise< DosDevices ></summary>
<br />

Retrieves information about MS-DOS device names. Return an key -> value Object where the key is the device name and value the path to the device.

```ts
interface DosDevices {
    [name: string]: string;
}
```

For example, you can filter the result to retrieves Logical and **Physical** Drives information & performance:
```js
const isDisk = /^[A-Za-z]{1}:{1}$/;
const isPhysicalDrive = /^PhysicalDrive[0-9]+$/;
function isLogicalOrPhysicalDrive(driveNameStr) {
    return isDisk.test(driveNameStr) || isPhysicalDrive.test(driveNameStr) ? true : false;
}

async function main() {
    const dosDevices = await windrive.getDosDevices();
    const physicalAndLogicalDriveDevices = Object.keys(dosDevices).filter(isLogicalOrPhysicalDrive);
    const allDrivePerformance = await Promise.all(
        physicalAndLogicalDriveDevices.map(dev => windrive.getDevicePerformance(dev))
    );
    console.log(allDrivePerformance);
}
main().catch(console.error);
```
</details>

<details><summary>getDevicePerformance(deviceName: string): Promise< DevicePerformance ></summary>
<br />

Provides disk performance information about a given device (drive). Return a DevicePerformance Object.

```ts
interface DevicePerformance {
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
```
</details>

<details><summary>getDiskCacheInformation(deviceName: string): Promise< DiskCacheInformation ></summary>
<br />

Provides information about the disk cache. Return a DiskCacheInformation Object.

The result of the property `prefetchScalar` define which of scalarPrefetch (**true**) or blockPrefect (**false**) should be filled/completed.

```ts
interface DiskCacheInformation {
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
```
</details>

<details><summary>getDeviceGeometry(deviceName: string): Promise< DeviceGeometry ></summary>
<br />

Describes the geometry of disk devices and media. Return a DeviceGeometry Object.

```ts
interface DeviceGeometry {
    diskSize: number;
    mediaType: number;
    cylinders: number;
    bytesPerSector: number;
    sectorsPerTrack: number;
    tracksPerCylinder: number;
    partition: {
        diskId: string;
        size: number;
        style: "MBR" | "GPT" | "RAW";
        mbr: {
            signature: number;
            checksum: number;
        }
    };
    detection: {
        size: number;
        type: "ExInt13" | "Int13" | "None";
        int13?: {
            driveSelect: number;
            maxCylinders: number;
            sectorsPerTrack: number;
            maxHeads: number;
            numberDrives: number;
        };
        exInt13?: {
            bufferSize: number;
            flags: number;
            cylinders: number;
            heads: number;
            sectorsPerTrack: number;
            sectorsPerDrive: number;
            sectorSize: number;
            reserved: number;
        };
    }
}
```

Media type enumeration can be retrieved [here](https://msdn.microsoft.com/en-us/library/windows/desktop/aa365231(v=vs.85).aspx).
</details>

## Contribution Guidelines
To contribute to the project, please read the [code of conduct](https://github.com/SlimIO/Governance/blob/master/COC_POLICY.md) and the guide for [N-API compilation](https://github.com/SlimIO/Governance/blob/master/docs/native_addons.md).

## Dependencies

|Name|Refactoring|Security Risk|Usage|
|---|---|---|---|
|[node-addon-api](https://github.com/nodejs/node-addon-api)|⚠️Major|Low|Node.js C++ addon api|
|[node-gyp-build](https://github.com/prebuild/node-gyp-build)|⚠️Major|Low|Node-gyp builder|

## License
MIT
