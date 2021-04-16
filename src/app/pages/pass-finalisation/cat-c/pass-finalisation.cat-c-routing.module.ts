import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PassFinalisationCatCPage } from './pass-finalisation.cat-c.page';

const routes: Routes = [
  {
    path: '',
    component: PassFinalisationCatCPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PassFinalisationCatCPageRoutingModule {}
