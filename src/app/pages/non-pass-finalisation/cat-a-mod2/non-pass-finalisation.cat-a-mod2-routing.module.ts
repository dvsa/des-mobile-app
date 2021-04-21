import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NonPassFinalisationCatAMod2Page } from './non-pass-finalisation.cat-a-mod2.page';

const routes: Routes = [
  {
    path: '',
    component: NonPassFinalisationCatAMod2Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NonPassFinalisationCatAMod2PageRoutingModule {}
