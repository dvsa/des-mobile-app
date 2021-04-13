import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WaitingRoomCatAdiPart2Page } from './waiting-room.cat-adi-part2.page';

const routes: Routes = [
  {
    path: '',
    component: WaitingRoomCatAdiPart2Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaitingRoomCatAdiPart2PageRoutingModule {}
