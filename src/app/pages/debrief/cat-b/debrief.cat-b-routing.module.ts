import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DebriefCatBPage } from './debrief.cat-b.page';

const routes: Routes = [
  {
    path: '',
    component: DebriefCatBPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DebriefCatBPageRoutingModule {}
