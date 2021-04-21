import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RekeyReasonCatAMod2Page } from './rekey-reason.cat-a-mod2.page';

const routes: Routes = [
  {
    path: '',
    component: RekeyReasonCatAMod2Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RekeyReasonCatAMod2PageRoutingModule {}
