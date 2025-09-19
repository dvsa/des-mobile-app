import { RemoteConfig } from '@dvsa/mes-config-schema/remote-config';
import { Platform } from '@ionic/angular';
import { Store, createSelector } from '@ngrx/store';
import { AppConfig } from '@providers/app-config/app-config.model';
import { compareVersions } from '@shared/helpers/compare-versions';
import { StoreModel } from '@shared/models/store.model';
import { AppConfigStateModel } from '@store/app-config/app-config.reducer';
import { selectVersionNumber } from '@store/app-info/app-info.selectors';
import { Observable } from 'rxjs';
import { filter, map, withLatestFrom } from 'rxjs/operators';

export const selectAppConfigState = (state: StoreModel): AppConfigStateModel => state.appConfig;
export const selectAppConfig = createSelector(
  selectAppConfigState,
  (appConfigState: AppConfigStateModel): AppConfig => appConfigState.appConfiguration
);
export const selectRemoteConfig = createSelector(
  selectAppConfigState,
  (appConfigState: AppConfigStateModel): RemoteConfig => appConfigState.remoteConfiguration
);

export const selectRole = createSelector(selectAppConfig, (appConfigState: AppConfig): string => appConfigState.role);

export const selectLogoutEnabled = createSelector(
  selectAppConfig,
  (appConfigState: AppConfig): boolean => appConfigState.journal?.enableLogoutButton
);

export const selectLiveAppVersion = createSelector(
  selectAppConfig,
  (appConfigState: AppConfig): string => appConfigState.liveAppVersion
);

export const showUpdateAvailable$ = (store$: Store<StoreModel>, platform: Platform): Observable<boolean> =>
  store$.select(selectVersionNumber).pipe(
    filter(() => platform.is('cordova')),
    withLatestFrom(store$.select(selectLiveAppVersion)),
    map(([currentVersion, liveVersion]) => {
      if (!currentVersion || !liveVersion) {
        return false;
      }
      return compareVersions(currentVersion, '<', liveVersion);
    })
  );

export const getUpdateAvailableCount$ = (store$: Store<StoreModel>, platform: Platform): Observable<number> =>
  showUpdateAvailable$(store$, platform).pipe(map((available) => (available ? 1 : 0)));
