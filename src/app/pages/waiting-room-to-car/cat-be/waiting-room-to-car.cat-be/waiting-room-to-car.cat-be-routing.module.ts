import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WaitingRoomToCar.CatBePage } from './waiting-room-to-car.cat-be.page';

const routes: Routes = [
  {
    path: '',
    component: WaitingRoomToCar.CatBePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaitingRoomToCar.CatBePageRoutingModule {}
