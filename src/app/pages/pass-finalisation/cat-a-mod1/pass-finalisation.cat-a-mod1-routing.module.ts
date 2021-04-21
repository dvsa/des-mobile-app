import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PassFinalisationCatAMod1Page } from './pass-finalisation.cat-a-mod1.page';

const routes: Routes = [
  {
    path: '',
    component: PassFinalisationCatAMod1Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PassFinalisationCatAMod1PageRoutingModule {}
