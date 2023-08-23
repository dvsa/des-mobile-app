import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreferencesPage } from '@pages/preferences/preferences.page';

const routes: Routes = [
  {
    path: '',
    component: PreferencesPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreferencesRoutingModule {
}
