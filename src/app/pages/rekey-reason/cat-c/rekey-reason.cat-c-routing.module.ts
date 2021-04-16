import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RekeyReasonCatCPage } from './rekey-reason.cat-c.page';

const routes: Routes = [
  {
    path: '',
    component: RekeyReasonCatCPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RekeyReasonCatCPageRoutingModule {}
