import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WaitingRoomCatHomeTestPage } from './waiting-room.cat-home-test.page';

const routes: Routes = [
  {
    path: '',
    component: WaitingRoomCatHomeTestPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaitingRoomCatHomeTestPageRoutingModule {}
