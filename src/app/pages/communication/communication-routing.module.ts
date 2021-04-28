import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommunicationPage } from './communication.page';

const routes: Routes = [
  {
    path: '',
    component: CommunicationPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunicationPageRoutingModule {}
