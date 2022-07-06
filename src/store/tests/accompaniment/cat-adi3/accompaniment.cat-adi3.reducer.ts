import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { Accompaniment } from '@dvsa/mes-test-schema/categories/ADI3';
import * as accompanimentActions from '../accompaniment.actions';
import * as accompanimentADI3Actions from './accompaniment.cat-adi3.actions';

const initialState: Accompaniment = {};

export const accompanimentCatADI3Reducer = createReducer(
  initialState,
  on(accompanimentActions.SupervisorAccompanimentToggled, (state): Accompaniment => ({
    ...state,
    supervisor: !state.supervisor,
  })),
  on(accompanimentActions.OtherAccompanimentToggled, (state): Accompaniment => ({
    ...state,
    other: !state.other,
  })),
  on(accompanimentADI3Actions.TrainerAccompanimentToggled, (state): Accompaniment => ({
    ...state,
    trainer: !state.trainer,
  })),
);

export const getAccompaniment = createFeatureSelector<Accompaniment>('accompaniment');
