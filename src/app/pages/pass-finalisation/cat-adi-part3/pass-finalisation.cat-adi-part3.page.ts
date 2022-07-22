import { Component, OnInit } from '@angular/core';
import {
  CommonPassFinalisationPageState, PassFinalisationPageComponent,
} from '@shared/classes/test-flow-base-pages/pass-finalisation/pass-finalisation-base-page';
import { FormGroup } from '@angular/forms';
import { Platform } from '@ionic/angular';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import {
  PassFinalisationReportActivityCode, PassFinalisationValidationError,
  PassFinalisationViewDidEnter,
} from '@pages/pass-finalisation/pass-finalisation.actions';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import {
  getFurtherDevelopment,
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
import { TestResultProvider } from '@providers/test-result/test-result';
import { map, switchMap } from 'rxjs/operators';

interface CatAdi3PassFinalisationPageState {
  furtherDevelopment$: Observable<boolean>;
  adviceReason$: Observable<string>;
  testOutcomeGrade$: Observable<string>;
}

type PassFinalisationPageState = CommonPassFinalisationPageState & CatAdi3PassFinalisationPageState;

@Component({
  selector: 'pass-finalisation.cat-adi-part3.page',
  templateUrl: './pass-finalisation.cat-adi-part3.page.html',
  styleUrls: ['./../pass-finalisation.page.scss', './pass-finalisation.cat-adi-part3.page.scss'],
})
export class PassFinalisationCatADIPart3Page extends PassFinalisationPageComponent implements OnInit {

  form: FormGroup;
  merged$: Observable<boolean>;
  pageState: PassFinalisationPageState;
  subscription: Subscription;
  furtherDevelopment: boolean;

  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    public routeByCat: RouteByCategoryProvider,
    private outcomeBehaviourProvider: OutcomeBehaviourMapProvider,
    private testResultProvider: TestResultProvider,
  ) {
    super(platform, authenticationProvider, router, store$);
    this.form = new FormGroup({});
    this.outcomeBehaviourProvider.setBehaviourMap(behaviourMap);
  }

  ngOnInit(): void {
    super.onInitialisation();

    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

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
        switchMap((data) => this.testResultProvider.calculateTestResultADI3(data)),
        map(({ grade }) => grade || null),
      ),
    };

    const { furtherDevelopment$ } = this.pageState;

    this.merged$ = merge(
      furtherDevelopment$.pipe(map((value) => this.furtherDevelopment = value)),
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

  async onSubmit(): Promise<void> {
    Object.keys(this.form.controls).forEach((controlName) => this.form.controls[controlName].markAsDirty());

    this.form.updateValueAndValidity();

    if (this.form.valid) {
      if (this.furtherDevelopment) {
        this.adviceReasonChanged(null);
      }
      this.store$.dispatch(PersistTests());
      this.store$.dispatch(PassFinalisationReportActivityCode(this.testOutcome));
      await this.routeByCat.navigateToPage(TestFlowPageNames.CONFIRM_TEST_DETAILS_PAGE);
      return;
    }

    Object.keys(this.form.controls).forEach((controlName) => {
      if (this.form.controls[controlName].invalid) {
        this.store$.dispatch(PassFinalisationValidationError(`${controlName} is blank`));
      }
    });
  }

}
