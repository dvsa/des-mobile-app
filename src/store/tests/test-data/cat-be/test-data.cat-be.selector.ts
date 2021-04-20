import { CatBEUniqueTypes } from '@dvsa/mes-test-schema/categories/BE';
import { get } from 'lodash';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { QuestionProvider } from '@providers/question/question';
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';
import { NUMBER_OF_SHOW_ME_QUESTIONS }
  from '@shared/constants/show-me-questions/show-me-questions.cat-be.constants';
import { NUMBER_OF_TELL_ME_QUESTIONS }
  from '@shared/constants/tell-me-questions/tell-me-questions.cat-be.constants';
import { Competencies, LegalRequirements } from '../test-data.constants';

export const getDrivingFaultCount = (
  data: CatBEUniqueTypes.TestData,
  competency: Competencies,
) => data.drivingFaults[competency];

export const getManoeuvres = (data: CatBEUniqueTypes.TestData): CatBEUniqueTypes.Manoeuvres => data.manoeuvres;

export const hasManoeuvreBeenCompletedCatBE = (data: CatBEUniqueTypes.TestData) => {
  return (
    get(data.manoeuvres, 'reverseLeft.selected')
  );
};

export const hasEyesightTestBeenCompleted = (data: CatBEUniqueTypes.TestData) => data.eyesightTest.complete;

export const hasEyesightTestGotSeriousFault = (data: CatBEUniqueTypes.TestData) => data.eyesightTest.seriousFault;

export const hasLegalRequirementBeenCompleted = (
  data: CatBEUniqueTypes.TestRequirements,
  legalRequirement: LegalRequirements,
) => {
  return data[legalRequirement];
};

export const getVehicleChecks = (
  state: CatBEUniqueTypes.TestData,
): CatBEUniqueTypes.VehicleChecks => state.vehicleChecks;

export const getTellMeQuestion = (state: CatBEUniqueTypes.VehicleChecks): VehicleChecksQuestion => {
  const questionProvider: QuestionProvider = new QuestionProvider();
  return questionProvider
    .getTellMeQuestions(TestCategory.BE)
    .find((question) => question.code === get(state, 'tellMeQuestion.code'));
};

export const areTellMeQuestionsSelected = (
  state: CatBEUniqueTypes.VehicleChecks,
) => typeof get(state, 'tellMeQuestions') !== 'undefined';

export const areTellMeQuestionsCorrect = (state: CatBEUniqueTypes.VehicleChecks) => {
  const tellMeQuestions = get(state, 'tellMeQuestions');
  let correct = true;

  if (typeof tellMeQuestions === 'undefined' || tellMeQuestions === null || !(tellMeQuestions instanceof Array)) {
    correct = false;
  } else {
    tellMeQuestions.forEach((question) => {
      if (question.outcome !== CompetencyOutcome.P) {
        correct = false;
      }
    });
  }

  return correct;
};

export const hasVehicleChecksBeenCompletedCatBE = (data: CatBEUniqueTypes.TestData): boolean => {
  let showMeQuestionComplete = true;
  let tellMeQuestionComplete = true;

  if (
    !(data.vehicleChecks && data.vehicleChecks.showMeQuestions instanceof Array)
    || data.vehicleChecks.showMeQuestions.length !== NUMBER_OF_SHOW_ME_QUESTIONS
  ) {
    showMeQuestionComplete = false;
  } else {
    data.vehicleChecks.showMeQuestions.forEach((element) => {
      if (element.outcome == null) {
        showMeQuestionComplete = false;
      }
    });
  }

  if (
    !(data.vehicleChecks && data.vehicleChecks.tellMeQuestions instanceof Array)
    || data.vehicleChecks.tellMeQuestions.length !== NUMBER_OF_TELL_ME_QUESTIONS
  ) {
    tellMeQuestionComplete = false;
  } else {
    data.vehicleChecks.tellMeQuestions.forEach((element) => {
      if (element.outcome == null) {
        tellMeQuestionComplete = false;
      }
    });
  }

  return (showMeQuestionComplete && tellMeQuestionComplete);
};
