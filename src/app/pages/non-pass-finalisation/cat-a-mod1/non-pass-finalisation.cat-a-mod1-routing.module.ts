import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NonPassFinalisationCatAMod1Page } from './non-pass-finalisation.cat-a-mod1.page';

const routes: Routes = [
  {
    path: '',
    component: NonPassFinalisationCatAMod1Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NonPassFinalisationCatAMod1PageRoutingModule {}
