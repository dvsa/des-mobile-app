import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommunicationCatBePage } from './communication.cat-be.page';

const routes: Routes = [
  {
    path: '',
    component: CommunicationCatBePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunicationCatBePageRoutingModule {}
