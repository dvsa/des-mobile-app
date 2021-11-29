import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NonPassFinalisationResolver } from '@pages/non-pass-finalisation/non-pass-finalisation.resolver';
import { NonPassFinalisationPage } from './non-pass-finalisation.page';

const routes: Routes = [
  {
    path: '',
    component: NonPassFinalisationPage,
    resolve: { behaviourMap: NonPassFinalisationResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NonPassFinalisationPageRoutingModule {}
