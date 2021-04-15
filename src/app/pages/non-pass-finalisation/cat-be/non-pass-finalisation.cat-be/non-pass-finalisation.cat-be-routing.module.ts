import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NonPassFinalisation.CatBePage } from './non-pass-finalisation.cat-be.page';

const routes: Routes = [
  {
    path: '',
    component: NonPassFinalisation.CatBePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NonPassFinalisation.CatBePageRoutingModule {}
