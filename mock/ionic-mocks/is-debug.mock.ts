import { Injectable } from '@angular/core';
import { IsDebug } from '@awesome-cordova-plugins/is-debug/ngx';

@Injectable()
export class IsDebugMock implements IsDebug {

    getIsDebug(): Promise<boolean> {
        return Promise.resolve(false);
    }
}
