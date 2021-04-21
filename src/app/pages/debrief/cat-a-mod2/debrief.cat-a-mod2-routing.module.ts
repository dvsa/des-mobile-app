import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DebriefCatAMod2Page } from './debrief.cat-a-mod2.page';

const routes: Routes = [
  {
    path: '',
    component: DebriefCatAMod2Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DebriefCatAMod2PageRoutingModule {}
