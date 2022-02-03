import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestReportCatManoeuvrePage } from './test-report.cat-manoeuvre.page';

const routes: Routes = [
  {
    path: '',
    component: TestReportCatManoeuvrePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestReportCatManoeuvrePageRoutingModule {}
