import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthenticationProvider } from '../providers/authentication/authentication';

@Injectable()

export class AuthGuard implements CanActivate {
  constructor(public authenticationProvider: AuthenticationProvider) {
  }

  async canActivate(): Promise<boolean> {
    return await this.authenticationProvider.isAuthenticated();
  }

}
