import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TESTPAGE } from './TEST-PAGE.page';

const routes: Routes = [
  {
    path: '',
    component: TESTPAGE,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TESTPAGERoutingModule {}
