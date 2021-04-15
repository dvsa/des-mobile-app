import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PassFinalisation.CatBePage } from './pass-finalisation.cat-be.page';

const routes: Routes = [
  {
    path: '',
    component: PassFinalisation.CatBePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PassFinalisation.CatBePageRoutingModule {}
