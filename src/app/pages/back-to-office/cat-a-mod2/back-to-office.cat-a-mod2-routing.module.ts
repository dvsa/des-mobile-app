import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BackToOfficeCatAMod2Page } from './back-to-office.cat-a-mod2.page';

const routes: Routes = [
  {
    path: '',
    component: BackToOfficeCatAMod2Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackToOfficeCatAMod2PageRoutingModule {}
