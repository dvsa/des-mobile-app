import { Injectable } from '@angular/core';
import { Device } from '@awesome-cordova-plugins/device/ngx';

@Injectable()
export class DeviceMock implements Device {
    cordova: string;
    isVirtual: boolean;
    manufacturer: string;
    model: string;
    platform: string;
    serial: string;
    uuid: string;
    version: string;
    isiOSAppOnMac: string;
}
