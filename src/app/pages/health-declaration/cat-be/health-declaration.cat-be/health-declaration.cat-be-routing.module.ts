import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HealthDeclaration.CatBePage } from './health-declaration.cat-be.page';

const routes: Routes = [
  {
    path: '',
    component: HealthDeclaration.CatBePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HealthDeclaration.CatBePageRoutingModule {}
