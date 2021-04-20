import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfficeCatBEPage } from './office.cat-be.page';

const routes: Routes = [
  {
    path: '',
    component: OfficeCatBEPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfficeCatBEPageRoutingModule {}
