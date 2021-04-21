import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OfficeCatAMod2Page } from './office.cat-a-mod2.page';

const routes: Routes = [
  {
    path: '',
    component: OfficeCatAMod2Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfficeCatAMod2PageRoutingModule {}
