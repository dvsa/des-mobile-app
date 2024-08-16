import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConfirmTestDetailsPage } from './confirm-test-details.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmTestDetailsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmTestDetailsPageRoutingModule {}
