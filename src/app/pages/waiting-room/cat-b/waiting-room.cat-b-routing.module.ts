import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WaitingRoomCatBPage } from './waiting-room.cat-b.page';

const routes: Routes = [
  {
    path: '',
    component: WaitingRoomCatBPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaitingRoomCatBPageRoutingModule {}
