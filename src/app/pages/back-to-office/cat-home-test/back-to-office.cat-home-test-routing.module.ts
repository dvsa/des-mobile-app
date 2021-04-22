import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BackToOfficeCatHomeTestPage } from './back-to-office.cat-home-test.page';

const routes: Routes = [
  {
    path: '',
    component: BackToOfficeCatHomeTestPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackToOfficeCatHomeTestPageRoutingModule {}
