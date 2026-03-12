import { Component, OnInit } from '@angular/core';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';

@Component({
  selector: 'app-post-debrief-holding',
  templateUrl: './post-debrief-holding.page.html',
  styleUrls: ['./post-debrief-holding.page.scss'],
  standalone: false,
})
export class PostDebriefHoldingPage extends PracticeableBasePageComponent implements OnInit {
  constructor() {
    super(false);
  }

  async continueButton(): Promise<void> {
    await this.router.navigate([TestFlowPageNames.NON_PASS_FINALISATION_PAGE]);
  }
}
