import { Inject, Injectable, OnInit, inject } from '@angular/core';
import { ViewDidLeave } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { FAKE_JOURNAL_PAGE } from '@pages/page-names.constants';
import {
  selectIsDelegated,
  selectIsEndToEndPracticeTest,
  selectIsPracticeMode,
  selectIsRekey,
  selectIsTestReportPracticeTest,
} from '@store/tests/tests.selector';
import { StoreModel } from '../models/store.model';
import { BasePageComponent } from './base-page';

@Injectable()
export abstract class PracticeableBasePageComponent extends BasePageComponent implements OnInit, ViewDidLeave {
  public store$ = inject<Store<StoreModel>>(Store);

  public isPracticeMode: boolean = this.store$.selectSignal(selectIsPracticeMode)();
  public isEndToEndPracticeMode: boolean = this.store$.selectSignal(selectIsEndToEndPracticeTest)();
  public isTestReportPracticeMode: boolean = this.store$.selectSignal(selectIsTestReportPracticeTest)();
  public isRekey: boolean = this.store$.selectSignal(selectIsRekey)();
  public isDelegated: boolean = this.store$.selectSignal(selectIsDelegated)();

  protected constructor(@Inject(true) public loginRequired = true) {
    super(loginRequired);
  }

  ngOnInit() {}

  exitPracticeMode = async () => {
    await this.router.navigate([FAKE_JOURNAL_PAGE]);
  };
}
