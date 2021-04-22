import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RekeyReasonCatAdiPart2Page } from './rekey-reason.cat-adi-part2.page';

const routes: Routes = [
  {
    path: '',
    component: RekeyReasonCatAdiPart2Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RekeyReasonCatADIPart2PageRoutingModule {}
