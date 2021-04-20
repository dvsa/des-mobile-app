import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostDebriefHoldingCatDPage } from './post-debrief-holding.cat-d.page';

const routes: Routes = [
  {
    path: '',
    component: PostDebriefHoldingCatDPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostDebriefHoldingCatDPageRoutingModule {}
