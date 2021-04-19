import { createAction } from '@ngrx/store';

export const PcvDoorExerciseAddDrivingFault = createAction(
  '[PcvDoorExercise] Add Driving Fault',
);

export const PcvDoorExerciseAddSeriousFault = createAction(
  '[PcvDoorExercise] Add Serious Fault',
);

export const PcvDoorExerciseAddDangerousFault = createAction(
  '[PcvDoorExercise] Add Dangerous Fault',
);

export const PcvDoorExerciseRemoveDrivingFault = createAction(
  '[PcvDoorExercise] Remove Driving Fault',
);

export const PcvDoorExerciseRemoveSeriousFault = createAction(
  '[PcvDoorExercise] Remove Serious Fault',
);

export const PcvDoorExerciseRemoveDangerousFault = createAction(
  '[PcvDoorExercise] Remove Dangerous Fault',
);

export const AddPcvDoorExerciseComment = createAction(
  '[PcvDoorExercise] Add Comment',
  (fieldName: string, comment: string) => ({ fieldName, comment }),
);
