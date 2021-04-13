import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RekeyUploadOutcomePage } from './rekey-upload-outcome.page';

const routes: Routes = [
  {
    path: '',
    component: RekeyUploadOutcomePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RekeyUploadOutcomePageRoutingModule {}
