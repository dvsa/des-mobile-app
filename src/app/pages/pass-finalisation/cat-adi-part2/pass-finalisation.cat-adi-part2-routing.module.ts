import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PassFinalisationCatADI2Page } from './pass-finalisation.cat-adi-part2.page';

const routes: Routes = [
  {
    path: '',
    component: PassFinalisationCatADI2Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PassFinalisationCatADIPart2PageRoutingModule {}
