import { Injectable } from '@angular/core';
import { AppVersionOriginal } from '@ionic-native/app-version';
import { from, Observable } from 'rxjs';

@Injectable()
export class AppInfoProvider {

  constructor(private appVersion: AppVersionOriginal) { }

  public getVersionNumber(): Observable<string> {
    return from(this.appVersion.getVersionNumber());
  }

  public async getMajorAndMinorVersionNumber(): Promise<string> {
    const versionNumber = await this.appVersion.getVersionNumber();
    const majorVersion = versionNumber.split('.')[0];
    const minorVersion = versionNumber.split('.')[1];
    return `${majorVersion}.${minorVersion}`;
  }

}
