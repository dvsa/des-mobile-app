import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RekeySearchPage } from '@pages/rekey-search/rekey-search';

const routes: Routes = [
  {
    path: '',
    component: RekeySearchPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RekeySearchPageRoutingModule {}
