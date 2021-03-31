
import { ETA, Eco, TestData } from '@dvsa/mes-test-schema/categories/common';
import { Competencies, ExaminerActions } from '../test-data.constants';
import { OutcomeBehaviourMapProvider } from '../../../../providers/outcome-behaviour-map/outcome-behaviour-map';
import { VehicleChecksQuestion } from '../../../../providers/question/vehicle-checks-question.model';

export const hasSeriousFault = (
  data: TestData, competency: Competencies) => data.seriousFaults[competency];

export const hasDangerousFault = (
  data: TestData, competency: Competencies) => data.dangerousFaults[competency];

export const getTestRequirements = (data: TestData) => data.testRequirements;

export const getETA = (data: TestData) => data.ETA;

export const getETAFaultText = (data: ETA) => {
  if (!data) return;
  if (data.physical && !data.verbal) return 'Physical';
  if (!data.physical && data.verbal) return 'Verbal';
  if (data.physical && data.verbal) return 'Physical and Verbal';
  return;
};

export const hasExaminerTakenAction = (data: ETA, action: ExaminerActions) => {
  return data[action];
};

export const getEco = (data: TestData) => data.eco;

export const getEcoFaultText = (data: Eco) => {
  if (!data) return;
  if (data.adviceGivenControl && !data.adviceGivenPlanning) return 'Control';
  if (!data.adviceGivenControl && data.adviceGivenPlanning) return 'Planning';
  if (data.adviceGivenControl && data.adviceGivenPlanning) return 'Control and Planning';
  return;
};

export const getShowMeQuestionOptions = (
  questions: VehicleChecksQuestion[],
  outcome: string,
  provider: OutcomeBehaviourMapProvider) => {
  const filteredQuestions: VehicleChecksQuestion[] = [];
  const showNotApplicable = provider.showNotApplicable(outcome, 'showMeQuestion');
  questions.forEach((value) => {
    if (value.code !== 'N/A' || (value.code === 'N/A' && showNotApplicable)) {
      filteredQuestions.push(value);
    }
  });
  return filteredQuestions;
};
