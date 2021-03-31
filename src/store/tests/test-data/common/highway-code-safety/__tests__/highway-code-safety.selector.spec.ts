import {
  isHighwayCodeSafetySelected,
  getHighwayCodeSafetySeriousFault,
  getHighwayCodeSafetyDrivingFault,
} from '../highway-code-safety.selectors';

describe('Highway Code Safety Selector' , () => {
  describe('isHighwayCodeSafetySelected', () => {
    it('should return true if highway code safety has been selected', () => {
      expect(isHighwayCodeSafetySelected({ selected: true })).toEqual(true);
    });
    it('should return false if highway code safety has not been selected', () => {
      expect(isHighwayCodeSafetySelected({ selected: false })).toEqual(false);

    });
    it('should return undefined if highway code safety is not defined', () => {
      expect(isHighwayCodeSafetySelected({})).toBeUndefined();
    });
  });
  describe('getHighwayCodeSafetyDrivingFault', () => {
    it('should return true if there is a driving fault', () => {
      expect(getHighwayCodeSafetyDrivingFault({ drivingFault: true })).toEqual(true);
    });
    it('should return true if there is a serious fault', () => {
      expect(getHighwayCodeSafetySeriousFault({ seriousFault: true })).toEqual(true);
    });
    it('should return undefined if there is no driving fault', () => {
      expect(getHighwayCodeSafetyDrivingFault({})).toBeUndefined();
    });
    it('should return undefined if there is no serious fault', () => {
      expect(getHighwayCodeSafetySeriousFault({})).toBeUndefined();
    });

  });
});
