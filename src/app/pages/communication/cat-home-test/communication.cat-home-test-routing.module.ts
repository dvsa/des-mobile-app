import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommunicationCatHomeTestPage } from './communication.cat-home-test.page';

const routes: Routes = [
  {
    path: '',
    component: CommunicationCatHomeTestPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunicationCatHomeTestPageRoutingModule {}
