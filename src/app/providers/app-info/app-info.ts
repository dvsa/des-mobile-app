import { Injectable } from '@angular/core';
import { App } from '@capacitor/app';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AppInfoProvider {

  public getVersionNumber(): Observable<string> {
    return from(App.getInfo())
      .pipe(map((info) => info.version));
  }

  public async getFullVersionNumber(): Promise<string> {
    const info = await App.getInfo();
    return info.version;
  }

}
