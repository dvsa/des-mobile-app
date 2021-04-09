import { createAction } from '@ngrx/store';
import { CommunicationMethod, ConductedLanguage } from '@dvsa/mes-test-schema/categories/common';

export const CandidateChoseEmailAsCommunicationPreference = createAction(
  '[Communication Preferences] Candidate confirmed communication preferences as email',
  (updatedEmail: string, communicationMethod: CommunicationMethod) => ({ updatedEmail, communicationMethod }),
);

export const CandidateChosePostAsCommunicationPreference = createAction(
  '[Communication Preferences] Candidate confirmed communication preferences as post',
  (communicationMethod: CommunicationMethod) => ({ communicationMethod }),
);

export const CandidateChoseToProceedWithTestInEnglish = createAction(
  '[Communication Preferences] Candidate chose to proceed with test in English',
  (conductedLanguage: ConductedLanguage) => ({ conductedLanguage }),
);

export const CandidateChoseToProceedWithTestInWelsh = createAction(
  '[Communication Preferences] Candidate chose to proceed with test in Welsh',
  (conductedLanguage: ConductedLanguage) => ({ conductedLanguage }),
);

export const PopulateConductedLanguage = createAction(
  '[Communication Preferences] Populate Conducted Language',
  (conductedLanguage: ConductedLanguage) => ({ conductedLanguage }),
);
