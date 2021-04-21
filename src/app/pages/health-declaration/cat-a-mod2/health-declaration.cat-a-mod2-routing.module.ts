import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HealthDeclarationCatAMod2Page } from './health-declaration.cat-a-mod2.page';

const routes: Routes = [
  {
    path: '',
    component: HealthDeclarationCatAMod2Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HealthDeclarationCatAMod2PageRoutingModule {}
