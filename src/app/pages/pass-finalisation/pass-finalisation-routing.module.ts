import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PassFinalisationPage } from '@pages/pass-finalisation/pass-finalisation.page';
import { NonPassFinalisationResolver } from '@pages/non-pass-finalisation/non-pass-finalisation.resolver';

const routes: Routes = [
  {
    path: '',
    component: PassFinalisationPage,
    resolve: { passData: NonPassFinalisationResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PassFinalisationPageRoutingModule {
}
