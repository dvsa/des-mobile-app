import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NonPassFinalisationCatCPage } from './non-pass-finalisation.cat-c.page';

const routes: Routes = [
  {
    path: '',
    component: NonPassFinalisationCatCPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NonPassFinalisationCatCPageRoutingModule {}
