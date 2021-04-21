import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WaitingRoomCatAMod1Page } from './waiting-room.cat-a-mod1.page';

const routes: Routes = [
  {
    path: '',
    component: WaitingRoomCatAMod1Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaitingRoomCatAMod1PageRoutingModule {}
