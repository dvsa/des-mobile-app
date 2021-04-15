import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DebriefCatBePage } from './debrief.cat-be.page';

const routes: Routes = [
  {
    path: '',
    component: DebriefCatBePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DebriefCatBePageRoutingModule {}
