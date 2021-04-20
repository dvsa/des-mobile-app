import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PassFinalisationCatBEPage } from './pass-finalisation.cat-be.page';

const routes: Routes = [
  {
    path: '',
    component: PassFinalisationCatBEPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PassFinalisationCatBEPageRoutingModule {}
