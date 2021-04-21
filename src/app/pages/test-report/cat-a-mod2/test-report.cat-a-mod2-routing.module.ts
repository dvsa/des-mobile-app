import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestReportCatAMod2Page } from './test-report.cat-a-mod2.page';

const routes: Routes = [
  {
    path: '',
    component: TestReportCatAMod2Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestReportCatAMod2PageRoutingModule {}
