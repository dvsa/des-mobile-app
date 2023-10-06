import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExaminerStatsPage } from './examiner-stats.page';

const routes: Routes = [
  {
    path: '',
    component: ExaminerStatsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExaminerStatsRoutingModule {}
