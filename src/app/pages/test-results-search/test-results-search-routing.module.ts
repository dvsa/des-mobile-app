import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TestResultsSearchPage } from '@pages/test-results-search/test-results-search';

const routes: Routes = [
  {
    path: '',
    component: TestResultsSearchPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestResultsSearchRoutingModule {}
