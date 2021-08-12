import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { WaitingRoomPage } from '@pages/waiting-room/waiting-room.page';
import { JOURNAL_PAGE } from '@pages/page-names.constants';

@Injectable()
export class CanWaitingRoomDeactivateGuard implements CanDeactivate<WaitingRoomPage> {
  canDeactivate(component: WaitingRoomPage,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot) {
    if (nextState.url.indexOf(JOURNAL_PAGE) >= 0) {
      return component.canDeActivate();
    }
    return true;
  }
}
