import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HealthDeclarationPage } from './health-declaration.page';

const routes: Routes = [
  {
    path: '',
    component: HealthDeclarationPage,
    canDeactivate: [(component: HealthDeclarationPage) => component.canDeActivate()],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HealthDeclarationPageRoutingModule {
}
