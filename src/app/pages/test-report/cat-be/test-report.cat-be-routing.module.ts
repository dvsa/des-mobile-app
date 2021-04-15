import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestReportCatBePage } from './test-report.cat-be.page';

const routes: Routes = [
  {
    path: '',
    component: TestReportCatBePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestReportCatBePageRoutingModule {}
