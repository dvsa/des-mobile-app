import { createReducer, createFeatureSelector, on } from '@ngrx/store';

import { AppConfig } from '../../app/providers/app-config/app-config.model';
import { LoadAppConfig } from './app-config.actions';

export const appConfigFeatureKey = 'appConfig';

export const initialState = {} as AppConfig;

export const appConfigReducer = createReducer(
  initialState,
  on(LoadAppConfig, (state: AppConfig, { appConfig }) => ({
    ...state,
    ...appConfig,
  })),
);

export const getAppConfigState = createFeatureSelector<AppConfig>('appConfig');
