import { Injectable } from '@angular/core';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

import tellMeQuestionsCatAdiPart2Constants
  from '@shared/constants/tell-me-questions/tell-me-questions.cat-adi-part2.constants';
import showMeQuestionsCatAdiPart2Constants
  from '@shared/constants/show-me-questions/show-me-questions.cat-adi-part2.constants';
import tellMeQuestionsCatBConstants from '@shared/constants/tell-me-questions/tell-me-questions.cat-b.constants';
import showMeQuestionsCatBConstants from '@shared/constants/show-me-questions/show-me-questions.cat-b.constants';
import tellMeQuestionsCatBeConstants from '@shared/constants/tell-me-questions/tell-me-questions.cat-be.constants';
import showMeQuestionsCatBeConstants from '@shared/constants/show-me-questions/show-me-questions.cat-be.constants';
import tellMeQuestionsCatCConstants
  from '@shared/constants/tell-me-questions/tell-me-questions.cat-c.constants';
import showMeQuestionsCatCConstants
  from '@shared/constants/show-me-questions/show-me-questions.cat-c.constants';
import tellMeQuestionsCatCeConstants
  from '@shared/constants/tell-me-questions/tell-me-questions.cat-ce.constants';
import showMeQuestionsCatCeConstants
  from '@shared/constants/show-me-questions/show-me-questions.cat-ce.constants';
import tellMeQuestionsCatDConstants
  from '@shared/constants/tell-me-questions/tell-me-questions.cat-d.constants';
import showMeQuestionsCatDConstants
  from '@shared/constants/show-me-questions/show-me-questions.cat-d.constants';
import tellMeQuestionsCatDeConstants
  from '@shared/constants/tell-me-questions/tell-me-questions.cat-de.constants';
import showMeQuestionsCatDeConstants
  from '@shared/constants/show-me-questions/show-me-questions.cat-de.constants';
import safetyQuestionsCatAMod2Constants from '@shared/constants/safety-questions.cat-a-mod2.constants';
import balanceQuestionsCatAMod2Constants from '@shared/constants/balance-questions.cat-a-mod2.constants';
import safetyQuestionsCatDConstants from '@shared/constants/safety-questions.cat-d.constants';
import showMeQuestionsCatHomeTestConstants
  from '@shared/constants/show-me-questions/show-me-questions.cat-home-test.constants';
import tellMeQuestionsCatHomeTestConstants
  from '@shared/constants/tell-me-questions/tell-me-questions.cat-home-test.constants';
import { SafetyQuestion } from './safety-question.model';
import { VehicleChecksQuestion } from './vehicle-checks-question.model';

@Injectable()
export class QuestionProvider {

  getTellMeQuestions(testCategory: TestCategory): VehicleChecksQuestion[] {
    switch (testCategory) {
      case TestCategory.ADI2:
        return tellMeQuestionsCatAdiPart2Constants;
      case TestCategory.B:
        return tellMeQuestionsCatBConstants;
      case TestCategory.BE:
        return tellMeQuestionsCatBeConstants;
      case TestCategory.C:
      case TestCategory.C1:
        return tellMeQuestionsCatCConstants;
      case TestCategory.CE:
      case TestCategory.C1E:
        return tellMeQuestionsCatCeConstants;
      case TestCategory.D:
      case TestCategory.D1:
        return tellMeQuestionsCatDConstants;
      case TestCategory.DE:
      case TestCategory.D1E:
        return tellMeQuestionsCatDeConstants;
      case TestCategory.K:
      case TestCategory.F:
      case TestCategory.G:
      case TestCategory.H:
        return tellMeQuestionsCatHomeTestConstants;
      default:
        return [];
    }
  }

  getShowMeQuestions(testCategory: TestCategory): VehicleChecksQuestion[] {
    switch (testCategory) {
      case TestCategory.ADI2:
        return showMeQuestionsCatAdiPart2Constants;
      case TestCategory.B:
        return showMeQuestionsCatBConstants;
      case TestCategory.BE:
        return showMeQuestionsCatBeConstants;
      case TestCategory.C:
      case TestCategory.C1:
        return showMeQuestionsCatCConstants;
      case TestCategory.CE:
      case TestCategory.C1E:
        return showMeQuestionsCatCeConstants;
      case TestCategory.D:
      case TestCategory.D1:
        return showMeQuestionsCatDConstants;
      case TestCategory.DE:
      case TestCategory.D1E:
        return showMeQuestionsCatDeConstants;
      case TestCategory.K:
      case TestCategory.F:
      case TestCategory.G:
      case TestCategory.H:
        return showMeQuestionsCatHomeTestConstants;
      default:
        return [];
    }
  }

  getSafetyQuestions(testCategory: TestCategory): VehicleChecksQuestion[] {
    switch (testCategory) {
      case TestCategory.EUA1M2:
      case TestCategory.EUA2M2:
      case TestCategory.EUAM2:
      case TestCategory.EUAMM2:
        return safetyQuestionsCatAMod2Constants;
      default:
        return [];
    }
  }

  getBalanceQuestions(testCategory: TestCategory): VehicleChecksQuestion[] {
    switch (testCategory) {
      case TestCategory.EUA1M2:
      case TestCategory.EUA2M2:
      case TestCategory.EUAM2:
      case TestCategory.EUAMM2:
        return balanceQuestionsCatAMod2Constants;
      default:
        return [];
    }
  }

  getVocationalSafetyQuestions(testCategory: TestCategory): SafetyQuestion[] {
    switch (testCategory) {
      case TestCategory.D:
      case TestCategory.D1:
      case TestCategory.DE:
      case TestCategory.D1E:
        return safetyQuestionsCatDConstants;
      default:
        return [];
    }
  }
}
