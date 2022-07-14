import { Component, Input } from '@angular/core';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';

@Component({
  selector: 'lesson-and-theme',
  templateUrl: 'lesson-and-theme.html',
  styleUrls: ['lesson-and-theme.scss'],
})
export class LessonAndThemeComponent {
  @Input()
  lessonAndThemeState: {
    valid: boolean,
    score: number,
  };

  constructor(
    private routeByCategory: RouteByCategoryProvider,
  ) {
  }

  navigateToPage = async (page: 'lessonTheme' | 'testReport') => {
    await this.routeByCategory.navigateToPage(
      TestFlowPageNames.TEST_REPORT_PAGE,
      TestCategory.ADI3,
      { state: { page } },
    );
  };

}
