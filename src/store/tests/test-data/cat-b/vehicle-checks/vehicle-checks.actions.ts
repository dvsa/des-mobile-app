import { createAction } from '@ngrx/store';
import { VehicleChecksQuestion } from '../../../../../app/providers/question/vehicle-checks-question.model';

export const TellMeQuestionSelected = createAction(
  '[Vehicle Checks] Tell me question selected',
  (tellMeQuestion: VehicleChecksQuestion) => ({ tellMeQuestion }),
);

export const TellMeQuestionCorrect = createAction(
  '[Vehicle Checks] Tell me question correct',
);

export const TellMeQuestionDrivingFault = createAction(
  '[Vehicle Checks] Tell me question driving fault',
);

export const AddShowMeTellMeComment = createAction(
  '[Vehicle Checks] Add Show me Tell me comment',
  (comment: string) => ({ comment }),
);

export const ShowMeQuestionSelected = createAction(
  '[Vehicle Checks] Show me question selected',
  (showMeQuestion: VehicleChecksQuestion) => ({ showMeQuestion }),
);

export const ShowMeQuestionPassed = createAction(
  '[Vehicle Checks] Show me question passed',
);

export const ShowMeQuestionDrivingFault = createAction(
  '[Vehicle Checks] Show me question driving fault',
);

export const ShowMeQuestionSeriousFault = createAction(
  '[Vehicle Checks] Show me question serious fault',
);

export const ShowMeQuestionDangerousFault = createAction(
  '[Vehicle Checks] Show me question dangerous fault',
);
// export const SHOW_ME_QUESTION_REMOVE_FAULT = '[Vehicle Checks] Show me question remove fault';
export const ShowMeQuestionRemoveFault = createAction(
  '[Vehicle Checks] Show me question remove fault',
);

export enum QuestionOutcomes {
  Pass = 'P',
  DrivingFault = 'DF',
}
