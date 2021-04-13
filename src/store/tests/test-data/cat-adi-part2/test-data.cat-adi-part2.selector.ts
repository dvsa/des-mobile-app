import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { get } from 'lodash';

import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';
import { QuestionProvider } from '@providers/question/question';
import {
  NUMBER_OF_TELL_ME_QUESTIONS,
} from '@shared/constants/tell-me-questions/tell-me-questions.cat-adi-part2.constants';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { Competencies, LegalRequirements } from '../test-data.constants';

export const getDrivingFaultCount = (
  data: CatADI2UniqueTypes.TestData,
  competency: Competencies,
) => data.drivingFaults[competency];

export const getManoeuvresADI2 = (
  data: CatADI2UniqueTypes.TestData,
): CatADI2UniqueTypes.Manoeuvres[] => data.manoeuvres;

export const hasManoeuvreBeenCompletedCatADIPart2 = (manoeuvres: CatADI2UniqueTypes.Manoeuvres[]) => {
  if (!manoeuvres || manoeuvres.length < 2) return false;

  return manoeuvres.every((manoeuvre) => {
    return (
      get(manoeuvre, 'forwardPark.selected')
      || get(manoeuvre, 'reverseParkCarpark.selected')
      || get(manoeuvre, 'reverseParkRoad.selected')
      || get(manoeuvre, 'reverseRight.selected')
    );
  });
};

export const hasEyesightTestBeenCompleted = (data: CatADI2UniqueTypes.TestData) => data.eyesightTest.complete;

export const hasEyesightTestGotSeriousFault = (data: CatADI2UniqueTypes.TestData) => data.eyesightTest.seriousFault;

export const hasLegalRequirementBeenCompleted = (
  data: CatADI2UniqueTypes.TestRequirements,
  legalRequirement: LegalRequirements,
) => data[legalRequirement];

export const getTellMeQuestion = (state: CatADI2UniqueTypes.VehicleChecks): VehicleChecksQuestion => {
  const questionProvider: QuestionProvider = new QuestionProvider();
  return questionProvider
    .getTellMeQuestions(TestCategory.ADI2)
    .find((question) => question.code === get(state, 'tellMeQuestion.code'));
};

export const getVehicleChecksCatADIPart2 = (
  state: CatADI2UniqueTypes.TestData,
): CatADI2UniqueTypes.VehicleChecks => state.vehicleChecks;

export const areTellMeQuestionsSelected = (
  state: CatADI2UniqueTypes.VehicleChecks,
) => typeof get(state, 'tellMeQuestions') !== 'undefined';

export const areTellMeQuestionsCorrect = (state: CatADI2UniqueTypes.VehicleChecks) => {
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

export const hasVehicleChecksBeenCompletedCatADI2 = (vehicleChecks: CatADI2UniqueTypes.VehicleChecks): boolean => {

  if (
    !(vehicleChecks && vehicleChecks.tellMeQuestions instanceof Array)
    || vehicleChecks.tellMeQuestions.length !== NUMBER_OF_TELL_ME_QUESTIONS
    || !vehicleChecks.vehicleChecksCompleted
  ) {
    return false;
  }

  vehicleChecks.tellMeQuestions.forEach((element) => {
    if (element.outcome == null) {
      return false;
    }
  });
  return true;
};
