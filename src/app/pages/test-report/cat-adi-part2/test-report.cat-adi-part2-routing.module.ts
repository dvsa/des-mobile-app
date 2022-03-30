import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestReportCatADI2Page } from './test-report.cat-adi-part2.page';

const routes: Routes = [
  {
    path: '',
    component: TestReportCatADI2Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestReportCatADIPart2PageRoutingModule {}
