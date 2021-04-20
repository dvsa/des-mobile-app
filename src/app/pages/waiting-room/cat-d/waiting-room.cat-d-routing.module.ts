import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WaitingRoomCatDPage } from './waiting-room.cat-d.page';

const routes: Routes = [
  {
    path: '',
    component: WaitingRoomCatDPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaitingRoomCatDPageRoutingModule {}
