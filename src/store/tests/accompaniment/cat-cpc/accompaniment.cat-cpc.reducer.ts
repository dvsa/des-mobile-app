import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { Accompaniment } from '@dvsa/mes-test-schema/categories/CPC';
import * as accompanimentActions from './accompaniment.cat-cpc.actions';

const initialState: Accompaniment = {};

export const accompanimentCatCPCReducer = createReducer(
  initialState,
  on(accompanimentActions.SupervisorAccompanimentToggledCPC, (state): Accompaniment => ({
    ...state,
    supervisor: !state.supervisor,
  })),
  on(accompanimentActions.InterpreterAccompanimentToggledCPC, (state): Accompaniment => ({
    ...state,
    interpreter: !state.interpreter,
  })),
);

export const getAccompaniment = createFeatureSelector<Accompaniment>('accompaniment');
