import { TestBed } from '@angular/core/testing';
import { OutcomeBehaviourMapProvider } from '../outcome-behaviour-map';
import { OutcomeBehaviourMapping } from '../outcome-behaviour-map.model';

describe('OutcomeBehaviourMapProvider', () => {
  let outcomeBehaviourMapProvider: OutcomeBehaviourMapProvider;

  const simpleBehaviourMap: OutcomeBehaviourMapping = {
    1: {
      routeNumber: { display: 'Y', defaultValue: null, showNotApplicable: false },
      independentDriving: { display: 'Y', showNotApplicable: false },
      showMeQuestion: { display: 'Y', defaultValue: '', showNotApplicable: false },
      faultComment: { display: 'A', showNotApplicable: false },
    },
    3: {
      routeNumber: { display: 'N', defaultValue: '1', showNotApplicable: false },
      independentDriving: { display: 'N', showNotApplicable: false },
      showMeQuestion: { display: 'N', showNotApplicable: false },
      faultComment: { display: 'A', showNotApplicable: false },
    },
    4: {
      routeNumber: { display: 'Y' },
      independentDriving: { display: 'Y', showNotApplicable: true },
      showMeQuestion: { display: 'Y', showNotApplicable: true },
      faultComment: { display: 'A', showNotApplicable: false },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        OutcomeBehaviourMapProvider,
      ],
    });

    outcomeBehaviourMapProvider = TestBed.inject(OutcomeBehaviourMapProvider);
    outcomeBehaviourMapProvider.setBehaviourMap(simpleBehaviourMap);
  });

  describe('getVisibilityType', () => {
    it('should return Y for an outcome and field that has display Y', () => {
      const result = outcomeBehaviourMapProvider.getVisibilityType('1', 'routeNumber');
      expect(result).toBe('Y');
    });
    it('should return N for an outcome and field that has display N', () => {
      const result = outcomeBehaviourMapProvider.getVisibilityType('3', 'routeNumber');
      expect(result).toBe('N');
    });
    it('should return A for an outcome and field that has display A', () => {
      const result = outcomeBehaviourMapProvider.getVisibilityType('4', 'faultComment');
      expect(result).toBe('A');
    });
    it('should return N for a non-existant outcome', () => {
      const result = outcomeBehaviourMapProvider.getVisibilityType('40', 'faultComment');
      expect(result).toBe('N');
    });
    it('should return N for a non-existant field', () => {
      const result = outcomeBehaviourMapProvider.getVisibilityType('4', 'fakefield');
      expect(result).toBe('N');
    });
  });

  describe('isVisible', () => {
    it('should return true for an outcome and field that has display Y', () => {
      const result = outcomeBehaviourMapProvider.isVisible('1', 'routeNumber', 'x');
      expect(result).toEqual(true);
    });
    it('should return false for an outcome and field that has display N', () => {
      const result = outcomeBehaviourMapProvider.isVisible('3', 'routeNumber', 'x');
      expect(result).toEqual(false);
    });
    it('should return true for an outcome and field that has display A and has a value', () => {
      const result = outcomeBehaviourMapProvider.isVisible('4', 'faultComment', 'x');
      expect(result).toEqual(true);
    });
    it('should return false for an outcome and field that has display A and has no value', () => {
      const result = outcomeBehaviourMapProvider.isVisible('4', 'faultComment', null);
      expect(result).toEqual(false);
    });

    it('should return true for a non-existant outcome', () => {
      const result = outcomeBehaviourMapProvider.isVisible('40', 'faultComment', 'x');
      expect(result).toEqual(true);
    });
    it('should return false for a non-existant field', () => {
      const result = outcomeBehaviourMapProvider.isVisible('4', 'fakefield', 'x');
      expect(result).toEqual(false);
    });
  });

  describe('hasDefault', () => {
    it('should return false if defaultValue field is not present', () => {
      const result = outcomeBehaviourMapProvider.hasDefault('1', 'independentDriving');
      expect(result).toEqual(false);
    });

    it('should return false if defaultValue field is present but is null', () => {
      const result = outcomeBehaviourMapProvider.hasDefault('1', 'routeNumber');
      expect(result).toEqual(false);
    });
    it('should return false if defaultValue field is present but is empty string', () => {
      const result = outcomeBehaviourMapProvider.hasDefault('1', 'routeNumber');
      expect(result).toEqual(false);
    });

    it('should return true if defaultValue field is present and non null', () => {
      const result = outcomeBehaviourMapProvider.hasDefault('3', 'routeNumber');
      expect(result).toEqual(true);
    });

  });

  describe('getDefault', () => {
    it('should return null if defaultValue field is not present', () => {
      const result = outcomeBehaviourMapProvider.getDefault('1', 'independentDriving');
      expect(result).toBeNull();
    });

    it('should return null if defaultValue field is present but is null', () => {
      const result = outcomeBehaviourMapProvider.getDefault('1', 'routeNumber');
      expect(result).toBeNull();
    });
    it('should return null if defaultValue field is present but is empty string', () => {
      const result = outcomeBehaviourMapProvider.getDefault('1', 'routeNumber');
      expect(result).toBeNull();
    });

    it('should return value if defaultValue field is present and non null', () => {
      const result = outcomeBehaviourMapProvider.getDefault('3', 'routeNumber');
      expect(result).toBe('1');
    });

  });

  describe('showNotApplicable', () => {
    it('should return false if showNotApplicable is false', () => {
      const result = outcomeBehaviourMapProvider.showNotApplicable('1', 'independentDriving');
      expect(result).toEqual(false);
    });

    it('should return false if showNotApplicable field is missing', () => {
      const result = outcomeBehaviourMapProvider.showNotApplicable('1', 'routeNumber');
      expect(result).toEqual(false);
    });

    it('should return false if showNotApplicable field is true', () => {
      const result = outcomeBehaviourMapProvider.showNotApplicable('4', 'independentDriving');
      expect(result).toEqual(true);
    });
    it('should return false if called with non existant outcome', () => {
      const result = outcomeBehaviourMapProvider.showNotApplicable('x', 'routeNumber');
      expect(result).toEqual(false);
    });

    it('should return false if called with non existant field', () => {
      const result = outcomeBehaviourMapProvider.showNotApplicable('4', 'fakeroute');
      expect(result).toEqual(false);
    });
  });

});
