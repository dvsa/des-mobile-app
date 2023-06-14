import { Component, OnInit } from '@angular/core';
import {
  CommonPassFinalisationPageState,
  PassFinalisationPageComponent,
} from '@shared/classes/test-flow-base-pages/pass-finalisation/pass-finalisation-base-page';
import { UntypedFormGroup } from '@angular/forms';
import { Platform } from '@ionic/angular';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import {
  PassFinalisationReportActivityCode,
  PassFinalisationValidationError,
  PassFinalisationViewDidEnter,
} from '@pages/pass-finalisation/pass-finalisation.actions';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getJournalData } from '@store/tests/tests.selector';
import {
  getFurtherDevelopment,
  getGrade,
  getReasonForNoAdviceGiven,
} from '@store/tests/test-data/cat-adi-part3/review/review.selector';
import { getTestData } from '@store/tests/test-data/cat-adi-part3/test-data.cat-adi-part3.reducer';
import { merge, Observable, Subscription } from 'rxjs';
import {
  ReasonForNoAdviceGivenChanged,
  SeekFurtherDevelopmentChanged,
} from '@store/tests/test-data/cat-adi-part3/review/review.actions';
import { getReview } from '@store/tests/test-data/cat-adi-part3/review/review.reducer';
import { PersistTests } from '@store/tests/tests.actions';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { behaviourMap } from '@pages/office/office-behaviour-map.cat-adi-part3';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import { getCandidatePrn } from '@store/tests/journal-data/common/candidate/candidate.selector';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { StartTimeChanged } from '@store/tests/test-data/cat-adi-part3/start-time/start-time.actions';
import { EndTimeChanged } from '@store/tests/test-data/cat-adi-part3/end-time/end-time.actions';
import { getTestEndTime } from '@store/tests/test-data/cat-adi-part3/end-time/end-time.selector';
import { getTestStartTime } from '@store/tests/test-data/cat-adi-part3/start-time/start-time.selector';
import * as moment from 'moment';

interface CatAdi3PassFinalisationPageState {
  furtherDevelopment$: Observable<boolean>;
  adviceReason$: Observable<string>;
  testOutcomeGrade$: Observable<string>;
  prn$: Observable<number>;
  isStandardsCheck$: Observable<boolean>;
  testStartTime$: Observable<string>;
  testEndTime$: Observable<string>;
}

type PassFinalisationPageState = CommonPassFinalisationPageState & CatAdi3PassFinalisationPageState;

@Component({
  selector: 'pass-finalisation.cat-adi-part3.page',
  templateUrl: './pass-finalisation.cat-adi-part3.page.html',
  styleUrls: ['./../pass-finalisation.page.scss', './pass-finalisation.cat-adi-part3.page.scss'],
})
export class PassFinalisationCatADIPart3Page extends PassFinalisationPageComponent implements OnInit {

  form: UntypedFormGroup;
  merged$: Observable<boolean | string>;
  pageState: PassFinalisationPageState;
  subscription: Subscription;
  furtherDevelopment: boolean;
  scStartTime: string;
  scEndTime: string;

  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    public routeByCat: RouteByCategoryProvider,
    private outcomeBehaviourProvider: OutcomeBehaviourMapProvider,
  ) {
    super(platform, authenticationProvider, router, store$);
    this.form = new UntypedFormGroup({});
    this.outcomeBehaviourProvider.setBehaviourMap(behaviourMap);
  }

  ngOnInit(): void {
    super.onInitialisation();

    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    const category$ = currentTest$.pipe(select(getTestCategory));

    this.pageState = {
      ...this.commonPageState,
      furtherDevelopment$: currentTest$.pipe(
        select(getTestData),
        select(getReview),
        select(getFurtherDevelopment),
      ),
      adviceReason$: currentTest$.pipe(
        select(getTestData),
        select(getReview),
        select(getReasonForNoAdviceGiven),
      ),
      testOutcomeGrade$: currentTest$.pipe(
        select(getTestData),
        select(getReview),
        select(getGrade),
      ),
      prn$: currentTest$.pipe(
        select(getJournalData),
        select(getCandidate),
        select(getCandidatePrn),
      ),
      isStandardsCheck$: currentTest$.pipe(
        select(getTestCategory),
        map((category) => isAnyOf(category, [TestCategory.SC])),
      ),
      testStartTime$: currentTest$.pipe(
        withLatestFrom(category$),
        filter(([, category]) => category === TestCategory.SC),
        map(([testResult]) => testResult),
        select(getTestData),
        select(getTestStartTime),
        map((time: string) => time || moment()
          .toISOString()),
      ),
      testEndTime$: currentTest$.pipe(
        withLatestFrom(category$),
        filter(([, category]) => category === TestCategory.SC),
        map(([testResult]) => testResult),
        select(getTestData),
        select(getTestEndTime),
        map((time: string) => time || moment()
          .add(1, 'hour')
          .toISOString()),
      ),
    };

    const {
      furtherDevelopment$,
      testStartTime$,
      testEndTime$,
    } = this.pageState;

    this.merged$ = merge(
      furtherDevelopment$.pipe(map((value) => this.furtherDevelopment = value)),
      testStartTime$.pipe(map((value) => this.scStartTime = value)),
      testEndTime$.pipe(map((value) => this.scEndTime = value)),
    );
    this.subscription = this.merged$.subscribe();
  }

  ionViewWillEnter(): boolean {
    super.ionViewWillEnter();
    this.store$.dispatch(PassFinalisationViewDidEnter());
    return true;
  }

  ionViewDidLeave(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  furtherDevelopmentChanged(furtherDevelopment: boolean) {
    this.store$.dispatch(SeekFurtherDevelopmentChanged(furtherDevelopment));
  }

  adviceReasonChanged(adviceReason: string) {
    this.store$.dispatch(ReasonForNoAdviceGivenChanged(adviceReason));
  }

  testStartTimeChanged(startTime: string): void {
    this.scStartTime = startTime;
    this.store$.dispatch(StartTimeChanged(startTime));
  }

  testEndTimeChanged(endTime: string): void {
    this.scEndTime = endTime;
    this.store$.dispatch(EndTimeChanged(endTime));
  }

  async onSubmit(): Promise<void> {
    Object.keys(this.form.controls)
      .forEach((controlName) => this.form.controls[controlName].markAsDirty());

    this.form.updateValueAndValidity();

    if (this.form.valid) {
      if (this.furtherDevelopment) {
        this.adviceReasonChanged(null);
      }

      this.testStartTimeChanged(this.scStartTime);
      this.testEndTimeChanged(this.scEndTime);

      this.store$.dispatch(PersistTests());
      this.store$.dispatch(PassFinalisationReportActivityCode(this.testOutcome));

      await this.routeByCat.navigateToPage(TestFlowPageNames.CONFIRM_TEST_DETAILS_PAGE);
      return;
    }

    Object.keys(this.form.controls)
      .forEach((controlName) => {
        if (this.form.controls[controlName].invalid) {
          this.store$.dispatch(PassFinalisationValidationError(`${controlName} is blank`));
        }
      });
  }

}
