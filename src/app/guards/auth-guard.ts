import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Device } from '@capacitor/core';
import { AuthenticationProvider } from '../providers/authentication/authentication';

@Injectable()

export class AuthGuard implements CanActivate {

  constructor(
    public authenticationProvider: AuthenticationProvider,
  ) {
  }

  async canActivate(): Promise<boolean> {
    if (this.isIos()) {
      return Promise.resolve(true);
    }
    return this.authenticationProvider.isAuthenticated();
  }

  async isIos(): Promise<boolean> {
    const info = await Device.getInfo();
    return info.platform === 'ios';
  }

}
