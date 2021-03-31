import { createAction, props } from '@ngrx/store';
import { FaultPayload } from '../../test-data.models';

export const AddDrivingFault = createAction(
  '[Competency] Add Driving Fault',
  props<{ payload: FaultPayload }>(),
);

export const ThrottleAddDrivingFault = createAction(
  '[Competency] Debounce Add Driving Fault',
  props<{ payload: FaultPayload }>(),
);

export const RemoveDrivingFault = createAction(
  '[Competency] Remove Driving Fault',
  props<{ payload: FaultPayload }>(),
);

export const AddDrivingFaultComment = createAction(
  '[Office] Add driving fault comment',
  props<{ competencyName: string, comment: string }>(),
);
