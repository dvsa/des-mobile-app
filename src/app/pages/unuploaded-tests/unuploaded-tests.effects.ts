import { Injectable } from '@angular/core';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { SearchProvider } from '@providers/search/search';

@Injectable()
export class UnuploadedTestsEffects {
	constructor(
		public networkStateProvider: NetworkStateProvider,
		public searchProvider: SearchProvider,
		public appConfigProvider: AppConfigProvider
	) {}
}
