import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PassFinalisationCatAMod2Page } from './pass-finalisation.cat-a-mod2.page';

const routes: Routes = [
  {
    path: '',
    component: PassFinalisationCatAMod2Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PassFinalisationCatAMod2PageRoutingModule {}
