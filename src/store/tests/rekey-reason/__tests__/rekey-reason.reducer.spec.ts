import { rekeyReasonReducer, initialState } from '../rekey-reason.reducer';
import * as rekeyReasonActions from '../rekey-reason.actions';

describe('rekeyReasonReducer', () => {
  describe('IpadIssueSelected', () => {
    it('should set selected to the passed value and other values to false when called', () => {
      const result = rekeyReasonReducer(
        initialState, rekeyReasonActions.IpadIssueSelected(true),
      );
      expect(result.ipadIssue).toEqual({
        selected: true,
        broken: false,
        lost: false,
        technicalFault: false,
        stolen: false,
      });
    });
  });
  describe('IpadIssueTechFaultSelected', () => {
    it('should set selected and technicalFault to true when called', () => {
      const result = rekeyReasonReducer(
        initialState, rekeyReasonActions.IpadIssueTechFaultSelected(),
      );
      expect(result.ipadIssue).toEqual({
        ...initialState.ipadIssue,
        selected: true,
        technicalFault: true,
      });
    });
  });
  describe('IpadIssueLostSelected', () => {
    it('should set selected and lost to true when called', () => {
      const result = rekeyReasonReducer(
        initialState, rekeyReasonActions.IpadIssueLostSelected(),
      );
      expect(result.ipadIssue).toEqual({
        ...initialState.ipadIssue,
        selected: true,
        lost: true,
      });
    });
  });
  describe('IpadIssueStolenSelected', () => {
    it('should set selected and stolen to true when called', () => {
      const result = rekeyReasonReducer(
        initialState, rekeyReasonActions.IpadIssueStolenSelected(),
      );
      expect(result.ipadIssue).toEqual({
        ...initialState.ipadIssue,
        selected: true,
        stolen: true,
      });
    });
  });
  describe('IpadIssueBrokenSelected', () => {
    it('should set selected and broken to true when called', () => {
      const result = rekeyReasonReducer(
        initialState, rekeyReasonActions.IpadIssueBrokenSelected(),
      );
      expect(result.ipadIssue).toEqual({
        ...initialState.ipadIssue,
        selected: true,
        broken: true,
      });
    });
  });
  describe('TransferSelected', () => {
    it('should set selected to the passed value when called', () => {
      const result = rekeyReasonReducer(
        initialState, rekeyReasonActions.TransferSelected(true),
      );
      expect(result.transfer.selected).toEqual(true);
    });
  });
  describe('OtherSelected', () => {
    it('should set selected to the passed value when called', () => {
      const result = rekeyReasonReducer(
        initialState, rekeyReasonActions.OtherSelected(true),
      );
      expect(result.other.selected).toEqual(true);
    });
  });
  describe('OtherReasonUpdated', () => {
    it('should set reason to the passed value and selected to true when called', () => {
      const result = rekeyReasonReducer(
        initialState, rekeyReasonActions.OtherReasonUpdated('test'),
      );
      expect(result.other).toEqual({
        ...initialState.other,
        selected: true,
        reason: 'test',
      });
    });
  });
});
