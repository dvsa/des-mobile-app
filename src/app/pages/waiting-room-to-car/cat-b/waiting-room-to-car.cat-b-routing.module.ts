import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WaitingRoomToCarCatBPage } from './waiting-room-to-car.cat-b.page';

const routes: Routes = [
  {
    path: '',
    component: WaitingRoomToCarCatBPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaitingRoomToCarCatBPageRoutingModule {}
