import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NonPassFinalisationPage } from './non-pass-finalisation.page';

const routes: Routes = [
  {
    path: '',
    component: NonPassFinalisationPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NonPassFinalisationPageRoutingModule {}
