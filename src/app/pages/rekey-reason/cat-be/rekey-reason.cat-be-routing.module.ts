import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RekeyReasonCatBePage } from './rekey-reason.cat-be.page';

const routes: Routes = [
  {
    path: '',
    component: RekeyReasonCatBePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RekeyReasonCatBePageRoutingModule {}
