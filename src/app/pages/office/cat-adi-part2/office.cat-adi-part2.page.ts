import { NgClass } from '@angular/common';
import { Component, OnInit, computed } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivityCodeComponent } from '@components/common/activity-code/activity-code';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonToolbar,
} from '@ionic/angular';
import { behaviourMap } from '@pages/office/office-behaviour-map.cat-adi-part2';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { ExaminerRole } from '@providers/app-config/constants/examiner-role.constants';
import { QuestionProvider } from '@providers/question/question';
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';
import { OfficeBasePageComponent, mapOfficeValue } from '@shared/classes/test-flow-base-pages/office/office-base-page';
import { getActivityCodeOptions } from '@shared/constants/activity-code/activity-code.constants';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { CommentSource, FaultSummary } from '@shared/models/fault-marking.model';
import { AddManoeuvreComment } from '@store/tests/test-data/cat-adi-part2/manoeuvres/manoeuvres.actions';
import { getTestData } from '@store/tests/test-data/cat-adi-part2/test-data.cat-adi-part2.reducer';
import {
  AddShowMeTellMeComment,
  ShowMeQuestionSelected,
} from '@store/tests/test-data/cat-adi-part2/vehicle-checks/vehicle-checks.cat-adi-part2.action';
import {
  getSelectedShowMeQuestions,
  getVehicleChecksCatADI2,
  getVehicleChecksDangerous,
  getVehicleChecksSerious,
  vehicleChecksExist,
} from '@store/tests/test-data/cat-adi-part2/vehicle-checks/vehicle-checks.cat-adi-part2.selector';
import { AddControlledStopComment } from '@store/tests/test-data/common/controlled-stop/controlled-stop.actions';
import { AddDangerousFaultComment } from '@store/tests/test-data/common/dangerous-faults/dangerous-faults.actions';
import { AddDrivingFaultComment } from '@store/tests/test-data/common/driving-faults/driving-faults.actions';
import {
  AddEcoCaptureReason,
  AddEcoRelatedFault,
  ToggleFuelEfficientDriving,
} from '@store/tests/test-data/common/eco/eco.actions';
import { EyesightTestAddComment } from '@store/tests/test-data/common/eyesight-test/eyesight-test.actions';
import { AddSeriousFaultComment } from '@store/tests/test-data/common/serious-faults/serious-faults.actions';
import {
  getEco,
  getEcoCaptureReason,
  getEcoRelatedFault,
  getFuelEfficientDriving,
} from '@store/tests/test-data/common/test-data.selector';
import { AddUncoupleRecoupleComment } from '@store/tests/test-data/common/uncouple-recouple/uncouple-recouple.actions';
import { getTestOutcome, getTestOutcomeText } from '@store/tests/tests.selector';
import { startsWith } from 'lodash-es';
import { AccompanimentCardComponent } from '../../waiting-room-to-car/components/accompaniment-card/accompaniment-card';
import { VehicleDetailsCardComponent } from '../../waiting-room-to-car/components/vehicle-details-card/vehicle-details-card';
import { AdditionalInformationComponent } from '../components/additional-information/additional-information';
import { AlternateEvidenceDescriptionComponent } from '../components/alternate-mot-evidence-description/alternate-evidence-description.component';
import { AlternateEvidenceProvidedComponent } from '../components/alternate-mot-evidence-provided/alternate-evidence-provided.component';
import { CandidateDescriptionComponent } from '../components/candidate-description/candidate-description';
import { CandidateSectionComponent } from '../components/candidate-section/candidate-section';
import { DateOfTest } from '../components/date-of-test/date-of-test';
import { DrivingFaultsComponent } from '../components/driving-faults/driving-faults.component';
import { ECOCardComponent } from '../components/eco-card/eco-card.component';
import { ETACardComponent } from '../components/eta-card/eta-card.component';
import { FaultCommentCardComponent } from '../components/fault-comment-card/fault-comment-card';
import { IdentificationComponent } from '../components/identification/identification';
import { IndependentDrivingComponent } from '../components/independent-driving/independent-driving';
import { OfficeFooterComponent } from '../components/office-footer/office-footer.component';
import { OfficeRegistrationAndMotComponent } from '../components/office-registration-and-mot/office-registration-and-mot.component';
import { ReasonForEnteringTeamsComponent } from '../components/reason-for-entering-teams/reason-for-entering-teams';
import { RouteNumberComponent } from '../components/route-number/route-number';
import { TrueLikenessComponent } from '../components/true-likeness/true-likeness';
import { WeatherConditionsComponent } from '../components/weather-conditions/weather-conditions';
import { EcoCaptureReasonComponent } from './components/eco-capture-reason/eco-capture-reason';
import { EcoRelatedFaultComponent } from './components/eco-related-fault/eco-related-fault';
import { FuelEfficientDriving } from './components/fuel-efficient-driving/fuel-efficient-driving';
import { ShowMeQuestionsCatADI2Component } from './components/show-me-questions/show-me-questions';
import { VehicleChecksOfficeCardCatADI2Component } from './components/vehicle-checks/vehicle-checks-office-card';

@Component({
  selector: 'app-office-cat-adi-part2',
  templateUrl: './office.cat-adi-part2.page.html',
  styleUrls: ['../../office/office.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    NgClass,
    TestFlowHeaderComponent,
    IonContent,
    CandidateSectionComponent,
    FormsModule,
    ReactiveFormsModule,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonGrid,
    DateOfTest,
    ActivityCodeComponent,
    RouteNumberComponent,
    IndependentDrivingComponent,
    TrueLikenessComponent,
    CandidateDescriptionComponent,
    IdentificationComponent,
    VehicleChecksOfficeCardCatADI2Component,
    ShowMeQuestionsCatADI2Component,
    WeatherConditionsComponent,
    AccompanimentCardComponent,
    VehicleDetailsCardComponent,
    OfficeRegistrationAndMotComponent,
    AlternateEvidenceProvidedComponent,
    AlternateEvidenceDescriptionComponent,
    AdditionalInformationComponent,
    ReasonForEnteringTeamsComponent,
    ETACardComponent,
    ECOCardComponent,
    FuelEfficientDriving,
    EcoRelatedFaultComponent,
    EcoCaptureReasonComponent,
    FaultCommentCardComponent,
    DrivingFaultsComponent,
    IonFooter,
    OfficeFooterComponent,
  ],
})
export class OfficeCatADI2Page extends OfficeBasePageComponent implements OnInit {
  displayDrivingFaultComments = computed(() =>
    mapOfficeValue(
      [getTestData(this.officeCurrentTest() as never), getTestOutcomeText(this.officeCurrentTest() as never)] as const,
      ([testData, testOutcomeText]) =>
        this.faultCountProvider.shouldDisplayDrivingFaultComments(testData, TestCategory.ADI2, 0, testOutcomeText)
    )
  );
  displayTellMeQuestions = computed(() =>
    mapOfficeValue(
      [getTestOutcome(this.officeCurrentTest() as never), getTestData(this.officeCurrentTest() as never)] as const,
      ([outcome, data]) =>
        this.outcomeBehaviourProvider.isVisible(outcome, 'tellMeQuestion', vehicleChecksExist(data.vehicleChecks)) &&
        (data.vehicleChecks?.tellMeQuestions
          ? data.vehicleChecks?.tellMeQuestions.filter((value: QuestionResult) => Object.keys(value).length > 0)
              .length > 0
          : false)
    )
  );
  vehicleChecks = computed(() =>
    mapOfficeValue(getVehicleChecksCatADI2(getTestData(this.officeCurrentTest() as never) as never), (checks) => [
      ...checks.tellMeQuestions,
    ])
  );
  recordedShowMeQuestions = computed(() =>
    getSelectedShowMeQuestions(
      getVehicleChecksCatADI2(getTestData(this.officeCurrentTest() as never) as never) as never
    )
  );
  vehicleChecksSerious = computed(() =>
    getVehicleChecksSerious(getVehicleChecksCatADI2(getTestData(this.officeCurrentTest() as never) as never) as never)
  );
  vehicleChecksDangerous = computed(() =>
    getVehicleChecksDangerous(getVehicleChecksCatADI2(getTestData(this.officeCurrentTest() as never) as never) as never)
  );
  showMeQuestionsFaults = computed(() =>
    mapOfficeValue(
      getVehicleChecksCatADI2(getTestData(this.officeCurrentTest() as never) as never),
      (data) => this.faultCountProvider.getShowMeFaultCount(TestCategory.ADI2, data).drivingFaults
    )
  );
  adi2DrivingFaults = computed(() =>
    mapOfficeValue([getTestData(this.officeCurrentTest() as never), this.testCategory()] as const, ([data, category]) =>
      this.faultSummaryProvider.getDrivingFaultsList(data, category as TestCategory, false)
    )
  );
  fuelEfficientDriving = computed(() =>
    getFuelEfficientDriving(getEco(getTestData(this.officeCurrentTest() as never) as never) as never)
  );
  ecoRelatedFault = computed(() =>
    getEcoRelatedFault(getEco(getTestData(this.officeCurrentTest() as never) as never) as never)
  );
  ecoCaptureReason = computed(() =>
    getEcoCaptureReason(getEco(getTestData(this.officeCurrentTest() as never) as never) as never)
  );
  displayFuelEfficient = computed(() =>
    mapOfficeValue(
      [
        mapOfficeValue(
          [getTestData(this.officeCurrentTest() as never), this.testCategory()] as const,
          ([testData, category]) => this.faultSummaryProvider.getSeriousFaultsList(testData, category as TestCategory)
        ),
        mapOfficeValue(
          [getTestData(this.officeCurrentTest() as never), this.testCategory()] as const,
          ([testData, category]) => this.faultSummaryProvider.getDangerousFaultsList(testData, category as TestCategory)
        ),
        mapOfficeValue(
          [getTestData(this.officeCurrentTest() as never), this.testCategory()] as const,
          ([data, category]) => this.faultSummaryProvider.getDrivingFaultsList(data, category as TestCategory, false)
        ),
      ] as const,
      ([seriousF, dangerousF, drivingF]) =>
        !!(seriousF?.length === 0 && dangerousF?.length === 0 && drivingF?.length === 0)
    )
  );
  allowDrivingFaultComment = computed(() =>
    mapOfficeValue(
      [
        mapOfficeValue(
          [getTestData(this.officeCurrentTest() as never), this.testCategory()] as const,
          ([testData, category]) => this.faultSummaryProvider.getSeriousFaultsList(testData, category as TestCategory)
        ),
        mapOfficeValue(
          [getTestData(this.officeCurrentTest() as never), this.testCategory()] as const,
          ([testData, category]) => this.faultSummaryProvider.getDangerousFaultsList(testData, category as TestCategory)
        ),
      ] as const,
      ([seriousF, dangerousF]) => !!(seriousF?.length === 0 && dangerousF?.length === 0)
    )
  );
  static readonly maxFaultCount = 6;
  showMeQuestions: VehicleChecksQuestion[];

  constructor(
    private appConfig: AppConfigProvider,
    private questionProvider: QuestionProvider
  ) {
    super();
    this.outcomeBehaviourProvider.setBehaviourMap(behaviourMap);
    this.activityCodeOptions = getActivityCodeOptions(this.appConfig.getAppConfig()?.role === ExaminerRole.DLG);
    this.showMeQuestions = this.questionProvider.getShowMeQuestions(TestCategory.ADI2);
  }

  ngOnInit(): void {
    super.onInitialisation();
  }

  async ionViewWillEnter() {
    super.ionViewWillEnter();

    if (!this.isPracticeMode && super.isIos()) {
      await this.deviceProvider.disableSingleAppMode();
    }
  }

  ionViewDidLeave(): void {
    super.ionViewDidLeave();
  }

  dangerousFaultCommentChanged(dangerousFaultComment: FaultSummary) {
    if (dangerousFaultComment.source === CommentSource.SIMPLE) {
      this.store$.dispatch(
        AddDangerousFaultComment(dangerousFaultComment.competencyIdentifier, dangerousFaultComment.comment)
      );
    } else if (startsWith(dangerousFaultComment.source, CommentSource.MANOEUVRES)) {
      const segments = dangerousFaultComment.source.split('-');
      const index = Number.parseInt(segments[1], 10);
      const fieldName = segments[2];
      const controlOrObservation = segments[3];
      this.store$.dispatch(
        AddManoeuvreComment(fieldName, CompetencyOutcome.D, controlOrObservation, dangerousFaultComment.comment, index)
      );
    } else if (dangerousFaultComment.source === CommentSource.UNCOUPLE_RECOUPLE) {
      this.store$.dispatch(AddUncoupleRecoupleComment(dangerousFaultComment.comment));
    } else if (dangerousFaultComment.source === CommentSource.VEHICLE_CHECKS) {
      this.store$.dispatch(AddShowMeTellMeComment(dangerousFaultComment.comment));
    } else if (dangerousFaultComment.source === CommentSource.CONTROLLED_STOP) {
      this.store$.dispatch(AddControlledStopComment(dangerousFaultComment.comment));
    }
  }

  seriousFaultCommentChanged(seriousFaultComment: FaultSummary) {
    if (seriousFaultComment.source === CommentSource.SIMPLE) {
      this.store$.dispatch(
        AddSeriousFaultComment(seriousFaultComment.competencyIdentifier, seriousFaultComment.comment)
      );
    } else if (startsWith(seriousFaultComment.source, CommentSource.MANOEUVRES)) {
      const segments = seriousFaultComment.source.split('-');
      const index = Number.parseInt(segments[1], 10);
      const fieldName = segments[2];
      const controlOrObservation = segments[3];
      this.store$.dispatch(
        AddManoeuvreComment(fieldName, CompetencyOutcome.S, controlOrObservation, seriousFaultComment.comment, index)
      );
    } else if (seriousFaultComment.source === CommentSource.UNCOUPLE_RECOUPLE) {
      this.store$.dispatch(AddUncoupleRecoupleComment(seriousFaultComment.comment));
    } else if (seriousFaultComment.source === CommentSource.VEHICLE_CHECKS) {
      this.store$.dispatch(AddShowMeTellMeComment(seriousFaultComment.comment));
    } else if (seriousFaultComment.source === CommentSource.EYESIGHT_TEST) {
      this.store$.dispatch(EyesightTestAddComment(seriousFaultComment.comment));
    } else if (seriousFaultComment.source === CommentSource.CONTROLLED_STOP) {
      this.store$.dispatch(AddControlledStopComment(seriousFaultComment.comment));
    }
  }

  drivingFaultCommentChanged(drivingFaultComment: FaultSummary) {
    if (drivingFaultComment.source === CommentSource.SIMPLE) {
      this.store$.dispatch(
        AddDrivingFaultComment(drivingFaultComment.competencyIdentifier, drivingFaultComment.comment)
      );
    } else if (startsWith(drivingFaultComment.source, CommentSource.MANOEUVRES)) {
      const segments = drivingFaultComment.source.split('-');
      const index = Number.parseInt(segments[1], 10);
      const fieldName = segments[2];
      const controlOrObservation = segments[3];
      this.store$.dispatch(
        AddManoeuvreComment(fieldName, CompetencyOutcome.DF, controlOrObservation, drivingFaultComment.comment, index)
      );
    } else if (drivingFaultComment.source === CommentSource.UNCOUPLE_RECOUPLE) {
      this.store$.dispatch(AddUncoupleRecoupleComment(drivingFaultComment.comment));
    } else if (drivingFaultComment.source === CommentSource.VEHICLE_CHECKS) {
      this.store$.dispatch(AddShowMeTellMeComment(drivingFaultComment.comment));
    } else if (drivingFaultComment.source === CommentSource.CONTROLLED_STOP) {
      this.store$.dispatch(AddControlledStopComment(drivingFaultComment.comment));
    }
  }

  showMeQuestionsChanged(result: QuestionResult, index: number): void {
    this.store$.dispatch(ShowMeQuestionSelected(result, index));
  }

  ecoFaultChanged(fault: string): void {
    this.store$.dispatch(AddEcoRelatedFault(fault));
  }

  ecoCaptureReasonChanged(ecoCaptureReason: string): void {
    this.store$.dispatch(AddEcoCaptureReason(ecoCaptureReason));
  }

  fedChanged(fuelEfficientDriving: boolean): void {
    this.store$.dispatch(ToggleFuelEfficientDriving(fuelEfficientDriving));
  }
}
