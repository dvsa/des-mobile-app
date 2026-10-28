import { Drivers } from '@ionic/storage';
import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

import { environment } from '@environments/environment';
import { EnvironmentFile } from '@environments/models/environment.model';

import { Capacitor } from '@capacitor/core';
import { delegatedSearchReducer } from '@pages/delegated-rekey-search/delegated-rekey-search.reducer';
import { rekeySearchReducer } from '@pages/rekey-search/rekey-search.reducer';
import { StoreModel } from '@shared/models/store.model';
import { appConfigReducer } from '@store/app-config/app-config.reducer';
import { appInfoReducer } from '@store/app-info/app-info.reducer';
import { examinerRecordsReducer } from '@store/examiner-records/examiner-records.reducer';
import { journalReducer } from '@store/journal/journal.reducer';
import { testsReducer } from '@store/tests/tests.reducer';
import CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { get, set } from 'lodash-es';
import { RemoteDevToolsProxy } from '../../ngrx-devtool-proxy/remote-devtools-proxy';

export function localStorageSyncReducer(reducer: ActionReducer<StoreModel>): ActionReducer<StoreModel> {
  return localStorageSync({
    keys: ['appInfo', 'tests', 'appConfig', 'refData'],
    rehydrate: true,
  })(reducer);
}

const reducers: ActionReducerMap<unknown> = {
  journal: journalReducer,
  appInfo: appInfoReducer,
  appConfig: appConfigReducer,
  tests: testsReducer,
  rekeySearch: rekeySearchReducer,
  delegatedRekeySearch: delegatedSearchReducer,
  examinerRecords: examinerRecordsReducer,
};

const metaReducers: MetaReducer<unknown>[] = [];
const enableDevTools = environment && (environment as EnvironmentFile).enableDevTools;
const enableRehydrationPlugin = environment && (environment as EnvironmentFile).enableRehydrationPlugin;

// Register our remote devtools if we're on-device and not in a browser and dev tools enabled
if (!get(window, 'devToolsExtension') && !get(window, '__REDUX_DEVTOOLS_EXTENSION__') && enableDevTools) {
  const remoteDevToolsProxy = new RemoteDevToolsProxy({
    connectTimeout: 300000, // extend for pauses during debugging
    ackTimeout: 120000, // extend for pauses during debugging
    secure: false, // dev only
  });

  // support both the legacy and new keys, for now
  set(window, 'devToolsExtension', remoteDevToolsProxy);
  set(window, '__REDUX_DEVTOOLS_EXTENSION__', remoteDevToolsProxy);
}

if (enableRehydrationPlugin) {
  metaReducers.push(localStorageSyncReducer);
}

const storageDriver = Capacitor.getPlatform() === 'web' ? Drivers.IndexedDB : CordovaSQLiteDriver._driver;
