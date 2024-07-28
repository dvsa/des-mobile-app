import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WaitingRoomToCarCatCPCPage } from './waiting-room-to-car.cat-cpc.page';

const routes: Routes = [
  {
    path: '',
    component: WaitingRoomToCarCatCPCPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaitingRoomToCarCatCPCPageRoutingModule {}
