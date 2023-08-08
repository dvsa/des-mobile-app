import { Component, inject } from '@angular/core';

import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';

@Component({
  selector: 'app-post-debrief-holding',
  templateUrl: './post-debrief-holding.page.html',
  styleUrls: ['./post-debrief-holding.page.scss'],
})
export class PostDebriefHoldingPage extends PracticeableBasePageComponent {
  public routeByCat = inject(RouteByCategoryProvider);

  constructor() {
    super();
  }

  async continueButton(): Promise<void> {
    await this.routeByCat.navigateToPage(TestFlowPageNames.NON_PASS_FINALISATION_PAGE);
  }

}
