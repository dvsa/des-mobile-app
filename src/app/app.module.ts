import { ActionReducer, MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

import { environment } from '@environments/environment';
import { EnvironmentFile } from '@environments/models/environment.model';

import { StoreModel } from '@shared/models/store.model';
import { get, set } from 'lodash-es';
import { RemoteDevToolsProxy } from '../../ngrx-devtool-proxy/remote-devtools-proxy';

export function localStorageSyncReducer(reducer: ActionReducer<StoreModel>): ActionReducer<StoreModel> {
  return localStorageSync({
    keys: ['appInfo', 'tests', 'appConfig', 'refData'],
    rehydrate: true,
  })(reducer);
}

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
