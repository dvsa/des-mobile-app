import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestReportCatAMod1Page } from './test-report.cat-a-mod1.page';

const routes: Routes = [
  {
    path: '',
    component: TestReportCatAMod1Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestReportCatAMod1PageRoutingModule {}
