import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestReportCatADIPart2Page } from '@pages/test-report/cat-adi-part2/test-report.cat-adi-part2.page';

const routes: Routes = [
  {
    path: '',
    component: TestReportCatADIPart2Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestReportCatAdiPart2RoutingModule {}
