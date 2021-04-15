import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WaitingRoom.CatBePage } from './waiting-room.cat-be.page';

const routes: Routes = [
  {
    path: '',
    component: WaitingRoom.CatBePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaitingRoom.CatBePageRoutingModule {}
