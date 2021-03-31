import { isControlledStopSelected, getControlledStopFault } from '../controlled-stop.selectors';
import { CompetencyOutcome } from '../../../../../../shared/models/competency-outcome';

describe('Controlled Stop Selector' , () => {
  describe('isControlledStopSelected', () => {
    it('should return true if controlled stop has been selected', () => {
      expect(isControlledStopSelected({ selected: true })).toEqual(true);
    });
    it('should return false if controlled stop has not been selected', () => {
      expect(isControlledStopSelected({ selected: false })).toEqual(false);

    });
    it('should return undefined if contolled stop is not defined', () => {
      expect(isControlledStopSelected({})).toBeUndefined();
    });
  });
  describe('getControlledStopFault', () => {
    it('should return DF if there is a driving fault', () => {
      expect(getControlledStopFault({ fault: 'DF' })).toEqual(CompetencyOutcome.DF);
    });
    it('should return S if there is a serious fault', () => {
      expect(getControlledStopFault({ fault: 'S' })).toEqual(CompetencyOutcome.S);
    });
    it('should return D if there is a dangerous fault', () => {
      expect(getControlledStopFault({ fault: 'D' })).toEqual(CompetencyOutcome.D);
    });
    it('should return undefined if there is no fault', () => {
      expect(getControlledStopFault({})).toBeUndefined();
    });
  });
});
