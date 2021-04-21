import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BackToOfficeCatDPage } from './back-to-office.cat-d.page';

const routes: Routes = [
  {
    path: '',
    component: BackToOfficeCatDPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackToOfficeCatDPageRoutingModule {}
