import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostDebriefHolding.CatBePage } from './post-debrief-holding.cat-be.page';

const routes: Routes = [
  {
    path: '',
    component: PostDebriefHolding.CatBePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostDebriefHolding.CatBePageRoutingModule {}
