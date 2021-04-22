import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfficeCatAdiPart2Page } from './office.cat-adi-part2.page';

const routes: Routes = [
  {
    path: '',
    component: OfficeCatAdiPart2Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfficeCatADIPart2PageRoutingModule {}
