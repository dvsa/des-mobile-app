import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WaitingRoomCatBePage } from './waiting-room.cat-be.page';

const routes: Routes = [
  {
    path: '',
    component: WaitingRoomCatBePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaitingRoomCatBePageRoutingModule {}
