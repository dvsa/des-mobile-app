import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HealthDeclarationCatBEPage } from './health-declaration.cat-be.page';

const routes: Routes = [
  {
    path: '',
    component: HealthDeclarationCatBEPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HealthDeclarationCatBEPageRoutingModule {}
