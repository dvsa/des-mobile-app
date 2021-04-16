import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostDebriefHoldingCatCPage } from './post-debrief-holding.cat-c.page';

const routes: Routes = [
  {
    path: '',
    component: PostDebriefHoldingCatCPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostDebriefHoldingCatCPageRoutingModule {}
