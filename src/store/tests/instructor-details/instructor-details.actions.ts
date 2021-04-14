import { createAction } from '@ngrx/store';

export const InstructorRegistrationNumberChanged = createAction(
  '[Vehicle Details] Instructor registration number changed',
  (registrationNumber: number) => ({ registrationNumber }),
);
