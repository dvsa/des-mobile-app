import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { TestCentreJournalPage } from './test-centre-journal.page';

const routes: Routes = [
  {
    path: '',
    component: TestCentreJournalPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestCentreJournalRoutingModule {}
