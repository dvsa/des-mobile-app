import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BackToOfficeCatBePage } from './back-to-office.cat-be.page';

const routes: Routes = [
  {
    path: '',
    component: BackToOfficeCatBePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackToOfficeCatBePageRoutingModule {}
