import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PassFinalisationCatADIPart3Page } from './pass-finalisation.cat-adi-part3.page';

const routes: Routes = [
  {
    path: '',
    component: PassFinalisationCatADIPart3Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PassFinalisationCatADIPart3PageRoutingModule {}
