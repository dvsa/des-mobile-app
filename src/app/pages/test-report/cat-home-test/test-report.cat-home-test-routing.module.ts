import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TestReportCatHomeTestPage } from './test-report.cat-home-test.page';

const routes: Routes = [
  {
    path: '',
    component: TestReportCatHomeTestPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestReportCatHomeTestPageRoutingModule {}
