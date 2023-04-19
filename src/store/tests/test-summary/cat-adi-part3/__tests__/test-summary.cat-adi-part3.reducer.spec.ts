import { testSummaryADIPart3Reducer } from '@store/tests/test-summary/cat-adi-part3/test-summary.cat-adi-part3.reducer';
import { TestSummary } from '@dvsa/mes-test-schema/categories/AM1';
import * as fromTestSummaryActions from '../../test-summary.actions';

describe('testSummaryADIPart3Reducer', () => {
  describe('AdditionalInformationChanged', () => {
    it('should set additionalInformation to the value passed when called', () => {
      let result: TestSummary = { additionalInformation: '' };
      result = testSummaryADIPart3Reducer(result, fromTestSummaryActions.AdditionalInformationChanged('test'));
      expect(result).toEqual({ additionalInformation: 'test' });
    });
  });
  describe('DebriefWitnessed', () => {
    it('should set debriefWitnessed to true when called', () => {
      let result: TestSummary = { debriefWitnessed: false };
      result = testSummaryADIPart3Reducer(result, fromTestSummaryActions.DebriefWitnessed());
      expect(result).toEqual({ debriefWitnessed: true });
    });
  });
  describe('DebriefUnWitnessed', () => {
    it('should set debriefWitnessed to false when called', () => {
      let result: TestSummary = { debriefWitnessed: true };
      result = testSummaryADIPart3Reducer(result, fromTestSummaryActions.DebriefUnWitnessed());
      expect(result).toEqual({ debriefWitnessed: false });
    });
  });
});
