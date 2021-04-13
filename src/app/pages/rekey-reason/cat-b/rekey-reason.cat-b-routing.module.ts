import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RekeyReasonCatBPage } from './rekey-reason.cat-b.page';

const routes: Routes = [
  {
    path: '',
    component: RekeyReasonCatBPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RekeyReasonCatBPageRoutingModule {}
