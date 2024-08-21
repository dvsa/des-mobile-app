import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PassFinalisationCatDPage } from './pass-finalisation.cat-d.page';

const routes: Routes = [
  {
    path: '',
    component: PassFinalisationCatDPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PassFinalisationCatDPageRoutingModule {}
