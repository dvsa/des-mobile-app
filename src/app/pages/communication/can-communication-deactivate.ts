import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { CommunicationPage } from '@pages/communication/communication.page';

@Injectable()
export class CanCommunicationDeactivateGuard implements CanDeactivate<CommunicationPage> {

  canDeactivate(
    component: CommunicationPage,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot,
  ) {
    if (nextState.url?.indexOf(TestFlowPageNames.CANDIDATE_LICENCE_PAGE) >= 0) {
      return component.canDeActivate();
    }
    return true;
  }

}
