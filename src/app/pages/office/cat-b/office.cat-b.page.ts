import {
  NavController,
  Platform,
  ToastController,
  AlertController,
  ModalController,
} from '@ionic/angular';
import { Component } from '@angular/core';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { Store, select } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { getTests } from '@store/tests/tests.reducer';
import { Observable } from 'rxjs';
import {
  getCurrentTest,
  getTestOutcome,
} from '@store/tests/tests.selector';
import { map, withLatestFrom } from 'rxjs/operators';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { QuestionProvider } from '@providers/question/question';
import {
  getETA,
  getETAFaultText,
  getEco,
  getEcoFaultText,
  getShowMeQuestionOptions,
} from '@store/tests/test-data/common/test-data.selector';
import {
  getVehicleChecks,
  getSelectedTellMeQuestionText,
  getShowMeQuestion,
  getTellMeQuestion,
} from '@store/tests/test-data/cat-b/test-data.cat-b.selector';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import { WeatherConditionProvider } from '@providers/weather-conditions/weather-condition';
import { CommentSource, FaultSummary } from '@shared/models/fault-marking.model';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { ActivityCodeModel } from '@shared/constants/activity-code/activity-code.constants';
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { Router } from '@angular/router';
import { OfficeBasePageComponent } from '@shared/classes/test-flow-base-pages/office/office-base-page';
import { AddDangerousFaultComment } from '@store/tests/test-data/common/dangerous-faults/dangerous-faults.actions';
import { startsWith } from 'lodash';
import { AddManoeuvreComment } from '@store/tests/test-data/common/manoeuvres/manoeuvres.actions';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { AddControlledStopComment } from '@store/tests/test-data/common/controlled-stop/controlled-stop.actions';
import {
  AddShowMeTellMeComment,
  ShowMeQuestionSelected,
} from '@store/tests/test-data/cat-b/vehicle-checks/vehicle-checks.actions';
import { AddSeriousFaultComment } from '@store/tests/test-data/common/serious-faults/serious-faults.actions';
import { EyesightTestAddComment } from '@store/tests/test-data/common/eyesight-test/eyesight-test.actions';
import { AddDrivingFaultComment } from '@store/tests/test-data/common/driving-faults/driving-faults.actions';

interface OfficePageState {
  displayShowMeQuestion$: Observable<boolean>;
  displayTellMeQuestion$: Observable<boolean>;
  displayDrivingFault$: Observable<boolean>;
  displaySeriousFault$: Observable<boolean>;
  displayDangerousFault$: Observable<boolean>;
  showMeQuestion$: Observable<VehicleChecksQuestion>;
  showMeQuestionOptions$: Observable<VehicleChecksQuestion[]>;
  tellMeQuestionText$: Observable<string>;
  etaFaults$: Observable<string>;
  ecoFaults$: Observable<string>;
  drivingFaults$: Observable<FaultSummary[]>;
  drivingFaultCount$: Observable<number>;
  displayDrivingFaultComments$: Observable<boolean>;
  dangerousFaults$: Observable<FaultSummary[]>;
  seriousFaults$: Observable<FaultSummary[]>;
}

@Component({
  selector: '.office-cat-b-page',
  templateUrl: 'office.cat-b.page.html',
  styleUrls: ['../office.page.scss'],
})
export class OfficeCatBPage extends OfficeBasePageComponent {

  pageState: OfficePageState;
  drivingFaultCtrl: string = 'drivingFaultCtrl';
  seriousFaultCtrl: string = 'seriousFaultCtrl';
  dangerousFaultCtrl: string = 'dangerousFaultCtrl';
  static readonly maxFaultCount = 15;

  showMeQuestions: VehicleChecksQuestion[];
  activityCodeOptions: ActivityCodeModel[];

  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    navController: NavController,
    toastController: ToastController,
    modalController: ModalController,
    outcomeBehaviourProvider: OutcomeBehaviourMapProvider,
    weatherConditionProvider: WeatherConditionProvider,
    public questionProvider: QuestionProvider,
    public alertController: AlertController,
    private faultCountProvider: FaultCountProvider,
    private faultSummaryProvider: FaultSummaryProvider,
  ) {
    super(
      platform,
      authenticationProvider,
      router,
      store$,
      navController,
      toastController,
      modalController,
      outcomeBehaviourProvider,
      weatherConditionProvider,
    );

    this.showMeQuestions = questionProvider.getShowMeQuestions(TestCategory.B);

  }

  ngOnInit(): void {
    super.onInitialisation();
    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );
    const category$ = currentTest$.pipe(
      select(getTestCategory),
    );
    this.pageState = {
      ...this.commonPageState,
      displayShowMeQuestion$: currentTest$.pipe(
        select(getTestOutcome),
        withLatestFrom(currentTest$.pipe(
          select(getTestData),
          select(getVehicleChecks),
          select(getShowMeQuestion),
        )),
        map(([outcome, question]) =>
          this.outcomeBehaviourProvider.isVisible(outcome, 'showMeQuestion', question)),
      ),
      displayTellMeQuestion$: currentTest$.pipe(
        select(getTestOutcome),
        withLatestFrom(currentTest$.pipe(
          select(getTestData),
          select(getVehicleChecks),
          select(getTellMeQuestion),
        )),
        map(([outcome, question]) =>
          this.outcomeBehaviourProvider.isVisible(outcome, 'tellMeQuestion', question)),
      ),
      displayDrivingFault$: currentTest$.pipe(
        select(getTestOutcome),
        withLatestFrom(currentTest$.pipe(
          select(getTestData),
        )),
        map(([outcome, testData]) =>
          this.outcomeBehaviourProvider.isVisible(
            outcome,
            'faultComment',
            this.faultSummaryProvider.getDrivingFaultsList(testData, TestCategory.B),
          )),
      ),
      displaySeriousFault$: currentTest$.pipe(
        select(getTestOutcome),
        withLatestFrom(currentTest$.pipe(
          select(getTestData),
        )),
        map(([outcome, testData]) =>
          this.outcomeBehaviourProvider.isVisible(
            outcome,
            'faultComment',
            this.faultSummaryProvider.getSeriousFaultsList(testData, TestCategory.B),
          )),
      ),
      displayDangerousFault$: currentTest$.pipe(
        select(getTestOutcome),
        withLatestFrom(currentTest$.pipe(
          select(getTestData),
        )),
        map(([outcome, testData]) =>
          this.outcomeBehaviourProvider.isVisible(
            outcome,
            'faultComment',
            this.faultSummaryProvider.getDangerousFaultsList(testData, TestCategory.B),
          )),
      ),
      showMeQuestion$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecks),
        select(getShowMeQuestion),
      ),
      showMeQuestionOptions$: currentTest$.pipe(
        select(getTestOutcome),
        map((outcome) =>
          getShowMeQuestionOptions(this.showMeQuestions, outcome, this.outcomeBehaviourProvider)),
      ),
      tellMeQuestionText$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecks),
        select(getSelectedTellMeQuestionText),
      ),
      etaFaults$: currentTest$.pipe(
        select(getTestData),
        select(getETA),
        select(getETAFaultText),
      ),
      ecoFaults$: currentTest$.pipe(
        select(getTestData),
        select(getEco),
        select(getEcoFaultText),
      ),
      dangerousFaults$: currentTest$.pipe(
        select(getTestData),
        withLatestFrom(category$),
        map(([testData, category]) =>
          this.faultSummaryProvider.getDangerousFaultsList(testData, category as TestCategory)),
      ),
      seriousFaults$: currentTest$.pipe(
        select(getTestData),
        withLatestFrom(category$),
        map(([testData, category]) =>
          this.faultSummaryProvider.getSeriousFaultsList(testData, category as TestCategory)),
      ),
      drivingFaults$: currentTest$.pipe(
        select(getTestData),
        withLatestFrom(category$),
        map(([testData, category]) =>
          this.faultSummaryProvider.getDrivingFaultsList(testData, category as TestCategory)),
      ),
      drivingFaultCount$: currentTest$.pipe(
        select(getTestData),
        withLatestFrom(category$),
        map(([testData, category]) => {
          return this.faultCountProvider.getDrivingFaultSumCount(category as TestCategory, testData);
        }),
      ),
      displayDrivingFaultComments$: currentTest$.pipe(
        select(getTestData),
        map((data) => this.shouldDisplayDrivingFaultComments(data)),
      ),
    };

    this.setupSubscriptions();
  }

  showMeQuestionChanged(showMeQuestion: VehicleChecksQuestion): void {
    this.store$.dispatch(ShowMeQuestionSelected(showMeQuestion));
  }

  dangerousFaultCommentChanged(dangerousFaultComment: FaultSummary) {
    if (dangerousFaultComment.source === CommentSource.SIMPLE) {
      this.store$.dispatch(
        AddDangerousFaultComment(dangerousFaultComment.competencyIdentifier, dangerousFaultComment.comment),
      );
    } else if (startsWith(dangerousFaultComment.source, CommentSource.MANOEUVRES)) {
      const segments = dangerousFaultComment.source.split('-');
      const fieldName = segments[1];
      const controlOrObservation = segments[2];
      this.store$.dispatch(
        AddManoeuvreComment(
          fieldName,
          CompetencyOutcome.D,
          controlOrObservation,
          dangerousFaultComment.comment,
        ),
      );

    } else if (dangerousFaultComment.source === CommentSource.CONTROLLED_STOP) {
      this.store$.dispatch(AddControlledStopComment(dangerousFaultComment.comment));

    } else if (dangerousFaultComment.source === CommentSource.VEHICLE_CHECKS) {
      this.store$.dispatch(AddShowMeTellMeComment(dangerousFaultComment.comment));
    }
  }

  seriousFaultCommentChanged(seriousFaultComment: FaultSummary) {
    if (seriousFaultComment.source === CommentSource.SIMPLE) {
      this.store$.dispatch(
        AddSeriousFaultComment(seriousFaultComment.competencyIdentifier, seriousFaultComment.comment),
      );
    } else if (startsWith(seriousFaultComment.source, CommentSource.MANOEUVRES)) {
      const segments = seriousFaultComment.source.split('-');
      const fieldName = segments[1];
      const controlOrObservation = segments[2];
      this.store$.dispatch(
        AddManoeuvreComment(
          fieldName,
          CompetencyOutcome.S,
          controlOrObservation,
          seriousFaultComment.comment,
        ),
      );

    } else if (seriousFaultComment.source === CommentSource.CONTROLLED_STOP) {
      this.store$.dispatch(AddControlledStopComment(seriousFaultComment.comment));
    } else if (seriousFaultComment.source === CommentSource.VEHICLE_CHECKS) {
      this.store$.dispatch(AddShowMeTellMeComment(seriousFaultComment.comment));
    } else if (seriousFaultComment.source === CommentSource.EYESIGHT_TEST) {
      this.store$.dispatch(EyesightTestAddComment(seriousFaultComment.comment));
    }
  }

  drivingFaultCommentChanged(drivingFaultComment: FaultSummary) {
    if (drivingFaultComment.source === CommentSource.SIMPLE) {
      this.store$.dispatch(
        AddDrivingFaultComment(drivingFaultComment.competencyIdentifier, drivingFaultComment.comment),
      );
    } else if (startsWith(drivingFaultComment.source, CommentSource.MANOEUVRES)) {
      const segments = drivingFaultComment.source.split('-');
      const fieldName = segments[1];
      const controlOrObservation = segments[2];
      this.store$.dispatch(
        AddManoeuvreComment(
          fieldName,
          CompetencyOutcome.DF,
          controlOrObservation,
          drivingFaultComment.comment,
        ),
      );

    } else if (drivingFaultComment.source === CommentSource.CONTROLLED_STOP) {
      this.store$.dispatch(AddControlledStopComment(drivingFaultComment.comment));

    } else if (drivingFaultComment.source === CommentSource.VEHICLE_CHECKS) {
      this.store$.dispatch(AddShowMeTellMeComment(drivingFaultComment.comment));
    }

  }

  shouldDisplayDrivingFaultComments = (data: CatBUniqueTypes.TestData): boolean => {
    const drivingFaultCount: number = this.faultCountProvider.getDrivingFaultSumCount(TestCategory.B, data);
    const seriousFaultCount: number = this.faultCountProvider.getSeriousFaultSumCount(TestCategory.B, data);
    const dangerousFaultCount: number = this.faultCountProvider.getDangerousFaultSumCount(TestCategory.B, data);

    return dangerousFaultCount === 0 && seriousFaultCount === 0 && drivingFaultCount > 15;
  };
}
