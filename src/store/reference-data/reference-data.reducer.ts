import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { RefDataTestCentreResponse } from '@providers/reference-data/reference-data';
import { LoadTestCentresRefDataSuccess, SetDateRefDataUpdated, UnloadRefData } from './reference-data.actions';

export type RefDataStateModel = {
  dateLoaded: string,
  testCentres: RefDataTestCentreResponse;
};

export const refDataFeatureKey = 'refData';

export const initialState: RefDataStateModel = {
  dateLoaded: null,
  testCentres: null,
};

export const referenceDataReducer = createReducer(
  initialState,
  on(SetDateRefDataUpdated, (state, { date }) => ({
    ...state,
    dateLoaded: date,
  })),
  on(LoadTestCentresRefDataSuccess, (state, { testCentres }) => ({
    ...state,
    testCentres,
  })),
  on(UnloadRefData, () => ({
    ...initialState,
  })),
);

export const getRefDataState = createFeatureSelector<RefDataStateModel>(refDataFeatureKey);
