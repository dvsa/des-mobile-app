import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { CommunicationPreferences } from '@dvsa/mes-test-schema/categories/common';
import { selectCurrentTest } from '@store/tests/tests.selector';
import * as communicationPrefActions from './communication-preferences.actions';

export const initialState: CommunicationPreferences = {
  updatedEmail: '',
  communicationMethod: 'Not provided',
  conductedLanguage: 'Not provided',
};

export const communicationPreferencesReducer = createReducer(
  initialState,
  on(communicationPrefActions.CandidateChoseEmailAsCommunicationPreference, (state, {
    communicationMethod,
    updatedEmail,
  }) => ({
    ...state,
    communicationMethod,
    updatedEmail,
  })),
  on(communicationPrefActions.CandidateChosePostAsCommunicationPreference, (state, { communicationMethod }) => ({
    ...state,
    communicationMethod,
  })),
  on(communicationPrefActions.CandidateChoseToProceedWithTestInWelsh, (state, { conductedLanguage }) => ({
    ...state,
    conductedLanguage,
  })),
  on(communicationPrefActions.CandidateChoseToProceedWithTestInEnglish, (state, { conductedLanguage }) => ({
    ...state,
    conductedLanguage,
  })),
  on(communicationPrefActions.PopulateConductedLanguage, (state, { conductedLanguage }) => ({
    ...state,
    conductedLanguage: (
      state.conductedLanguage === initialState.conductedLanguage ? conductedLanguage : state.conductedLanguage
    ),
  })),
);

export const getCommunicationPreference = createFeatureSelector<CommunicationPreferences>('communicationPreferences');

export const selectCommunicationPreference = createSelector(
  selectCurrentTest,
  (test) => test.communicationPreferences,
);
