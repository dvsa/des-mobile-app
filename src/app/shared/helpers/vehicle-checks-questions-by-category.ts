import {
  NUMBER_OF_TELL_ME_QUESTIONS as NUMBER_OF_TELL_ME_QUESTIONS_NON_TRAILER,
} from '../constants/tell-me-questions/tell-me-questions.vocational.constants';

import {
  NUMBER_OF_SHOW_ME_QUESTIONS as NUMBER_OF_SHOW_ME_QUESTIONS_NON_TRAILER,
} from '../constants/show-me-questions/show-me-questions.vocational.constants';

import {
  NUMBER_OF_TELL_ME_QUESTIONS as NUMBER_OF_TELL_ME_QUESTIONS_TRAILER,
} from '../constants/tell-me-questions/tell-me-questions.vocational-trailer.constants';

import {
  NUMBER_OF_SHOW_ME_QUESTIONS as NUMBER_OF_SHOW_ME_QUESTIONS_TRAILER,
} from '../constants/show-me-questions/show-me-questions.vocational-trailer.constants';

export const vehicleChecksQuestionsByLicenceHeld = (fullLicenceHeld: boolean): number => {
  if (fullLicenceHeld) {
    return NUMBER_OF_SHOW_ME_QUESTIONS_TRAILER + NUMBER_OF_TELL_ME_QUESTIONS_TRAILER;
  }
  return NUMBER_OF_SHOW_ME_QUESTIONS_NON_TRAILER + NUMBER_OF_TELL_ME_QUESTIONS_NON_TRAILER;
};
