import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HealthDeclarationCatBePage } from './health-declaration.cat-be.page';

const routes: Routes = [
  {
    path: '',
    component: HealthDeclarationCatBePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HealthDeclarationCatBePageRoutingModule {}
