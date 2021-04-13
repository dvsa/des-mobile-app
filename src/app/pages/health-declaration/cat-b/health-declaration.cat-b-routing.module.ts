import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HealthDeclarationCatBPage } from './health-declaration.cat-b.page';

const routes: Routes = [
  {
    path: '',
    component: HealthDeclarationCatBPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HealthDeclarationCatBPageRoutingModule {}
