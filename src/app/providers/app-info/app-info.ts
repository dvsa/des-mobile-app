import { Injectable } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { from, Observable } from 'rxjs';

@Injectable()
export class AppInfoProvider {

  constructor(private appVersion: AppVersion) { }

  public getVersionNumber = (): Promise<string> => this.appVersion.getVersionNumber();

  public getVersionNumber$(): Observable<string> {
    return from(this.appVersion.getVersionNumber());
  }

  public async getMajorAndMinorVersionNumber(): Promise<string> {
    const versionNumber = await this.appVersion.getVersionNumber();
    const majorVersion = versionNumber.split('.')[0];
    const minorVersion = versionNumber.split('.')[1];
    return `${majorVersion}.${minorVersion}`;
  }

}
