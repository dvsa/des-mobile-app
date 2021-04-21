import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfficeCatAMod1Page } from './office.cat-a-mod1.page';

const routes: Routes = [
  {
    path: '',
    component: OfficeCatAMod1Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfficeCatAMod1PageRoutingModule {}
