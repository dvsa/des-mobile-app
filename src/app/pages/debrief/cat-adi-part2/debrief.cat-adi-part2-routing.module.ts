import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DebriefCatAdiPart2Page } from './debrief.cat-adi-part2.page';

const routes: Routes = [
  {
    path: '',
    component: DebriefCatAdiPart2Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DebriefCatADIPart2PageRoutingModule {}
