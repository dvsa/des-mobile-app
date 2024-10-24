import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidateLicencePage } from './candidate-licence.page';

const routes: Routes = [
  {
    path: '',
    component: CandidateLicencePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidateLicencePageRoutingModule {}
