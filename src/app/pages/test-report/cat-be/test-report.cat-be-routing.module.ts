import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestReportCatBEPage } from './test-report.cat-be.page';

const routes: Routes = [
  {
    path: '',
    component: TestReportCatBEPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestReportCatBEPageRoutingModule {}
