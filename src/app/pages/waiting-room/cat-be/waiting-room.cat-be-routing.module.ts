import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WaitingRoomCatBEPage } from './waiting-room.cat-be.page';

const routes: Routes = [
  {
    path: '',
    component: WaitingRoomCatBEPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaitingRoomCatBEPageRoutingModule {}
