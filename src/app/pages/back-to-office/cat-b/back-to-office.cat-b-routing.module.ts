import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BackToOfficeCatBPage } from './back-to-office.cat-b.page';

const routes: Routes = [
  {
    path: '',
    component: BackToOfficeCatBPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackToOfficeCatBPageRoutingModule {}
