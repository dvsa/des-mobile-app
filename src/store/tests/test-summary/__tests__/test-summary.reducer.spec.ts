import { testSummaryReducer } from '@store/tests/test-summary/test-summary.reducer';
import * as testSummaryActions from '../test-summary.actions';

describe('testSummaryReducer', () => {
  describe('AdditionalInformationChanged', () => {
    it('should set additionalInformation to the parameter given', () => {
      const result = testSummaryReducer({}, testSummaryActions.AdditionalInformationChanged('test'));
      expect(result).toEqual({ additionalInformation: 'test' });
    });
  });
  describe('CandidateDescriptionChanged', () => {
    it('should set candidateDescription to the parameter given', () => {
      const result = testSummaryReducer({}, testSummaryActions.CandidateDescriptionChanged('test'));
      expect(result).toEqual({ candidateDescription: 'test' });
    });
  });
  describe('RouteNumberChanged', () => {
    it('should set routeNumber to the parameter given', () => {
      const result = testSummaryReducer({}, testSummaryActions.RouteNumberChanged(1));
      expect(result).toEqual({ routeNumber: 1 });
    });
  });
  describe('DebriefWitnessed', () => {
    it('should set debriefWitnessed to true', () => {
      const result = testSummaryReducer({}, testSummaryActions.DebriefWitnessed());
      expect(result).toEqual({ debriefWitnessed: true });
    });
  });
  describe('DebriefUnWitnessed', () => {
    it('should set debriefWitnessed to false', () => {
      const result = testSummaryReducer({}, testSummaryActions.DebriefUnWitnessed());
      expect(result).toEqual({ debriefWitnessed: false });
    });
  });
  describe('IdentificationUsedChanged', () => {
    it('should set identification to the parameter given', () => {
      const result = testSummaryReducer({}, testSummaryActions.IdentificationUsedChanged('Licence'));
      expect(result).toEqual({ identification: 'Licence' });
    });
  });
  describe('TrueLikenessToPhotoChanged', () => {
    it('should set trueLikenessToPhoto to the parameter given', () => {
      const result = testSummaryReducer({}, testSummaryActions.TrueLikenessToPhotoChanged(true));
      expect(result).toEqual({ trueLikenessToPhoto: true });
    });
  });
  describe('IndependentDrivingTypeChanged', () => {
    it('should set independentDriving to the parameter given', () => {
      const result = testSummaryReducer({}, testSummaryActions.IndependentDrivingTypeChanged('Diagram'));
      expect(result).toEqual({ independentDriving: 'Diagram' });
    });
  });
  describe('D255Yes', () => {
    it('should set D255 to true', () => {
      const result = testSummaryReducer({}, testSummaryActions.D255Yes());
      expect(result).toEqual({ D255: true });
    });
  });
  describe('D255No', () => {
    it('should set D255 to false', () => {
      const result = testSummaryReducer({}, testSummaryActions.D255No());
      expect(result).toEqual({ D255: false });
    });
  });
  describe('WeatherConditionsChanged', () => {
    it('should set weatherConditions to the parameter given', () => {
      const result = testSummaryReducer({}, testSummaryActions.WeatherConditionsChanged(['Showers']));
      expect(result).toEqual({ weatherConditions: ['Showers'] });
    });
  });
});
