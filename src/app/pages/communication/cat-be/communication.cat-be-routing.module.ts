import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommunicationCatBEPage } from './communication.cat-be.page';

const routes: Routes = [
  {
    path: '',
    component: CommunicationCatBEPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunicationCatBEPageRoutingModule {}
