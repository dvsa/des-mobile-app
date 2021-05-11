import { get } from 'lodash';
import { CompetencyOutcome } from 'src/app/shared/models/competency-outcome';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { QuestionProvider } from 'src/app/providers/question/question';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { VehicleChecksQuestion } from 'src/app/providers/question/vehicle-checks-question.model';
import { Competencies, LegalRequirements } from '../test-data.constants';

export const getDrivingFaultCount = (
  data: CatBUniqueTypes.TestData, competency: Competencies,
) => data.drivingFaults[competency];

export const getManoeuvres = (data: CatBUniqueTypes.TestData): CatBUniqueTypes.Manoeuvres => data.manoeuvres;

export const hasManoeuvreBeenCompletedCatB = (data: CatBUniqueTypes.TestData) => {
  return (
    get(data.manoeuvres, 'forwardPark.selected')
    || get(data.manoeuvres, 'reverseParkCarpark.selected')
    || get(data.manoeuvres, 'reverseParkRoad.selected')
    || get(data.manoeuvres, 'reverseRight.selected')
  );
};

export const hasEyesightTestGotSeriousFault = (
  data: CatBUniqueTypes.TestData,
) => data?.eyesightTest?.seriousFault ?? undefined;

export const hasEyesightTestBeenCompleted = (
  data: CatBUniqueTypes.TestData,
) => data?.eyesightTest?.complete ?? undefined;

export const hasLegalRequirementBeenCompleted = (
  data: CatBUniqueTypes.TestRequirements, legalRequirement: LegalRequirements,
) => {
  return data[legalRequirement];
};

export const getVehicleChecks = (state: CatBUniqueTypes.TestData): CatBUniqueTypes.VehicleChecks => state.vehicleChecks;

export const getTellMeQuestion = (state: CatBUniqueTypes.VehicleChecks): VehicleChecksQuestion => {
  const questionProvider: QuestionProvider = new QuestionProvider();
  return questionProvider
    .getTellMeQuestions(TestCategory.B)
    .find((question) => question.code === get(state, 'tellMeQuestion.code'));
};

export const isTellMeQuestionSelected = (
  state: CatBUniqueTypes.VehicleChecks,
) => get(state, 'tellMeQuestion.code') !== undefined;

export const isTellMeQuestionCorrect = (state: CatBUniqueTypes.VehicleChecks) =>
  get(state, 'tellMeQuestion.outcome') === CompetencyOutcome.P;

export const isTellMeQuestionDrivingFault = (state: CatBUniqueTypes.VehicleChecks) =>
  get(state, 'tellMeQuestion.outcome') === CompetencyOutcome.DF;

export const tellMeQuestionOutcome = (state: CatBUniqueTypes.VehicleChecks) => get(state, 'tellMeQuestion.outcome');

export const getSelectedTellMeQuestionText = (state: CatBUniqueTypes.VehicleChecks) => {
  const questionProvider: QuestionProvider = new QuestionProvider();

  const tellMeQuestionText = questionProvider
    .getTellMeQuestions(TestCategory.B)
    .find((question) => question.code === get(state, 'tellMeQuestion.code'));

  if (!tellMeQuestionText) {
    return '';
  }
  return `${get(state, 'tellMeQuestion.code')} - ${tellMeQuestionText.shortName}`;
};

export const getShowMeQuestion = (state: CatBUniqueTypes.VehicleChecks) => {
  const questionProvider: QuestionProvider = new QuestionProvider();
  return questionProvider
    .getShowMeQuestions(TestCategory.B)
    .find((question) => question.code === get(state, 'showMeQuestion.code'));
};

// TODO - We should really pass a Vehicle Checks object here and not Test Data
export const hasVehicleChecksBeenCompletedCatB = (data: CatBUniqueTypes.TestData): boolean => {
  const showMeQuestionOutcomeResult = get(data, 'vehicleChecks.showMeQuestion.outcome', null);
  const tellMeQuestionOutcomeResult = get(data, 'vehicleChecks.tellMeQuestion.outcome', null);

  return (showMeQuestionOutcomeResult != null && tellMeQuestionOutcomeResult != null);
};
