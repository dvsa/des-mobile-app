import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BackToOfficeCatCPCPage } from './back-to-office.cat-cpc.page';

const routes: Routes = [
  {
    path: '',
    component: BackToOfficeCatCPCPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackToOfficeCatCPCPageRoutingModule {}
