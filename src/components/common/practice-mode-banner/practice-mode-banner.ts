import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { DASHBOARD_PAGE } from '@pages/page-names.constants';
import { CategoryWhitelistProvider } from '@providers/category-whitelist/category-whitelist';
import { trDestroy$ } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { wrtcDestroy$ } from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { StoreModel } from '@shared/models/store.model';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';

enum DisplayMessage {
  PRACTICE = "Practice mode",
  PREVIEW = 'This is a preview of a category not yet available in DES',
}

@Component({
  selector: 'practice-mode-banner',
  templateUrl: 'practice-mode-banner.html',
  styleUrls: ['practice-mode-banner.scss'],
})
export class PracticeModeBanner implements OnInit {
  @Input()
  practiceJournal = false;

  public displayMsg$: Observable<string>;

  constructor(
    public router: Router,
    private categoryWhitelistProvider: CategoryWhitelistProvider,
    private store$: Store<StoreModel>
  ) {}

  ngOnInit(): void {
    this.displayMsg$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
      // we are using getCurrentTest outside the test flow, so if there are no test in the state, then default to empty
      map((test) => test ?? {}),
      select(getTestCategory),
      take(1),
      map((category) =>
        this.practiceJournal || this.categoryWhitelistProvider.isWhiteListed(category as TestCategory)
          ? DisplayMessage.PRACTICE
          : DisplayMessage.PREVIEW
      )
    );
  }

  async exitPracticeMode(): Promise<void> {
    this.destroyTestSubs();
    await this.router.navigate([DASHBOARD_PAGE], { replaceUrl: true });
  }

  private destroyTestSubs = (): void => {
    // As you can exit at any time from a practice test using the exit button, you might not get to the parts of the
    // code in which typically shut down the subs.

    // Waiting room to car
    wrtcDestroy$.next(null);
    wrtcDestroy$.complete();
    // Test report
    trDestroy$.next(null);
    trDestroy$.complete();
  };
}
