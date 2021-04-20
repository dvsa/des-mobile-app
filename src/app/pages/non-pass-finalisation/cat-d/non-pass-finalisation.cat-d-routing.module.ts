import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NonPassFinalisationCatDPage } from './non-pass-finalisation.cat-d.page';

const routes: Routes = [
  {
    path: '',
    component: NonPassFinalisationCatDPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NonPassFinalisationCatDPageRoutingModule {}
