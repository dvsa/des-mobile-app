import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestReport.CatBePage } from './test-report.cat-be.page';

const routes: Routes = [
  {
    path: '',
    component: TestReport.CatBePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestReport.CatBePageRoutingModule {}
