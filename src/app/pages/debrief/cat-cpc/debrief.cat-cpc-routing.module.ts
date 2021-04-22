import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DebriefCatCPCPage } from './debrief.cat-cpc.page';

const routes: Routes = [
  {
    path: '',
    component: DebriefCatCPCPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DebriefCatCPCPageRoutingModule {}
