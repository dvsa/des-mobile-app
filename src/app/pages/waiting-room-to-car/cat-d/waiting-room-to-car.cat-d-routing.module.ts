import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WaitingRoomToCarCatDPage } from './waiting-room-to-car.cat-d.page';

const routes: Routes = [
  {
    path: '',
    component: WaitingRoomToCarCatDPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaitingRoomToCarCatDPageRoutingModule {}
