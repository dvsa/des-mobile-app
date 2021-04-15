import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Debrief.CatBePage } from './debrief.cat-be.page';

const routes: Routes = [
  {
    path: '',
    component: Debrief.CatBePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Debrief.CatBePageRoutingModule {}
