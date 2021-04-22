import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RekeyReasonCatAMod1Page } from './rekey-reason.cat-a-mod1.page';

const routes: Routes = [
  {
    path: '',
    component: RekeyReasonCatAMod1Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RekeyReasonCatAMod1PageRoutingModule {}
