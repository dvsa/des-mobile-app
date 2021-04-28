import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TerminateTestModal } from '@components/common/terminate-test-modal/terminate-test-modal';

const routes: Routes = [
  {
    path: '',
    component: TerminateTestModal,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TerminateTestModalRoutingModule {}
