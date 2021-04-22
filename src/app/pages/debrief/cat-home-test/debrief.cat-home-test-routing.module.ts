import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DebriefCatHomeTestPage } from './debrief.cat-home-test.page';

const routes: Routes = [
  {
    path: '',
    component: DebriefCatHomeTestPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DebriefCatHomeTestPageRoutingModule {}
