import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as highwayCodeSafetyActions from './highway-code-safety.actions';
import { HighwayCodeSafetyUnion } from '../../../../../app/shared/unions/test-schema-unions';

export const initialState: HighwayCodeSafetyUnion = {};

export const highwayCodeSafetyReducer = createReducer(
  initialState,
  on(highwayCodeSafetyActions.ToggleHighwayCodeSafety, (state): HighwayCodeSafetyUnion => ({
    ...state,
    selected: !state.selected,
  })),
  on(highwayCodeSafetyActions.HighwayCodeSafetyAddDrivingFault, (state): HighwayCodeSafetyUnion => ({
    ...state,
    drivingFault: true,
    selected: true,
  })),
  on(highwayCodeSafetyActions.HighwayCodeSafetyAddSeriousFault, (state): HighwayCodeSafetyUnion => ({
    ...state,
    seriousFault: true,
    selected: true,
  })),
  on(highwayCodeSafetyActions.HighwayCodeSafetyRemoveFault, (state): HighwayCodeSafetyUnion => ({
    selected: state.selected,
  })),
  on(highwayCodeSafetyActions.HighwayCodeSafetyAddComment, (state, { comment }): HighwayCodeSafetyUnion => ({
    ...state,
    faultComments: comment,
  })),
);

export const getHighwayCodeSafety = createFeatureSelector<HighwayCodeSafetyUnion>('highwayCodeSafety');
