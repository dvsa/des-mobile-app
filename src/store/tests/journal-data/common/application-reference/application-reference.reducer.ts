import { ApplicationReference } from '@dvsa/mes-test-schema/categories/common';
import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { selectJournalData } from '@store/tests/tests.selector';
import * as applicationReferenceActions from './application-reference.actions';

export const initialState: ApplicationReference = {
  applicationId: null,
  bookingSequence: null,
  checkDigit: null,
};

export const applicationReferenceReducer = createReducer(
  initialState,
  on(applicationReferenceActions.PopulateApplicationReference, (_, { application }): ApplicationReference => ({
    applicationId: application.applicationId,
    bookingSequence: application.bookingSequence,
    checkDigit: application.checkDigit,
  })),
);

export const getApplicationReference = createFeatureSelector<ApplicationReference>('applicationReference');

export const selectApplicationReference = createSelector(
  selectJournalData,
  ({ applicationReference }) => applicationReference,
);
