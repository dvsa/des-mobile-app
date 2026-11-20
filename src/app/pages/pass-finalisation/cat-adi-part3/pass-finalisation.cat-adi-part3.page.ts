import { NgClass } from '@angular/common';
import { Component, OnInit, Signal, computed, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { DebriefWitnessedComponent } from '@components/test-finalisation/debrief-witnessed/debrief-witnessed';
import { FinalisationHeaderComponent } from '@components/test-finalisation/finalisation-header/finalisation-header';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import {
  IonButton,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonRow,
  IonText,
  IonToolbar,
} from '@ionic/angular';
import { behaviourMap } from '@pages/office/office-behaviour-map.cat-adi-part3';
import { TestFlowPageNames } from '@pages/page-names.constants';
import {
  PassFinalisationReportActivityCode,
  PassFinalisationValidationError,
  PassFinalisationViewDidEnter,
} from '@pages/pass-finalisation/pass-finalisation.actions';
import { PassFinalisationPageComponent } from '@shared/classes/test-flow-base-pages/pass-finalisation/pass-finalisation-base-page';
import { DateTime, Duration } from '@shared/helpers/date-time';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import { getCandidatePrn } from '@store/tests/journal-data/common/candidate/candidate.selector';
import { EndTimeChanged } from '@store/tests/test-data/cat-adi-part3/end-time/end-time.actions';
import { getTestEndTime } from '@store/tests/test-data/cat-adi-part3/end-time/end-time.selector';
import {
  ReasonForNoAdviceGivenChanged,
  SeekFurtherDevelopmentChanged,
} from '@store/tests/test-data/cat-adi-part3/review/review.actions';
import { getReview } from '@store/tests/test-data/cat-adi-part3/review/review.reducer';
import {
  getFurtherDevelopment,
  getGrade,
  getReasonForNoAdviceGiven,
} from '@store/tests/test-data/cat-adi-part3/review/review.selector';
import { StartTimeChanged } from '@store/tests/test-data/cat-adi-part3/start-time/start-time.actions';
import { getTestStartTime } from '@store/tests/test-data/cat-adi-part3/start-time/start-time.selector';
import { getTestData } from '@store/tests/test-data/cat-adi-part3/test-data.cat-adi-part3.reducer';
import { PersistTests } from '@store/tests/tests.actions';
import { getJournalData } from '@store/tests/tests.selector';
import { FurtherDevelopmentComponent } from './components/further-development/further-development.component';
import { ReasonGivenComponent } from './components/reason-given/reason-given.component';
import { TestStartEndTimesComponent } from './components/test-start-end-times/test-start-end-times';

@Component({
  selector: 'pass-finalisation.cat-adi-part3.page',
  templateUrl: './pass-finalisation.cat-adi-part3.page.html',
  styleUrls: ['./../pass-finalisation.page.scss', './pass-finalisation.cat-adi-part3.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    NgClass,
    TestFlowHeaderComponent,
    IonContent,
    FormsModule,
    ReactiveFormsModule,
    IonGrid,
    FinalisationHeaderComponent,
    DebriefWitnessedComponent,
    FurtherDevelopmentComponent,
    ReasonGivenComponent,
    TestStartEndTimesComponent,
    IonFooter,
    IonRow,
    IonCol,
    IonButton,
    IonText,
  ],
})
export class PassFinalisationCatADIPart3Page extends PassFinalisationPageComponent implements OnInit {
  form: UntypedFormGroup;
  private adi3TestData = computed(() => {
    const test = this.currentTest();
    return test ? getTestData(test as never) : null;
  });
  private review = computed(() => {
    const testData = this.adi3TestData();
    return testData ? getReview(testData as never) : null;
  });
  furtherDevelopment: Signal<boolean> = computed(() => {
    const review = this.review();
    return review ? getFurtherDevelopment(review) : null;
  });
  testStartTime: Signal<string | undefined> = computed(() => {
    const test = this.currentTest();
    if (!test || test.category !== TestCategory.SC) return undefined;
    const testData = this.adi3TestData();
    return (testData ? getTestStartTime(testData as never) : null) || new DateTime().toISOString();
  });
  testEndTime: Signal<string | undefined> = computed(() => {
    const test = this.currentTest();
    if (!test || test.category !== TestCategory.SC) return undefined;
    const testData = this.adi3TestData();
    return (
      (testData ? getTestEndTime(testData as never) : null) || new DateTime().add(45, Duration.MINUTE).toISOString()
    );
  });
  scStartTime = signal<string | undefined>(undefined);
  scEndTime = signal<string | undefined>(undefined);
  adviceReason = computed(() => {
    const review = this.review();
    return review ? getReasonForNoAdviceGiven(review) : null;
  });
  testOutcomeGrade = computed(() => {
    const review = this.review();
    return review ? getGrade(review) : null;
  });
  prn = computed(() => {
    const test = this.currentTest();
    if (!test) return null;
    const candidate = getCandidate(getJournalData(test as never) as never);
    return candidate ? getCandidatePrn(candidate as never) : null;
  });
  isStandardsCheck = computed(() => this.currentTest()?.category === TestCategory.SC);

  constructor() {
    super();
    this.form = new UntypedFormGroup({});
    this.outcomeBehaviourProvider.setBehaviourMap(behaviourMap);
  }

  ngOnInit(): void {
    super.onInitialisation();
  }

  ionViewWillEnter(): boolean {
    super.ionViewWillEnter();
    this.store$.dispatch(PassFinalisationViewDidEnter());
    return true;
  }

  furtherDevelopmentChanged(furtherDevelopment: boolean) {
    this.store$.dispatch(SeekFurtherDevelopmentChanged(furtherDevelopment));
  }

  adviceReasonChanged(adviceReason: string) {
    this.store$.dispatch(ReasonForNoAdviceGivenChanged(adviceReason));
  }

  testStartTimeChanged(startTime: string): void {
    this.scStartTime.set(startTime);
    this.store$.dispatch(StartTimeChanged(startTime));
  }

  testEndTimeChanged(endTime: string): void {
    this.scEndTime.set(endTime);
    this.store$.dispatch(EndTimeChanged(endTime));
  }

  async onSubmit(): Promise<void> {
    Object.keys(this.form.controls).forEach((controlName) => this.form.controls[controlName].markAsDirty());

    this.form.updateValueAndValidity();

    if (this.form.valid) {
      if (this.furtherDevelopment()) {
        this.adviceReasonChanged(null);
      }

      this.testStartTimeChanged(this.scStartTime() ?? (this.testStartTime() as string));
      this.testEndTimeChanged(this.scEndTime() ?? (this.testEndTime() as string));

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
