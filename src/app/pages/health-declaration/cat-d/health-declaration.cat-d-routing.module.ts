import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HealthDeclarationCatDPage } from './health-declaration.cat-d.page';

const routes: Routes = [
  {
    path: '',
    component: HealthDeclarationCatDPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HealthDeclarationCatDPageRoutingModule {}
