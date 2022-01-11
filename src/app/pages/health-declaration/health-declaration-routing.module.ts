import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanDeactivateHealthDeclaration } from '@pages/health-declaration/can-health-declaration-deactivate';
import { HealthDeclarationPage } from './health-declaration.page';

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
})
export class HealthDeclarationPageRoutingModule {}
