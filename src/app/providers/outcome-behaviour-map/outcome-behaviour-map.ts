import { Injectable } from '@angular/core';
import { OutcomeBehaviourMapping } from './outcome-behaviour-map.model';

export enum VisibilityType {
  NotVisible = 'N',
  Visible = 'Y',
  VisibleIfPresent = 'A',
}

@Injectable()
export class OutcomeBehaviourMapProvider {

  behaviourMap: OutcomeBehaviourMapping = {};

  setBehaviourMap(map: OutcomeBehaviourMapping) {
    this.behaviourMap = map;
  }
  getVisibilityType(outcomeId: string, fieldName: string): string {
    const mappedOutcome = this.behaviourMap[outcomeId];
    if (!mappedOutcome) {
      return VisibilityType.NotVisible;
    }
    const field = mappedOutcome[fieldName];
    if (!field) {
      return VisibilityType.NotVisible;
    }
    return field.display;
  }

  isVisible(outcomeId: string, fieldName: string, value: any): boolean {
    const mappedOutcome = this.behaviourMap[outcomeId];

    if (!mappedOutcome) {
      return true;
    }
    const field = mappedOutcome[fieldName];
    if (!field) {
      return false;
    }
    if (field.display === VisibilityType.VisibleIfPresent && value) {
      return true;
    }
    return field.display === VisibilityType.Visible;
  }

  hasDefault(outcomeId: string, fieldName: string): boolean {
    const mappedOutcome = this.behaviourMap[outcomeId];
    if (!mappedOutcome) {
      return false;
    }
    const field = mappedOutcome[fieldName];
    if (!field) {
      return false;
    }

    if (field.defaultValue && field.defaultValue !== '') {
      return true;
    }
    return false;
  }

  getDefault(outcomeId: string, fieldName: string): string {
    const mappedOutcome = this.behaviourMap[outcomeId];
    if (!mappedOutcome) {
      return null;
    }
    const field = mappedOutcome[fieldName];
    if (!field) {
      return null;
    }

    if (field.defaultValue && field.defaultValue !== '') {
      return field.defaultValue;
    }
    return null;
  }

  showNotApplicable(outcomeId: string, fieldName: string): boolean {
    const mappedOutcome = this.behaviourMap[outcomeId];
    if (!mappedOutcome) {
      return false;
    }
    const field = mappedOutcome[fieldName];
    if (!field) {
      return false;
    }
    if (!field.showNotApplicable) {
      return false;
    }
    return field.showNotApplicable;
  }
}
