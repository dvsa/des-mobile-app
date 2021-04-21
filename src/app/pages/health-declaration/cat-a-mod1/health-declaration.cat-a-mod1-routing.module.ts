import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HealthDeclarationCatAMod1Page } from './health-declaration.cat-a-mod1.page';

const routes: Routes = [
  {
    path: '',
    component: HealthDeclarationCatAMod1Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HealthDeclarationCatAMod1PageRoutingModule {}
