import { NgModule } from '@angular/core';
import {
  ActivatedRouteSnapshot, RouterModule, RouterStateSnapshot, Routes,
} from '@angular/router';
import { JOURNAL_PAGE } from '@pages/page-names.constants';
import { WaitingRoomPage } from './waiting-room.page';

const routes: Routes = [
  {
    path: '',
    component: WaitingRoomPage,
    canDeactivate: [
      (comp: WaitingRoomPage, _: ActivatedRouteSnapshot, __: RouterStateSnapshot, nextState: RouterStateSnapshot) => {
        if (nextState.url.indexOf(JOURNAL_PAGE) >= 0) {
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
export class WaitingRoomPageRoutingModule {
}
