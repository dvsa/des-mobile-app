import { createAction, props } from '@ngrx/store';
import { CommunicationMethod, ConductedLanguage } from '@dvsa/mes-test-schema/categories/common';

export const CandidateChoseEmailAsCommunicationPreference = createAction(
  '[Communication Preferences] Candidate confirmed communication preferences as email',
  props<{ updatedEmail: string; communicationMethod: CommunicationMethod; }>(),
);

export const CandidateChosePostAsCommunicationPreference = createAction(
  '[Communication Preferences] Candidate confirmed communication preferences as post',
  props<{ communicationMethod: CommunicationMethod; }>(),
);

export const CandidateChoseToProceedWithTestInEnglish = createAction(
  '[Communication Preferences] Candidate chose to proceed with test in English',
  props<{ conductedLanguage: ConductedLanguage; }>(),
);

export const CandidateChoseToProceedWithTestInWelsh = createAction(
  '[Communication Preferences] Candidate chose to proceed with test in Welsh',
  props<{ conductedLanguage: ConductedLanguage; }>(),
);

export const PopulateConductedLanguage = createAction(
  '[Communication Preferences] Populate Conducted Language',
  props<{ conductedLanguage: ConductedLanguage; }>(),
);
