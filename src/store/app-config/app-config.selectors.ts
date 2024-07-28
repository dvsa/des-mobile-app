import { Platform } from '@ionic/angular';
import { Store, createSelector } from '@ngrx/store';
import { AppConfig } from '@providers/app-config/app-config.model';
import { compareVersions } from '@shared/helpers/compare-versions';
import { StoreModel } from '@shared/models/store.model';
import { selectVersionNumber } from '@store/app-info/app-info.selectors';
import { Observable } from 'rxjs';
import { filter, map, withLatestFrom } from 'rxjs/operators';

export const selectAppConfig = (state: StoreModel): AppConfig => state.appConfig;

export const selectRole = createSelector(selectAppConfig, (appConfig: AppConfig): string => appConfig.role);

export const selectLogoutEnabled = createSelector(
	selectAppConfig,
	(appConfig: AppConfig): boolean => appConfig.journal?.enableLogoutButton
);

export const selectLiveAppVersion = createSelector(
	selectAppConfig,
	(appConfig: AppConfig): string => appConfig.liveAppVersion
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
