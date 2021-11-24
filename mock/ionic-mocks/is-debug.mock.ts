import { Injectable } from '@angular/core';
import { IsDebug } from '@ionic-native/is-debug/ngx';

@Injectable()
export class IsDebugMock implements IsDebug {

    getIsDebug(): Promise<boolean> {
        return Promise.resolve(false);
    }
}
