import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RekeyReasonCatHomeTestPage } from './rekey-reason.cat-home-test.page';

const routes: Routes = [
  {
    path: '',
    component: RekeyReasonCatHomeTestPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RekeyReasonCatHomeTestPageRoutingModule {}
