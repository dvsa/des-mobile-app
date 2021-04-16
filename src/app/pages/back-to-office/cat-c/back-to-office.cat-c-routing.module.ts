import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BackToOfficeCatCPage } from './back-to-office.cat-c.page';

const routes: Routes = [
  {
    path: '',
    component: BackToOfficeCatCPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackToOfficeCatCPageRoutingModule {}
