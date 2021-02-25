import { createAction, props } from '@ngrx/store';
import { AppConfig } from '../../app/providers/app-config/app-config.model';

export const LoadAppConfig = createAction(
  '[AppConfigEffects] Load App Config',
  props<{ appConfig: AppConfig }>(),
);
