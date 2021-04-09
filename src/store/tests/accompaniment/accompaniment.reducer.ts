import { Accompaniment } from '@dvsa/mes-test-schema/categories/common';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as accompanimentActions from './accompaniment.actions';

const initialState: Accompaniment = {};

export const accompanimentReducer = createReducer(
  initialState,
  on(accompanimentActions.InstructorAccompanimentToggled, (state: Accompaniment): Accompaniment => ({
    ...state,
    ADI: !state.ADI,
  })),
  on(accompanimentActions.SupervisorAccompanimentToggled, (state: Accompaniment): Accompaniment => ({
    ...state,
    supervisor: !state.supervisor,
  })),
  on(accompanimentActions.OtherAccompanimentToggled, (state: Accompaniment): Accompaniment => ({
    ...state,
    other: !state.other,
  })),
  on(accompanimentActions.InterpreterAccompanimentToggled, (state: Accompaniment): Accompaniment => ({
    ...state,
    interpreter: !state.interpreter,
  })),
);

export const getAccompaniment = createFeatureSelector<Accompaniment>('accompaniment');
