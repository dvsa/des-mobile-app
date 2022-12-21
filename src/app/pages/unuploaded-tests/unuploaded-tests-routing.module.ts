import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnuploadedTestsPage } from '@pages/unuploaded-tests/unuploaded-tests.page';

const routes: Routes = [
  {
    path: '',
    component: UnuploadedTestsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnuploadedTestsRoutingModule {}
