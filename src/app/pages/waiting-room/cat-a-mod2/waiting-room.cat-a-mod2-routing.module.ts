import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WaitingRoomCatAMod2Page } from './waiting-room.cat-a-mod2.page';

const routes: Routes = [
  {
    path: '',
    component: WaitingRoomCatAMod2Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaitingRoomCatAMod2PageRoutingModule {}
