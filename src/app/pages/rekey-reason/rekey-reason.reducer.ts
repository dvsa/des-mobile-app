import * as testActions from '@store/tests/tests.actions';
import * as rekeyActions from '@store/tests/rekey/rekey.actions';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as rekeyReasonActions from './rekey-reason.actions';
import { RekeyReasonModel } from './rekey-reason.model';

export const initialState: RekeyReasonModel = {
  uploadStatus: {
    isUploading: false,
    hasUploadSucceeded: false,
    hasUploadFailed: false,
    isDuplicate: false,
    hasStaffNumberFailedValidation: false,
  },
};

export const rekeyReasonReducer = createReducer(
  initialState,
  on(rekeyActions.EndRekey, () => ({ ...initialState })),
  on(testActions.SendCurrentTest, (state) => ({
    ...state,
    uploadStatus: {
      ...initialState.uploadStatus,
      isUploading: true,
    },
  })),
  on(testActions.SendCurrentTestSuccess, (state) => ({
    ...state,
    uploadStatus: {
      ...initialState.uploadStatus,
      hasUploadSucceeded: true,
    },
  })),
  on(testActions.SendCurrentTestFailure, (state, { failure }) => ({
    ...state,
    uploadStatus: {
      ...initialState.uploadStatus,
      hasUploadFailed: true,
      isDuplicate: failure,
    },
  })),
  on(rekeyReasonActions.RekeyReasonViewDidEnter, (state) => ({
    ...state,
    uploadStatus: {
      ...initialState.uploadStatus,
    },
  })),
  on(rekeyReasonActions.ValidateTransferRekey, (state) => ({
    ...state,
    uploadStatus: {
      ...initialState.uploadStatus,
      isUploading: true,
    },
  })),
  on(rekeyReasonActions.ValidateTransferRekeyFailed, (state, { staffNumberNotFound }) => ({
    ...state,
    uploadStatus: {
      ...initialState.uploadStatus,
      hasUploadFailed: !staffNumberNotFound,
      hasStaffNumberFailedValidation: staffNumberNotFound,
    },
  })),
  on(rekeyReasonActions.ResetStaffNumberValidationError, (state) => ({
    ...state,
    uploadStatus: {
      ...state.uploadStatus,
      hasStaffNumberFailedValidation: false,
    },
  })),
);

export const getRekeyReasonState = createFeatureSelector<RekeyReasonModel>('rekeyReason');
