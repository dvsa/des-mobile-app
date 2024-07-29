import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExaminerRecordsPage } from './examiner-records.page';

const routes: Routes = [
  {
    path: '',
    component: ExaminerRecordsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExaminerRecordsRoutingModule {}
