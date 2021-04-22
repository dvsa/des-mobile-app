import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WaitingRoomCatCPCPage } from './waiting-room.cat-cpc.page';

const routes: Routes = [
  {
    path: '',
    component: WaitingRoomCatCPCPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaitingRoomCatCPCPageRoutingModule {}
