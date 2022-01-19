import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { HealthDeclarationPage } from '@pages/health-declaration/health-declaration.page';

@Injectable()
export class CanDeactivateHealthDeclaration implements CanDeactivate<HealthDeclarationPage> {

  canDeactivate(component: HealthDeclarationPage) {
    return component.canDeActivate();
  }
}
