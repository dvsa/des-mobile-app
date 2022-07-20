import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OfficeCatADI3Page } from './office.cat-adi-part3.page';

const routes: Routes = [
  {
    path: '',
    component: OfficeCatADI3Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfficeCatADIPart3PageRoutingModule {}
