import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { selectCurrentTest } from '@store/tests/tests.selector';
import * as instructorDetailsActions from './instructor-details.actions';

const initialState: CatBUniqueTypes.InstructorDetails = {};

export const instructorDetailsReducer = createReducer(
  initialState,
  on(instructorDetailsActions.InstructorRegistrationNumberChanged, (state, {
    registrationNumber,
  }): CatBUniqueTypes.InstructorDetails => ({
    ...state,
    registrationNumber,
  })),
);

export const getInstructorDetails = createFeatureSelector<CatBUniqueTypes.InstructorDetails>('instructorDetails');

export const selectInstructorDetails = createSelector(
  selectCurrentTest,
  (test: CatBUniqueTypes.TestResult) => test.instructorDetails as CatBUniqueTypes.InstructorDetails,
);
