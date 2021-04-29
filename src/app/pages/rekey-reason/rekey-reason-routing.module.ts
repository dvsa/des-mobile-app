import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RekeyReasonPage } from './rekey-reason.page';

const routes: Routes = [
  {
    path: '',
    component: RekeyReasonPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RekeyReasonPageRoutingModule {}
