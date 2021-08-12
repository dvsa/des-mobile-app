import { get } from 'lodash';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import {
  CatDTestData,
  CatDManoeuvres,
  CatDTestRequirements,
  CatDVehicleChecks,
} from '@shared/unions/test-schema-unions';
import {
  NUMBER_OF_SHOW_ME_QUESTIONS,
} from '@shared/constants/show-me-questions/show-me-questions.vocational.constants';
import {
  NUMBER_OF_TELL_ME_QUESTIONS,
} from '@shared/constants/tell-me-questions/tell-me-questions.vocational.constants';
import { Competencies, LegalRequirements } from '../test-data.constants';

export const getDrivingFaultCount = (
  data: CatDTestData, competency: Competencies,
) => data.drivingFaults[competency];

export const getManoeuvres = (data: CatDTestData): CatDManoeuvres => data.manoeuvres;

// TODO - We should pass a Manoeuvre object here instead of TestData
export const hasManoeuvreBeenCompletedCatD = (data: CatDTestData) => {
  return (
    get(data.manoeuvres, 'reverseLeft.selected')
  );
};

export const hasLegalRequirementBeenCompleted = (
  data: CatDTestRequirements, legalRequirement: LegalRequirements,
) => {
  return data[legalRequirement];
};

export const getVehicleChecks = (
  state: CatDTestData,
): CatDVehicleChecks => state.vehicleChecks;

export const areTellMeQuestionsSelected = (
  state: CatDVehicleChecks,
) => typeof get(state, 'tellMeQuestions') !== 'undefined';

export const areTellMeQuestionsCorrect = (state: CatDVehicleChecks) => {
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

// TODO - We should really pass a Vehicle Checks object here and not Test Data
export const hasVehicleChecksBeenCompletedCatD = (data: CatDTestData): boolean => {
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
