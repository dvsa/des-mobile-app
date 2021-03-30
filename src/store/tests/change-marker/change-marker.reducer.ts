import  * as changeMarkerActions from './change-marker.actions';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';

export const initialState: boolean = false;

export const changeMarkerReducer = createReducer(
  initialState,
  on(changeMarkerActions.SetChangeMarker, (state, { payload }) => payload),
);

export const getChangeMarker = createFeatureSelector<boolean>('changeMarker');
