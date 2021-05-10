import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
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
