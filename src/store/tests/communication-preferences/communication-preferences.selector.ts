import { CommunicationPreferences, ConductedLanguage } from '@dvsa/mes-test-schema/categories/common';
import { get } from 'lodash';

export const getCommunicationPreferenceUpdatedEmail = (
  communicationPreferences: CommunicationPreferences,
) => get(communicationPreferences, 'updatedEmail', '');

export const getCommunicationPreferenceType = (
  communicationPreferences: CommunicationPreferences,
) => get(communicationPreferences, 'communicationMethod', '');

export const getConductedLanguage = (
  communicationPreferences: CommunicationPreferences,
): ConductedLanguage => communicationPreferences.conductedLanguage;
