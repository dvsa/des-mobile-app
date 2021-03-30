import { createFeatureSelector } from '@ngrx/store';
import { Accompaniment } from '@dvsa/mes-test-schema/categories/CPC';
import * as accompanimentActions from './accompaniment.cat-cpc.actions';

const initialState: Accompaniment = {};

export const accompanimentCatCPCReducer = (
  state = initialState,
  action: accompanimentActions.Types): Accompaniment => {

  switch (action.type) {
    case accompanimentActions.SUPERVISOR_ACCOMPANIMENT_TOGGLED:
      return {
        ...state,
        supervisor: !state.supervisor,
      };
    case accompanimentActions.INTERPRETER_ACCOMPANIMENT_TOGGLED:
      return {
        ...state,
        interpreter: !state.interpreter,
      };
  }
  return state;
};

export const getAccompaniment = createFeatureSelector<Accompaniment>('accompaniment');
