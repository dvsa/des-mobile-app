import { CommunicationPreferences } from '@dvsa/mes-test-schema/categories/common';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { get } from 'lodash-es';

export const getCommunicationPreferenceUpdatedEmail = (communicationPreferences: CommunicationPreferences) =>
	get(communicationPreferences, 'updatedEmail', '');

export const getCommunicationPreferenceType = (communicationPreferences: CommunicationPreferences) =>
	get(communicationPreferences, 'communicationMethod', '');

export const getConductedLanguage = (communicationPreferences: CommunicationPreferences): Language =>
	communicationPreferences.conductedLanguage as Language;
