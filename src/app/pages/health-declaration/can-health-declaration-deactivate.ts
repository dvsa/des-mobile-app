import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { HealthDeclarationPage } from '@pages/health-declaration/health-declaration.page';

@Injectable()
export class CanDeactivateHealthDeclaration implements CanDeactivate<HealthDeclarationPage> {

  canDeactivate(
    component: HealthDeclarationPage,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot,
  ) {
    if (nextState.url.indexOf('PassFinalisation') >= 0) {
      return component.canDeActivate();
    }
    return true;
  }
}
