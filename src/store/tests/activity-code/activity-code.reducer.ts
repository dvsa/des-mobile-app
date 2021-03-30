import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { ActivityCode } from '@dvsa/mes-test-schema/categories/common';
import * as activityCodeActions from './activity-code.actions';

export const initialState: ActivityCode = null;

export const activityCodeReducer = createReducer(
  initialState,
  on(activityCodeActions.SetActivityCode, (state, { payload }) => payload),
);

export const getActivityCode = createFeatureSelector<ActivityCode>('activityCode');
