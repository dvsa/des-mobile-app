import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NonPassFinalisationCatBPage } from './non-pass-finalisation.cat-b.page';

const routes: Routes = [
  {
    path: '',
    component: NonPassFinalisationCatBPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NonPassFinalisationCatBPageRoutingModule {}
