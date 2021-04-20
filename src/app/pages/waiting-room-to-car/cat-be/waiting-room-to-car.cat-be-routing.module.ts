import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WaitingRoomToCarCatBEPage } from './waiting-room-to-car.cat-be.page';

const routes: Routes = [
  {
    path: '',
    component: WaitingRoomToCarCatBEPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaitingRoomToCarCatBEPageRoutingModule {}
