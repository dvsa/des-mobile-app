import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestReportPage } from './test-report.page';

const routes: Routes = [
  {
    path: '',
    component: TestReportPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestReportPageRoutingModule {}
