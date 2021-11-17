import {
  SendCurrentTest,
  SendCurrentTestSuccess,
  SendCurrentTestFailure,
} from '@store/tests/tests.actions';
import { EndRekey } from '@store/tests/rekey/rekey.actions';
import { initialState, rekeyReasonReducer } from '../rekey-reason.reducer';
import {
  ValidateTransferRekey,
  ValidateTransferRekeyFailed,
  ResetStaffNumberValidationError,
} from '../rekey-reason.actions';
import { RekeyReasonModel } from '../rekey-reason.model';

describe('rekeyReasonReducer', () => {

  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = { type: 'NOOP' } as any;
      const result: RekeyReasonModel = rekeyReasonReducer(undefined, action);
      expect(result).toBe(initialState);
    });
  });

  describe('[Rekey Actions] End rekey', () => {
    it('should rexet the state', () => {
      const action = EndRekey();
      const result: RekeyReasonModel = rekeyReasonReducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });

  describe('[TestsEffects] Send Current Test', () => {
    it('should toggle uploading state', () => {
      const action = SendCurrentTest();
      const result: RekeyReasonModel = rekeyReasonReducer(initialState, action);

      expect(result).toEqual({
        ...initialState,
        uploadStatus: {
          ...initialState.uploadStatus,
          isUploading: true,
        },
      });
    });
  });

  describe('[Tests] Send Test Success', () => {
    it('should toggle has upload succeeded state', () => {
      const action = SendCurrentTestSuccess();
      const result: RekeyReasonModel = rekeyReasonReducer(initialState, action);

      expect(result).toEqual({
        ...initialState,
        uploadStatus: {
          ...initialState.uploadStatus,
          hasUploadSucceeded: true,
        },
      });
    });
  });

  describe('[Tests] Send Test Failure', () => {
    it('should toggle has upload failed state', () => {
      const action = SendCurrentTestFailure(false);
      const result: RekeyReasonModel = rekeyReasonReducer(initialState, action);

      expect(result).toEqual({
        ...initialState,
        uploadStatus: {
          ...initialState.uploadStatus,
          hasUploadFailed: true,
        },
      });
    });
  });

  describe('[Tests] Send Test Failure', () => {
    it('should toggle has upload failed state and duplicate', () => {
      const action = SendCurrentTestFailure(true);
      const result: RekeyReasonModel = rekeyReasonReducer(initialState, action);

      expect(result).toEqual({
        ...initialState,
        uploadStatus: {
          ...initialState.uploadStatus,
          hasUploadFailed: true,
          isDuplicate: true,
        },
      });
    });
  });

  describe('[RekeyReasonPage] Validate transfer rekey', () => {
    it('should toggle is uploading status to true', () => {
      const action = ValidateTransferRekey();
      const result: RekeyReasonModel = rekeyReasonReducer(initialState, action);

      expect(result).toEqual({
        ...initialState,
        uploadStatus: {
          ...initialState.uploadStatus,
          isUploading: true,
        },
      });
    });
  });

  describe('[RekeyReasonPage] Validate transfer rekey failed', () => {
    it('should not set upload as failed when staff validation failed', () => {
      const action = ValidateTransferRekeyFailed(true);
      const result: RekeyReasonModel = rekeyReasonReducer(initialState, action);

      expect(result).toEqual({
        ...initialState,
        uploadStatus: {
          ...initialState.uploadStatus,
          hasUploadFailed: false,
          hasStaffNumberFailedValidation: true,
        },
      });
    });
    it('should set upload as failed when failed staff validation not set', () => {
      const action = ValidateTransferRekeyFailed(false);
      const result: RekeyReasonModel = rekeyReasonReducer(initialState, action);

      expect(result).toEqual({
        ...initialState,
        uploadStatus: {
          ...initialState.uploadStatus,
          hasUploadFailed: true,
          hasStaffNumberFailedValidation: false,
        },
      });
    });
  });

  describe('[RekeyReasonPage] Reset staff number validation error', () => {
    it('should reset staff validation failed', () => {
      const action = ResetStaffNumberValidationError();
      const result: RekeyReasonModel = rekeyReasonReducer(initialState, action);

      expect(result).toEqual({
        ...initialState,
        uploadStatus: {
          ...initialState.uploadStatus,
          hasStaffNumberFailedValidation: false,
        },
      });
    });
  });

});
