import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostDebriefHoldingCatCPCPage } from './post-debrief-holding.cat-cpc.page';

const routes: Routes = [
  {
    path: '',
    component: PostDebriefHoldingCatCPCPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostDebriefHoldingCatCPCPageRoutingModule {}
