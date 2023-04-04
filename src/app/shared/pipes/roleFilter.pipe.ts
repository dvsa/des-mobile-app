import { Pipe, PipeTransform } from '@angular/core';
import { Pages } from '@app/app.component';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { AppConfigProvider } from '@providers/app-config/app-config';

@Pipe({
  name: 'roleFilter',
})
export class RoleFilterPipe implements PipeTransform {

  constructor(private appConfigProvider: AppConfigProvider) {
  }

  transform(pages: Pages[]): Pages[] {
    const role = this.appConfigProvider.getAppConfig()?.role;
    if (!role) {
      return pages;
    }

    return pages.filter(
      (page) => !isAnyOf(role, (page.hideWhenRole || [])),
    );
  }
}
