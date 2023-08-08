import { Component, inject, OnInit } from '@angular/core';
import {
  CommonWaitingRoomToCarPageState,
  WaitingRoomToCarBasePageComponent,
} from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { UntypedFormGroup } from '@angular/forms';
import { select } from '@ngrx/store';
import { merge, Observable } from 'rxjs';
import { CombinationCodes, Configuration, Question, Question5 } from '@dvsa/mes-test-schema/categories/CPC';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getDelegatedTestIndicator } from '@store/tests/delegated-test/delegated-test.reducer';
import { isDelegatedTest } from '@store/tests/delegated-test/delegated-test.selector';
import { getPreTestDeclarations } from '@store/tests/pre-test-declarations/pre-test-declarations.reducer';
import {
  getCandidateDeclarationSignedStatus,
  getInsuranceDeclarationStatus,
  getResidencyDeclarationStatus,
} from '@store/tests/pre-test-declarations/pre-test-declarations.selector';
import { getTestData } from '@store/tests/test-data/cat-cpc/test-data.cat-cpc.reducer';
import { map, take } from 'rxjs/operators';
import { getCombination } from '@store/tests/test-data/cat-cpc/test-data.cat-cpc.selector';
import { getVehicleDetails } from '@store/tests/vehicle-details/cat-cpc/vehicle-details.cat-cpc.reducer';
import { getVehicleConfiguration } from '@store/tests/vehicle-details/cat-cpc/vehicle-details.cat-cpc.selector';
import { PopulateVehicleConfiguration } from '@store/tests/vehicle-details/vehicle-details.actions';
import { PopulateTestScore } from '@store/tests/test-data/cat-cpc/overall-score/total-percentage.action';
import { PopulateCombination } from '@store/tests/test-data/cat-cpc/combination/combination.action';
import { PopulateQuestions } from '@store/tests/test-data/cat-cpc/questions/questions.action';
import { CPCQuestionProvider } from '@providers/cpc-questions/cpc-questions';
import { Combination } from '@shared/constants/cpc-questions/cpc-question-combinations.constants';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { WaitingRoomToCarValidationError } from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import { ClearCandidateLicenceData } from '@pages/candidate-licence/candidate-licence.actions';

interface CatCWaitingRoomToCarPageState {
  delegatedTest$: Observable<boolean>;
  candidateDeclarationSigned$: Observable<boolean>;
  insuranceDeclarationAccepted$: Observable<boolean>;
  residencyDeclarationAccepted$: Observable<boolean>;
  combinations$: Observable<Combination[]>;
  combination$: Observable<CombinationCodes>;
  configuration$: Observable<Configuration>;
}

type WaitingRoomToCarPageState = CommonWaitingRoomToCarPageState & CatCWaitingRoomToCarPageState;

@Component({
  selector: 'app-waiting-room-to-car-cat-cpc',
  templateUrl: './waiting-room-to-car.cat-cpc.page.html',
  styleUrls: ['./waiting-room-to-car.cat-cpc.page.scss'],
})
export class WaitingRoomToCarCatCPCPage extends WaitingRoomToCarBasePageComponent implements OnInit {
  private cpcQuestionProvider = inject(CPCQuestionProvider);

  form: UntypedFormGroup;
  pageState: WaitingRoomToCarPageState;
  isDelegated: boolean = false;

  constructor() {
    super();
    this.form = new UntypedFormGroup({});
  }

  ngOnInit(): void {
    super.onInitialisation();

    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    this.pageState = {
      ...this.commonPageState,
      delegatedTest$: currentTest$.pipe(
        select(getDelegatedTestIndicator),
        select(isDelegatedTest),
      ),
      insuranceDeclarationAccepted$: currentTest$.pipe(
        select(getPreTestDeclarations),
        select(getInsuranceDeclarationStatus),
      ),
      residencyDeclarationAccepted$: currentTest$.pipe(
        select(getPreTestDeclarations),
        select(getResidencyDeclarationStatus),
      ),
      candidateDeclarationSigned$: currentTest$.pipe(
        select(getPreTestDeclarations),
        select(getCandidateDeclarationSignedStatus),
      ),
      combinations$: currentTest$.pipe(
        select(getTestCategory),
        take(1),
        map((category) => this.cpcQuestionProvider.getCombinations(category as TestCategory)),
      ),
      combination$: currentTest$.pipe(
        select(getTestData),
        select(getCombination),
      ),
      configuration$: currentTest$.pipe(
        select(getVehicleDetails),
        select(getVehicleConfiguration),
      ),
    };
    this.setupSubscription();
  }

  ionViewDidLeave(): void {
    super.ionViewDidLeave();
    this.subscription?.unsubscribe();
  }

  setupSubscription(): void {
    const { delegatedTest$ } = this.pageState;

    this.subscription = merge(
      delegatedTest$.pipe(map((result) => this.isDelegated = result)),
    )
      .subscribe();
  }

  onSubmit = async (): Promise<void> => {
    Object.keys(this.form.controls)
      .forEach((controlName: string) => this.form.controls[controlName].markAsDirty());

    if (this.form.valid) {
      this.store$.dispatch(ClearCandidateLicenceData());

      await this.routeByCategoryProvider.navigateToPage(
        TestFlowPageNames.TEST_REPORT_PAGE,
        this.testCategory,
        { replaceUrl: !this.isDelegated },
      );
      return;
    }

    Object.keys(this.form.controls)
      .forEach((controlName: string) => {
        if (this.form.controls[controlName].invalid) {
          this.store$.dispatch(WaitingRoomToCarValidationError(`${controlName} is blank`));
        }
      });
  };

  vehicleConfiguration(configuration: Configuration): void {
    this.store$.dispatch(PopulateVehicleConfiguration(configuration));
  }

  combinationSelected(combination: CombinationCodes): void {
    const questions: Question[] = this.cpcQuestionProvider.getQuestionsBank(combination);
    const question5: Question5 = this.cpcQuestionProvider.getQuestion5ByVehicleType(combination);

    this.store$.dispatch(PopulateCombination(combination));
    this.store$.dispatch(PopulateQuestions([...questions, question5]));

    // reset total score
    this.store$.dispatch(PopulateTestScore(0));
  }

  showVehicleDetails = (): boolean => this.testCategory === TestCategory.CCPC;
}
