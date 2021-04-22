import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NonPassFinalisationCatAdiPart2Page } from './non-pass-finalisation.cat-adi-part2.page';

const routes: Routes = [
  {
    path: '',
    component: NonPassFinalisationCatAdiPart2Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NonPassFinalisationCatADIPart2PageRoutingModule {}
