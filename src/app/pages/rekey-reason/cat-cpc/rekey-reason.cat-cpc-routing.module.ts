import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RekeyReasonCatCPCPage } from './rekey-reason.cat-cpc.page';

const routes: Routes = [
  {
    path: '',
    component: RekeyReasonCatCPCPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RekeyReasonCatCPCPageRoutingModule {}
