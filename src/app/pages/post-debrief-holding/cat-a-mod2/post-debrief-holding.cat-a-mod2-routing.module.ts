import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostDebriefHoldingCatAMod2Page } from './post-debrief-holding.cat-a-mod2.page';

const routes: Routes = [
  {
    path: '',
    component: PostDebriefHoldingCatAMod2Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostDebriefHoldingCatAMod2PageRoutingModule {}
