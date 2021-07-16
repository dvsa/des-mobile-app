import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanWaitingRoomDeactivateGuard } from '@pages/waiting-room/can-waiting-room-deactiviate';
import { WaitingRoomPage } from './waiting-room.page';

const routes: Routes = [
  {
    path: '',
    component: WaitingRoomPage,
    canDeactivate: [CanWaitingRoomDeactivateGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaitingRoomPageRoutingModule {}
