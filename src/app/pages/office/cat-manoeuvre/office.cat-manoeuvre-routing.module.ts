import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OfficeCatManoeuvrePage } from './office.cat-manoeuvre.page';

const routes: Routes = [
  {
    path: '',
    component: OfficeCatManoeuvrePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfficeCatManoeuvrePageRoutingModule {}
