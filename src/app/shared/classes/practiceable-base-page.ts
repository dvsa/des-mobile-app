import { Inject, Injectable, Injector, OnInit } from '@angular/core';
import { ViewDidLeave } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { FAKE_JOURNAL_PAGE } from '@pages/page-names.constants';
import { getDelegatedTestIndicator } from '@store/tests/delegated-test/delegated-test.reducer';
import { isDelegatedTest } from '@store/tests/delegated-test/delegated-test.selector';
import { getRekeyIndicator } from '@store/tests/rekey/rekey.reducer';
import { isRekey } from '@store/tests/rekey/rekey.selector';
import { getTests } from '@store/tests/tests.reducer';
import {
  getCurrentTest,
  isEndToEndPracticeTest,
  isPracticeMode,
  isTestReportPracticeTest,
} from '@store/tests/tests.selector';
import { SetHasExitedApp } from '@store/tests/user-exited-app/user-exited-app.actions';
import { Observable, Subscription, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { StoreModel } from '../models/store.model';
import { BasePageComponent } from './base-page';

interface PracticeableBasePageState {
  isPracticeMode$: Observable<boolean>;
  isTestReportPracticeMode$: Observable<boolean>;
  isEndToEndPracticeMode$: Observable<boolean>;
  isRekey$: Observable<boolean>;
  isDelegatedTest$: Observable<boolean>;
}

@Injectable()
export abstract class PracticeableBasePageComponent extends BasePageComponent implements OnInit, ViewDidLeave {
  public store$ = this.injector.get<Store<StoreModel>>(Store);

  public isPracticeMode: boolean;
  public isTestReportPracticeMode: boolean;
  public isEndToEndPracticeMode: boolean;
  public isExitSAMActivated = false;
  public isDelegatedTest: boolean;
  public isRekey = false;

  private practiceableBasePageState: PracticeableBasePageState;
  private practiceableBasePageSubscription: Subscription;

  protected constructor(
    injector: Injector,
    @Inject(true) public loginRequired = true
  ) {
    super(injector, loginRequired);
  }

  ngOnInit(): void {
    this.practiceableBasePageState = {
      isDelegatedTest$: this.store$.pipe(
        select(getTests),
        select(getCurrentTest),
        select(getDelegatedTestIndicator),
        select(isDelegatedTest)
      ),
      isRekey$: this.store$.pipe(select(getTests), select(getCurrentTest), select(getRekeyIndicator), select(isRekey)),
      isPracticeMode$: this.store$.pipe(select(getTests), select(isPracticeMode)),
      isTestReportPracticeMode$: this.store$.pipe(select(getTests), select(isTestReportPracticeTest)),
      isEndToEndPracticeMode$: this.store$.pipe(select(getTests), select(isEndToEndPracticeTest)),
    };

    const { isDelegatedTest$, isRekey$, isPracticeMode$, isTestReportPracticeMode$, isEndToEndPracticeMode$ } =
      this.practiceableBasePageState;

    const merged$ = merge(
      isDelegatedTest$.pipe(map((value) => (this.isDelegatedTest = value))),
      isRekey$.pipe(map((value) => (this.isRekey = value))),
      isPracticeMode$.pipe(map((value) => (this.isPracticeMode = value))),
      isTestReportPracticeMode$.pipe(map((value) => (this.isTestReportPracticeMode = value))),
      isEndToEndPracticeMode$.pipe(map((value) => (this.isEndToEndPracticeMode = value)))
    );

    this.practiceableBasePageSubscription = merged$.subscribe();
  }

  ionViewDidLeave(): void {
    if (this.practiceableBasePageSubscription) {
      this.practiceableBasePageSubscription.unsubscribe();
    }
  }

  isSamActivatedChanged(isActive: boolean): void {
    this.isExitSAMActivated = isActive;
  }

  onUsedExitSam(): void {
    this.store$.dispatch(SetHasExitedApp());
  }

  exitPracticeMode = async () => {
    await this.router.navigate([FAKE_JOURNAL_PAGE]);
  };
}
