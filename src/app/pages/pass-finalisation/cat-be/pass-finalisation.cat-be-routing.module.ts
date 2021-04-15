import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PassFinalisationCatBePage } from './pass-finalisation.cat-be.page';

const routes: Routes = [
  {
    path: '',
    component: PassFinalisationCatBePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PassFinalisationCatBePageRoutingModule {}
