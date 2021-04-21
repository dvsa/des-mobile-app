import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DebriefCatAMod1Page } from './debrief.cat-a-mod1.page';

const routes: Routes = [
  {
    path: '',
    component: DebriefCatAMod1Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DebriefCatAMod1PageRoutingModule {}
