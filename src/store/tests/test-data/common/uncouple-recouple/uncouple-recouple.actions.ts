import { createAction } from '@ngrx/store';

export const ToggleUncoupleRecouple = createAction(
  '[UncoupleRecouple] Toggle Uncouple Recouple',
);

export const UncoupleRecoupleAddDrivingFault = createAction(
  '[UncoupleRecouple] Add Driving Fault',
);

export const UncoupleRecoupleAddSeriousFault = createAction(
  '[UncoupleRecouple] Add Serious Fault',
);

export const UncoupleRecoupleAddDangerousFault = createAction(
  '[UncoupleRecouple] Add Dangerous Fault',
);

export const UncoupleRecoupleRemoveFault = createAction(
  '[UncoupleRecouple] Remove Fault',
);

export const AddUncoupleRecoupleComment = createAction(
  '[UncoupleRecouple] Add Comment',
  (comment: string) => ({ comment }),
);
