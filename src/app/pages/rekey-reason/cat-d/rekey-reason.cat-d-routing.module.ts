import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RekeyReasonCatDPage } from './rekey-reason.cat-d.page';

const routes: Routes = [
  {
    path: '',
    component: RekeyReasonCatDPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RekeyReasonCatDPageRoutingModule {}
