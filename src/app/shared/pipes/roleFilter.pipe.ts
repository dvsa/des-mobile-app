import { Pipe, PipeTransform } from '@angular/core';
import { Page } from '@app/app.component';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { isAnyOf } from '@shared/helpers/simplifiers';

@Pipe({
	name: 'roleFilter',
})
export class RoleFilterPipe implements PipeTransform {
	constructor(private appConfigProvider: AppConfigProvider) {}

	transform(pages: Page[]): Page[] {
		const role = this.appConfigProvider.getAppConfig()?.role;
		if (!role) {
			return pages;
		}

		return pages.filter((page) => !isAnyOf(role, page.hideWhenRole || []));
	}
}
