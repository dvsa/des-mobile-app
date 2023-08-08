import { CommunicationPreferences } from '@dvsa/mes-test-schema/categories/common';
import { get } from 'lodash';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { createSelector } from '@ngrx/store';
import {
  selectCommunicationPreference,
} from '@store/tests/communication-preferences/communication-preferences.reducer';

export const getCommunicationPreferenceUpdatedEmail = (
  communicationPreferences: CommunicationPreferences,
) => get(communicationPreferences, 'updatedEmail', '');

export const selectCommunicationPreferenceUpdatedEmail = createSelector(
  selectCommunicationPreference,
  (pref) => get(pref, 'updatedEmail', ''),
);

export const getCommunicationPreferenceType = (
  communicationPreferences: CommunicationPreferences,
) => get(communicationPreferences, 'communicationMethod', '');

export const selectCommunicationPreferenceType = createSelector(
  selectCommunicationPreference,
  (pref) => get(pref, 'communicationMethod', ''),
);

export const getConductedLanguage = (
  communicationPreferences: CommunicationPreferences,
): Language => communicationPreferences.conductedLanguage as Language;

export const selectConductedLanguage = createSelector(
  selectCommunicationPreference,
  (pref) => pref.conductedLanguage as Language,
);
