import { Store } from '@ngrx/store';
import {
  selectIsEndToEndPracticeTest,
  selectIsPracticeMode,
  selectIsTestReportPracticeTest,
} from '@store/tests/tests.selector';
import { inject, Inject } from '@angular/core';
import { FAKE_JOURNAL_PAGE } from '@pages/page-names.constants';
import { StoreModel } from '../models/store.model';
import { BasePageComponent } from './base-page';

export abstract class PracticeableBasePageComponent extends BasePageComponent {
  public store$ = inject<Store<StoreModel>>(Store);

  public isPracticeMode: boolean = this.store$.selectSignal(selectIsPracticeMode)();
  public isEndToEndPracticeMode: boolean = this.store$.selectSignal(selectIsEndToEndPracticeTest)();
  public isTestReportPracticeMode: boolean = this.store$.selectSignal(selectIsTestReportPracticeTest)();

  protected constructor(@Inject(true) public loginRequired: boolean = true) {
    super(loginRequired);
  }

  exitPracticeMode = async () => {
    await this.router.navigate([FAKE_JOURNAL_PAGE]);
  };

}
