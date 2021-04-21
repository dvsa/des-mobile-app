import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommunicationCatAMod1Page } from './communication.cat-a-mod1.page';

const routes: Routes = [
  {
    path: '',
    component: CommunicationCatAMod1Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunicationCatAMod1PageRoutingModule {}
