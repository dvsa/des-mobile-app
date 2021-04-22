import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NonPassFinalisationCatHomeTestPage } from './non-pass-finalisation.cat-home-test.page';

const routes: Routes = [
  {
    path: '',
    component: NonPassFinalisationCatHomeTestPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NonPassFinalisationCatHomeTestPageRoutingModule {}
