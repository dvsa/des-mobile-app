import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { createSelector } from '@ngrx/store';
import { selectInstructorDetails } from '@store/tests/instructor-details/instructor-details.reducer';

export const getInstructorRegistrationNumber = (
  instructorDetails: CatBUniqueTypes.InstructorDetails,
) => instructorDetails.registrationNumber;

export const selectInstructorRegistrationNumber = createSelector(
  selectInstructorDetails,
  ({ registrationNumber }) => registrationNumber,
);
