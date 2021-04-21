import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommunicationCatAMod2Page } from './communication.cat-a-mod2.page';

const routes: Routes = [
  {
    path: '',
    component: CommunicationCatAMod2Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunicationCatAMod2PageRoutingModule {}
