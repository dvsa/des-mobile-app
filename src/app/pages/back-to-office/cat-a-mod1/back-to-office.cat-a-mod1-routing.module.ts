import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BackToOfficeCatAMod1Page } from './back-to-office.cat-a-mod1.page';

const routes: Routes = [
  {
    path: '',
    component: BackToOfficeCatAMod1Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackToOfficeCatAMod1PageRoutingModule {}
