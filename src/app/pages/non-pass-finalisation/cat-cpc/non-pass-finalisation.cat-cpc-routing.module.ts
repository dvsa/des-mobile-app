import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NonPassFinalisationCatCPCPage } from './non-pass-finalisation.cat-cpc.page';

const routes: Routes = [
  {
    path: '',
    component: NonPassFinalisationCatCPCPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NonPassFinalisationCatCPCPageRoutingModule {}
