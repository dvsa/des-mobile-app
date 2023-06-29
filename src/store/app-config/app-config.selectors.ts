import { createSelector, Store } from '@ngrx/store';
import { AppConfig } from '@providers/app-config/app-config.model';
import { StoreModel } from '@shared/models/store.model';
import { selectVersionNumber } from '@store/app-info/app-info.selectors';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import { compareVersions } from '@shared/helpers/compare-versions';
import { Observable } from 'rxjs';
import { Platform } from '@ionic/angular';

export const selectAppConfig = (state: StoreModel): AppConfig => state.appConfig;

export const selectRole = createSelector(
  selectAppConfig,
  (appConfig: AppConfig): string => appConfig.role,
);

export const selectLogoutEnabled = createSelector(
  selectAppConfig,
  (appConfig: AppConfig): boolean => appConfig.journal?.enableLogoutButton,
);

export const selectLiveAppVersion = createSelector(
  selectAppConfig,
  (appConfig: AppConfig): string => appConfig.liveAppVersion,
);

export const showUpdateAvailable$ = (
  store$: Store<StoreModel>,
  platform: Platform,
): Observable<boolean> => store$.select(selectVersionNumber)
  .pipe(
    filter(() => platform.is('cordova')),
    withLatestFrom(store$.select(selectLiveAppVersion)),
    filter(([, liveVersion]) => !!liveVersion),
    map((
      [currentVersion, liveVersion],
    ) => compareVersions(currentVersion, '<', liveVersion)),
  );

export const getUpdateAvailableCount$ = (
  store$: Store<StoreModel>,
  platform: Platform,
): Observable<number> => showUpdateAvailable$(store$, platform)
  .pipe(
    map((available) => available ? 1 : 0),
  );
