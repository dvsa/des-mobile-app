import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BackToOfficePage } from './back-to-office.page';

const routes: Routes = [
  {
    path: '',
    component: BackToOfficePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackToOfficePageRoutingModule {}
