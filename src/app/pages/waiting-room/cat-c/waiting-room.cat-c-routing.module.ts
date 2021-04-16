import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WaitingRoomCatCPage } from './waiting-room.cat-c.page';

const routes: Routes = [
  {
    path: '',
    component: WaitingRoomCatCPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaitingRoomCatCPageRoutingModule {}
