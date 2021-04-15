import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostDebriefHoldingCatBePage } from './post-debrief-holding.cat-be.page';

const routes: Routes = [
  {
    path: '',
    component: PostDebriefHoldingCatBePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostDebriefHoldingCatBePageRoutingModule {}
