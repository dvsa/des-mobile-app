import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OfficeCatBPage } from './office.cat-b.page';

const routes: Routes = [
  {
    path: '',
    component: OfficeCatBPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfficeCatBPageRoutingModule {}
