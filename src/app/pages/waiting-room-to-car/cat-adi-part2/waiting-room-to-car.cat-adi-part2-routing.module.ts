import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WaitingRoomToCarCatAdiPart2Page } from './waiting-room-to-car.cat-adi-part2.page';

const routes: Routes = [
  {
    path: '',
    component: WaitingRoomToCarCatAdiPart2Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaitingRoomToCarCatADIPart2PageRoutingModule {}
