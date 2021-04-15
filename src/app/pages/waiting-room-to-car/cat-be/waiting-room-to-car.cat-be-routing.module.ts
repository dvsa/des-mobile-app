import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WaitingRoomToCarCatBePage } from './waiting-room-to-car.cat-be.page';

const routes: Routes = [
  {
    path: '',
    component: WaitingRoomToCarCatBePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaitingRoomToCarCatBePageRoutingModule {}
