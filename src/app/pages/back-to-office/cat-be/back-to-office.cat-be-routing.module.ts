import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BackToOfficeCatBEPage } from './back-to-office.cat-be.page';

const routes: Routes = [
  {
    path: '',
    component: BackToOfficeCatBEPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackToOfficeCatBEPageRoutingModule {}
