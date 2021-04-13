import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { DateTime } from '../../../app/shared/helpers/date-time';
import * as rekeyDateActions from './rekey-date.actions';

export const initialState: string = null;

export const rekeyDateReducer = createReducer(
  initialState,
  on(rekeyDateActions.SetRekeyDate, (state) =>
    (state || new DateTime().format('YYYY-MM-DDTHH:mm:ss'))),
);

export const getRekeyDate = createFeatureSelector<boolean>('rekeyDate');
