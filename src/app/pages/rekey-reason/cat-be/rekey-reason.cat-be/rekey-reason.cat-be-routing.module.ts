import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RekeyReason.CatBePage } from './rekey-reason.cat-be.page';

const routes: Routes = [
  {
    path: '',
    component: RekeyReason.CatBePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RekeyReason.CatBePageRoutingModule {}
