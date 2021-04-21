import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RekeyReasonCatBEPage } from './rekey-reason.cat-be.page';

const routes: Routes = [
  {
    path: '',
    component: RekeyReasonCatBEPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RekeyReasonCatBEPageRoutingModule {}
