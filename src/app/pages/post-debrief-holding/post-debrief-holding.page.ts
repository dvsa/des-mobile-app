import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { StoreModel } from '@shared/models/store.model';

@Component({
  selector: 'app-post-debrief-holding',
  templateUrl: './post-debrief-holding.page.html',
  styleUrls: ['./post-debrief-holding.page.scss'],
})
export class PostDebriefHoldingPage extends PracticeableBasePageComponent {

  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    public routeByCat: RouteByCategoryProvider,
  ) {
    super(platform, authenticationProvider, router, store$, false);
  }

  async continueButton(): Promise<void> {
    await this.routeByCat.navigateToPage(TestFlowPageNames.NON_PASS_FINALISATION_PAGE);
  }

}
