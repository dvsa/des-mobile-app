import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostDebriefHoldingCatAdiPart2Page } from './post-debrief-holding.cat-adi-part2.page';

const routes: Routes = [
  {
    path: '',
    component: PostDebriefHoldingCatAdiPart2Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostDebriefHoldingCatADIPart2PageRoutingModule {}
