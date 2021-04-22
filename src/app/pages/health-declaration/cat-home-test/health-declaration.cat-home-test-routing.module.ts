import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HealthDeclarationCatHomeTestPage } from './health-declaration.cat-home-test.page';

const routes: Routes = [
  {
    path: '',
    component: HealthDeclarationCatHomeTestPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HealthDeclarationCatHomeTestPageRoutingModule {}
