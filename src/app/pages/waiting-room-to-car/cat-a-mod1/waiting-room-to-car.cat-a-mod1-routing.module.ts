import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WaitingRoomToCarCatAMod1Page } from './waiting-room-to-car.cat-a-mod1.page';

const routes: Routes = [
  {
    path: '',
    component: WaitingRoomToCarCatAMod1Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaitingRoomToCarCatAMod1PageRoutingModule {}
