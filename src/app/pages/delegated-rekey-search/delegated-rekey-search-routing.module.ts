import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DelegatedRekeySearchPage } from '@pages/delegated-rekey-search/delegated-rekey-search';

const routes: Routes = [
  {
    path: '',
    component: DelegatedRekeySearchPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DelegatedRekeySearchPageRoutingModule {}
