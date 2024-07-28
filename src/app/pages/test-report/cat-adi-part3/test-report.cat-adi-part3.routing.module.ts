import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TestReportCatADI3Page } from './test-report.cat-adi-part3.page';

const routes: Routes = [
  {
    path: '',
    component: TestReportCatADI3Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestReportCatADIPart3PageRoutingModule {}
