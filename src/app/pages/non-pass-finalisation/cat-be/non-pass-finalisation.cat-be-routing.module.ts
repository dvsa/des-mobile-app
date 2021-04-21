import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NonPassFinalisationCatBEPage } from './non-pass-finalisation.cat-be.page';

const routes: Routes = [
  {
    path: '',
    component: NonPassFinalisationCatBEPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NonPassFinalisationCatBEPageRoutingModule {}
