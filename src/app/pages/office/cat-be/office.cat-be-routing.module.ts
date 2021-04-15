import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfficeCatBePage } from './office.cat-be.page';

const routes: Routes = [
  {
    path: '',
    component: OfficeCatBePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfficeCatBePageRoutingModule {}
