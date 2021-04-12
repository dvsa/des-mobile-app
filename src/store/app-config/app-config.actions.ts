import { createAction, props } from '@ngrx/store';
import { AppConfig } from '@providers/app-config/app-config.model';

export const LoadAppConfig = createAction(
  '[AppConfigEffects] Load App Config',
  props<{ appConfig: AppConfig }>(),
);
