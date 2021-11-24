import { Injectable } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';

@Injectable()
export class AppVersionMock implements AppVersion {
    getAppName(): Promise<string> {
        return Promise.resolve('DES 4');
    }

    getPackageName(): Promise<string> {
        return Promise.resolve('driver.examiner.services');
    }

    getVersionCode(): Promise<string | number> {
        return Promise.resolve('1.2.3');
    }

    getVersionNumber(): Promise<string> {
        return Promise.resolve('1.2');
    }
}
