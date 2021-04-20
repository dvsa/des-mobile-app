import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OfficeCatDPage } from './office.cat-d.page';

const routes: Routes = [
  {
    path: '',
    component: OfficeCatDPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfficeCatDPageRoutingModule {}
