import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { RekeyReason } from '@dvsa/mes-test-schema/categories/common';
import * as rekeyReasonActions from './rekey-reason.actions';

export const initialState: RekeyReason = {
  ipadIssue: {
    selected: false,
    broken: false,
    lost: false,
    technicalFault: false,
    stolen: false,
  },
  other: {
    selected: false,
    reason: '',
  },
  transfer: {
    selected: false,
  },
};

export const rekeyReasonReducer = createReducer(
  initialState,
  on(rekeyReasonActions.IpadIssueSelected, (state, { payload }) => ({
    ...state,
    ipadIssue: {
      selected: payload,
      broken: false,
      lost: false,
      technicalFault: payload,
      stolen: false,
    },
  })),
  on(rekeyReasonActions.IpadIssueTechFaultSelected, (state) => ({
    ...state,
    ipadIssue: {
      ...initialState.ipadIssue,
      selected: true,
      technicalFault: true,
    },
  })),
  on(rekeyReasonActions.IpadIssueLostSelected, (state) => ({
    ...state,
    ipadIssue: {
      ...initialState.ipadIssue,
      selected: true,
      lost: true,
    },
  })),
  on(rekeyReasonActions.IpadIssueStolenSelected, (state) => ({
    ...state,
    ipadIssue: {
      ...initialState.ipadIssue,
      selected: true,
      stolen: true,
    },
  })),
  on(rekeyReasonActions.IpadIssueBrokenSelected, (state) => ({
    ...state,
    ipadIssue: {
      ...initialState.ipadIssue,
      selected: true,
      broken: true,
    },
  })),
  on(rekeyReasonActions.TransferSelected, (state, { payload }) => ({
    ...state,
    transfer: {
      ...initialState.transfer,
      selected: payload,
    },
  })),
  on(rekeyReasonActions.OtherSelected, (state, { payload }) => ({
    ...state,
    other: {
      ...initialState.other,
      selected: payload,
    },
  })),
  on(rekeyReasonActions.OtherReasonUpdated, (state, { payload }) => ({
    ...state,
    other: {
      ...initialState.other,
      selected: true,
      reason: payload,
    },
  })),
);

export const getRekeyReason = createFeatureSelector<RekeyReason>('rekeyReason');
