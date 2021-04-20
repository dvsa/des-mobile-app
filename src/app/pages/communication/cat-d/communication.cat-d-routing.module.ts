import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommunicationCatDPage } from './communication.cat-d.page';

const routes: Routes = [
  {
    path: '',
    component: CommunicationCatDPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunicationCatDPageRoutingModule {}
