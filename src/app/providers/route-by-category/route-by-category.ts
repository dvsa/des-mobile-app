import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { PageNameKeys, getPageNameByCategoryAndKey } from '@pages/page-names.constants';

@Injectable()
export class RouteByCategoryProvider {
	constructor(private router: Router) {}

	async navigateToPage(page: PageNameKeys, category?: TestCategory, navExtras: NavigationExtras = {}): Promise<void> {
		const categoryPage: string = category ? getPageNameByCategoryAndKey(category, page) : page;
		await this.router.navigate([categoryPage], navExtras);
	}

	getNextPage(page: PageNameKeys, category?: TestCategory): string {
		return category ? getPageNameByCategoryAndKey(category, page) : page;
	}
}
