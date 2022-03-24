import { CommunicationPreferences } from '@dvsa/mes-test-schema/categories/common';
import { get } from 'lodash';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';

export const getCommunicationPreferenceUpdatedEmail = (
  communicationPreferences: CommunicationPreferences,
) => get(communicationPreferences, 'updatedEmail', '');

export const getCommunicationPreferenceType = (
  communicationPreferences: CommunicationPreferences,
) => get(communicationPreferences, 'communicationMethod', '');

export const getConductedLanguage = (
  communicationPreferences: CommunicationPreferences,
): Language => communicationPreferences.conductedLanguage as Language;
