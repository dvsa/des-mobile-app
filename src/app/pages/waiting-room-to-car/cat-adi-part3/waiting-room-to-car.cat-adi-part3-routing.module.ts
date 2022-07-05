import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WaitingRoomToCarCatADIPart3Page } from './waiting-room-to-car.cat-adi-part3.page';

const routes: Routes = [
  {
    path: '',
    component: WaitingRoomToCarCatADIPart3Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaitingRoomToCarCatADIPart3PageRoutingModule {}
