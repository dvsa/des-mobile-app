import { RemoteConfig } from '@dvsa/mes-config-schema/remote-config';
import { createAction, props } from '@ngrx/store';
import { AppConfig } from '@providers/app-config/app-config.model';

export const LoadAppConfig = createAction('[AppConfigEffects] Load App Config', props<{ appConfig: AppConfig }>());
export const LoadRemoteConfig = createAction(
  '[AppConfigEffects] Load Remote Config',
  props<{ remoteConfig: RemoteConfig }>()
);

export const UnloadConfig = createAction('[AppConfigEffects] Unload Config');
