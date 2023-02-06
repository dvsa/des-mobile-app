/* eslint-disable */
import { VisibilityType } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { OutcomeBehaviourMapping } from '@providers/outcome-behaviour-map/outcome-behaviour-map.model';

export class OutcomeBehaviourMapProviderMock {
  setBehaviourMap = () => {};
  isVisible = () => {};

  behaviourMap: OutcomeBehaviourMapping = {};

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

  showNotApplicable(outcomeId: string, fieldName: string): boolean {
    return true;
  }

}
