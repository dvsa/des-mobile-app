import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsefulLinksPage } from '@pages/useful-links/useful-links.page';

const routes: Routes = [
  {
    path: '',
    component: UsefulLinksPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsefulLinksPageRoutingModule {}
