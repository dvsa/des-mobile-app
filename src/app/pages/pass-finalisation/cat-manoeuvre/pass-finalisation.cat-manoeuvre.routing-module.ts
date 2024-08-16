import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PassFinalisationCatManoeuvrePage } from './pass-finalisation.cat-manoeuvre.page';

const routes: Routes = [
  {
    path: '',
    component: PassFinalisationCatManoeuvrePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PassFinalisationCatManoeuvrePageRoutingModule {}
