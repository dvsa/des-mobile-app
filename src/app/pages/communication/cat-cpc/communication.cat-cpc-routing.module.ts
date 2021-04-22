import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommunicationCatCPCPage } from './communication.cat-cpc.page';

const routes: Routes = [
  {
    path: '',
    component: CommunicationCatCPCPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunicationCatCPCPageRoutingModule {}
