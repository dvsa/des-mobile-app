import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TestReportCatBPage } from './test-report.cat-b.page';

const routes: Routes = [
  {
    path: '',
    component: TestReportCatBPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestReportCatBPageRoutingModule {}
