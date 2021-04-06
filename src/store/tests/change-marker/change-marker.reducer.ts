import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as changeMarkerActions from './change-marker.actions';

export const initialState: boolean = false;

export const changeMarkerReducer = createReducer(
  initialState,
  on(changeMarkerActions.SetChangeMarker, (state, { changeMarker }) => changeMarker),
);

export const getChangeMarker = createFeatureSelector<boolean>('changeMarker');
