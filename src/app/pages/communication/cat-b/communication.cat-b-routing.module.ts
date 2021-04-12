import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommunicationCatBPage } from './communication.cat-b.page';

const routes: Routes = [
  {
    path: '',
    component: CommunicationCatBPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunicationCatBPageRoutingModule {}
