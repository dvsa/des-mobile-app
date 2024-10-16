import { CommunicationPreferences } from '@dvsa/mes-test-schema/categories/common';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as communicationPrefActions from './communication-preferences.actions';

export const initialState: CommunicationPreferences = {
  updatedEmail: '',
  communicationMethod: 'Not provided',
  conductedLanguage: 'Not provided',
};

export const communicationPreferencesReducer = createReducer(
  initialState,
  on(
    communicationPrefActions.CandidateChoseEmailAsCommunicationPreference,
    (state, { communicationMethod, updatedEmail }) => ({
      ...state,
      communicationMethod,
      updatedEmail,
    })
  ),
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
    conductedLanguage:
      state.conductedLanguage === initialState.conductedLanguage ? conductedLanguage : state.conductedLanguage,
  }))
);

export const getCommunicationPreference = createFeatureSelector<CommunicationPreferences>('communicationPreferences');
