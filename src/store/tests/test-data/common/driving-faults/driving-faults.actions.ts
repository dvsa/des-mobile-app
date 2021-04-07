import { createAction, union } from '@ngrx/store';
import { FaultPayload } from '../../test-data.models';

export const AddDrivingFault = createAction(
  '[Competency] Add Driving Fault',
  (faultPayload: FaultPayload) => ({ faultPayload }),
);

export const ThrottleAddDrivingFault = createAction(
  '[Competency] Debounce Add Driving Fault',
  (faultPayload: FaultPayload) => ({ faultPayload }),
);

export const RemoveDrivingFault = createAction(
  '[Competency] Remove Driving Fault',
  (faultPayload: FaultPayload) => ({ faultPayload }),
);

export const AddDrivingFaultComment = createAction(
  '[Office] Add driving fault comment',
  (competencyName: string, comment: string) => ({ competencyName, comment }),
);

const actions = union({
  AddDrivingFault,
  ThrottleAddDrivingFault,
  RemoveDrivingFault,
  AddDrivingFaultComment,
});

export type DrivingFaultsActions = typeof actions;
