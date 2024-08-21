import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FakeJournalPage } from './fake-journal.page';

const routes: Routes = [
  {
    path: '',
    component: FakeJournalPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FakeJournalPageRoutingModule {}
