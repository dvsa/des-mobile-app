import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PassFinalisationCatHomeTestPage } from './pass-finalisation.cat-home-test.page';

const routes: Routes = [
  {
    path: '',
    component: PassFinalisationCatHomeTestPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PassFinalisationCatHomeTestPageRoutingModule {}
