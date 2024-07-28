import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DELEGATED_REKEY_SEARCH_PAGE, REKEY_SEARCH_PAGE } from '@pages/page-names.constants';

@Injectable()
export class NavigationStateProvider {
	constructor(private router: Router) {}

	public isRekeySearch(): boolean {
		return this.router.url.indexOf(REKEY_SEARCH_PAGE) >= 0;
	}

	public isDelegatedExaminerRekeySearch(): boolean {
		return this.router.url.indexOf(DELEGATED_REKEY_SEARCH_PAGE) >= 0;
	}
}
