import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HealthDeclarationCatCPCPage } from './health-declaration.cat-cpc.page';

const routes: Routes = [
  {
    path: '',
    component: HealthDeclarationCatCPCPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HealthDeclarationCatCPCPageRoutingModule {}
