import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommunicationCatAdiPart2Page } from './communication.cat-adi-part2.page';

const routes: Routes = [
  {
    path: '',
    component: CommunicationCatAdiPart2Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunicationCatADIPart2PageRoutingModule {}
