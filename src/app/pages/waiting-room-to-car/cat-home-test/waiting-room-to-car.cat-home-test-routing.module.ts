import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WaitingRoomToCarCatHomeTestPage } from './waiting-room-to-car.cat-home-test.page';

const routes: Routes = [
  {
    path: '',
    component: WaitingRoomToCarCatHomeTestPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaitingRoomToCarCatHomeTestPageRoutingModule {}
