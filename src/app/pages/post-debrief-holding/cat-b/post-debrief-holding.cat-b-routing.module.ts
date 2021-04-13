import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostDebriefHoldingCatBPage } from './post-debrief-holding.cat-b.page';

const routes: Routes = [
  {
    path: '',
    component: PostDebriefHoldingCatBPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostDebriefHoldingCatBPageRoutingModule {}
