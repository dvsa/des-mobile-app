import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OfficeCatHomeTestPage } from './office.cat-home-test.page';

const routes: Routes = [
  {
    path: '',
    component: OfficeCatHomeTestPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfficeCatHomeTestPageRoutingModule {}
