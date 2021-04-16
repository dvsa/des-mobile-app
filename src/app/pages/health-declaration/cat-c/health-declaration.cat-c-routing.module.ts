import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HealthDeclarationCatCPage } from './health-declaration.cat-c.page';

const routes: Routes = [
  {
    path: '',
    component: HealthDeclarationCatCPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HealthDeclarationCatCPageRoutingModule {}
