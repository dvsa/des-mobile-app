import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WaitingRoomPage } from './waiting-room.page';

const routes: Routes = [
  {
    path: '',
    component: WaitingRoomPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaitingRoomPageRoutingModule {}
