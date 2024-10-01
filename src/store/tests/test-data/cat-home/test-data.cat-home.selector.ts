import { NUMBER_OF_SHOW_ME_QUESTIONS } from '@shared/constants/show-me-questions/show-me-questions.cat-home-test.constants';
import { NUMBER_OF_TELL_ME_QUESTIONS } from '@shared/constants/tell-me-questions/tell-me-questions.cat-home-test.constants';
import { CatHomeTestData, CatHomeTestManoeuvres, CatHomeTestVehicleChecks } from '@shared/unions/test-schema-unions';
import { get } from 'lodash-es';

export const getVehicleChecks = (state: CatHomeTestData): CatHomeTestVehicleChecks => state.vehicleChecks;

export const getManoeuvres = (data: CatHomeTestData): CatHomeTestManoeuvres => get(data, 'manoeuvres');

export const hasManoeuvreBeenCompletedCatHomeTest = (data: CatHomeTestData): boolean => {
  return get(data, 'manoeuvres.reverseLeft.selected', undefined); // default to undefined for CAT K
};

export const hasVehicleChecksBeenCompletedCatHomeTest = (data: CatHomeTestData): boolean => {
  let showMeQuestionComplete = true;
  let tellMeQuestionComplete = true;

  if (
    !(data.vehicleChecks && Array.isArray(data.vehicleChecks.showMeQuestions)) ||
    data.vehicleChecks.showMeQuestions.length !== NUMBER_OF_SHOW_ME_QUESTIONS
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
    !(data.vehicleChecks && Array.isArray(data.vehicleChecks.tellMeQuestions)) ||
    data.vehicleChecks.tellMeQuestions.length !== NUMBER_OF_TELL_ME_QUESTIONS
  ) {
    tellMeQuestionComplete = false;
  } else {
    data.vehicleChecks.tellMeQuestions.forEach((element) => {
      if (element.outcome == null) {
        tellMeQuestionComplete = false;
      }
    });
  }

  return showMeQuestionComplete && tellMeQuestionComplete;
};
