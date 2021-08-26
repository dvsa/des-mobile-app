// eslint-disable-next-line max-classes-per-file
import { Injectable, NgModule } from '@angular/core';
import { Routes, RouterModule, CanDeactivate } from '@angular/router';

import { DeviceAuthenticationProvider } from '@providers/device-authentication/device-authentication';
import { HealthDeclarationPage } from './health-declaration.page';

@Injectable()
class CanDeactivateHealthDeclaration implements CanDeactivate<HealthDeclarationPage> {
  constructor(private deviceAuthenticationProvider: DeviceAuthenticationProvider) {
  }

  canDeactivate() {
    return this.deviceAuthenticationProvider.triggerLockScreen();
  }
}

const routes: Routes = [
  {
    path: '',
    component: HealthDeclarationPage,
    canDeactivate: [CanDeactivateHealthDeclaration],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CanDeactivateHealthDeclaration],
})
export class HealthDeclarationPageRoutingModule {}
