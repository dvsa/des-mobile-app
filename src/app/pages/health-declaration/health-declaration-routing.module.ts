import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HealthDeclarationPage } from './health-declaration.page';

const routes: Routes = [
  {
    path: '',
    component: HealthDeclarationPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HealthDeclarationPageRoutingModule {}
