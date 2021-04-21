import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DebriefCatBEPage } from './debrief.cat-be.page';

const routes: Routes = [
  {
    path: '',
    component: DebriefCatBEPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DebriefCatBEPageRoutingModule {}
