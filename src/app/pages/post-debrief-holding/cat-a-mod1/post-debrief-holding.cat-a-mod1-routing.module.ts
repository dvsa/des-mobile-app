import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostDebriefHoldingCatAMod1Page } from './post-debrief-holding.cat-a-mod1.page';

const routes: Routes = [
  {
    path: '',
    component: PostDebriefHoldingCatAMod1Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostDebriefHoldingCatAMod1PageRoutingModule {}
