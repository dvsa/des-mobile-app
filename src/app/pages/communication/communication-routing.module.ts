import { NgModule } from '@angular/core';
import {
  ActivatedRouteSnapshot, RouterModule, RouterStateSnapshot, Routes,
} from '@angular/router';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { CommunicationPage } from './communication.page';

const routes: Routes = [
  {
    path: '',
    component: CommunicationPage,
    canDeactivate: [
      (comp: CommunicationPage, _: ActivatedRouteSnapshot, __: RouterStateSnapshot, nextState: RouterStateSnapshot) => {
        if (nextState.url?.indexOf(TestFlowPageNames.CANDIDATE_LICENCE_PAGE) >= 0) {
          return comp.canDeActivate();
        }
        return true;
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunicationPageRoutingModule {
}
