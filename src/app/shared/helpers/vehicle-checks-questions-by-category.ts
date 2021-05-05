import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import {
  NUMBER_OF_SHOW_ME_QUESTIONS,
} from '../constants/show-me-questions/show-me-questions.cat-be.constants';
import {
  NUMBER_OF_TELL_ME_QUESTIONS,
} from '../constants/tell-me-questions/tell-me-questions.cat-be.constants';
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

export const vehicleChecksQuestionsByCategory = (category: TestCategory): number => {
  switch (category) {
    case TestCategory.BE:
      return NUMBER_OF_SHOW_ME_QUESTIONS + NUMBER_OF_TELL_ME_QUESTIONS;
    case TestCategory.C:
    case TestCategory.C1:
    case TestCategory.D:
    case TestCategory.D1:
      return NUMBER_OF_SHOW_ME_QUESTIONS_NON_TRAILER + NUMBER_OF_TELL_ME_QUESTIONS_NON_TRAILER;
    case TestCategory.CE:
    case TestCategory.C1E:
    case TestCategory.DE:
    case TestCategory.D1E:
      return NUMBER_OF_SHOW_ME_QUESTIONS_TRAILER + NUMBER_OF_TELL_ME_QUESTIONS_TRAILER;
  }
};
