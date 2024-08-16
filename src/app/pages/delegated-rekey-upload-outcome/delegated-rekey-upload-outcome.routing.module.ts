import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DelegatedRekeyUploadOutcomePage } from './delegated-rekey-upload-outcome';

const routes: Routes = [
  {
    path: '',
    component: DelegatedRekeyUploadOutcomePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DelegatedRekeyUploadOutcomePageRoutingModule {}
