import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NonPassFinalisationCatBePage } from './non-pass-finalisation.cat-be.page';

const routes: Routes = [
  {
    path: '',
    component: NonPassFinalisationCatBePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NonPassFinalisationCatBePageRoutingModule {}
