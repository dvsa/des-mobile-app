import { ApplicationReference } from '@dvsa/mes-test-schema/categories/common';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as applicationReferenceActions from './application-reference.actions';

export const initialState: ApplicationReference = {
  applicationId: null,
  bookingSequence: null,
  checkDigit: null,
};

export const applicationReferenceReducer = createReducer(
  initialState,
  on(applicationReferenceActions.PopulateApplicationReference, (_, { payload }): ApplicationReference => ({
    applicationId: payload.applicationId,
    bookingSequence: payload.bookingSequence,
    checkDigit: payload.checkDigit,
  }))
);

export const getApplicationReference = createFeatureSelector<ApplicationReference>('applicationReference');
