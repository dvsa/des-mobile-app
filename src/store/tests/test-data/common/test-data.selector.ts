import { ETA, Eco, TestData } from '@dvsa/mes-test-schema/categories/common';
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { Competencies, ExaminerActions } from '../test-data.constants';

export const hasSeriousFault = (
  data: TestData,
  competency: Competencies,
) => data.seriousFaults[competency];

export const hasDangerousFault = (
  data: TestData,
  competency: Competencies,
) => data.dangerousFaults[competency];

export const getTestRequirements = (data: TestData) => data.testRequirements;

export const getETA = (data: TestData) => data.ETA;

export const getETAFaultText = (data: ETA) => {
  if (!data || (!data.physical && !data.verbal)) return;
  if (data.physical && !data.verbal) return 'Physical';
  if (!data.physical && data.verbal) return 'Verbal';
  if (data.physical && data.verbal) return 'Physical and Verbal';
};

export const hasExaminerTakenAction = (data: ETA, action: ExaminerActions) => {
  return data[action];
};

export const getEco = (data: TestData) => data.eco;

export const getFuelEfficientDriving = (data: Eco) => data.fuelEfficientDriving;

export const getEcoRelatedFault = (data: Eco) => data.ecoRelatedFault;

export const getEcoCaptureReason = (data: Eco) => data.ecoCaptureReason;

export const getEcoFaultText = (data: Eco) => {
  if (!data || (!data.adviceGivenControl && !data.adviceGivenPlanning)) return;
  if (data.adviceGivenControl && !data.adviceGivenPlanning) return 'Control';
  if (!data.adviceGivenControl && data.adviceGivenPlanning) return 'Planning';
  if (data.adviceGivenControl && data.adviceGivenPlanning) return 'Control and Planning';
};

export const getShowMeQuestionOptions = (
  questions: VehicleChecksQuestion[],
  outcome: string,
  provider: OutcomeBehaviourMapProvider,
): VehicleChecksQuestion[] => {
  const filteredQuestions: VehicleChecksQuestion[] = [];
  const showNotApplicable = provider.showNotApplicable(outcome, 'showMeQuestion');
  questions.forEach((value) => {
    if (value.code !== 'N/A' || (value.code === 'N/A' && showNotApplicable)) {
      filteredQuestions.push(value);
    }
  });
  return filteredQuestions;
};
