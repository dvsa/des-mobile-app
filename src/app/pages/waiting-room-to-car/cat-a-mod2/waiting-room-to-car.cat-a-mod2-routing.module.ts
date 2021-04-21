import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WaitingRoomToCarCatAMod2Page } from './waiting-room-to-car.cat-a-mod2.page';

const routes: Routes = [
  {
    path: '',
    component: WaitingRoomToCarCatAMod2Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaitingRoomToCarCatAMod2PageRoutingModule {}
