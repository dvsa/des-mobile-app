import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommunicationCatCPage } from './communication.cat-c.page';

const routes: Routes = [
  {
    path: '',
    component: CommunicationCatCPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunicationCatCPageRoutingModule {}
