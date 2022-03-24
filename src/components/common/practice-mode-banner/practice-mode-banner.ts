import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

import { DASHBOARD_PAGE } from '@pages/page-names.constants';
import { CategoryWhitelistProvider } from '@providers/category-whitelist/category-whitelist';
import { StoreModel } from '@shared/models/store.model';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getTestCategory } from '@store/tests/category/category.reducer';

enum DisplayMessage {
  PRACTICE = 'You\'re in practice mode',
  PREVIEW = 'This is a preview of a category not yet available in DES 4',
}

@Component({
  selector: 'practice-mode-banner',
  templateUrl: 'practice-mode-banner.html',
  styleUrls: ['practice-mode-banner.scss'],
})
export class PracticeModeBanner implements OnInit {

  @Input()
  practiceJournal: boolean = false;

  public displayMsg$: Observable<string>;

  constructor(
    public router: Router,
    private categoryWhitelistProvider: CategoryWhitelistProvider,
    private store$: Store<StoreModel>,
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
        (this.practiceJournal || this.categoryWhitelistProvider.isWhiteListed(category as TestCategory))
          ? DisplayMessage.PRACTICE
          : DisplayMessage.PREVIEW),
    );
  }

  async exitPracticeMode(): Promise<void> {
    await this.router.navigate([DASHBOARD_PAGE], { replaceUrl: true });
  }
}
