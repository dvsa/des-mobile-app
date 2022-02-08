import { Component, OnInit } from '@angular/core';
import {
  ModalController, NavController, Platform, ToastController,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import {
  Avoidance, Circuit, EmergencyStop, TestData,
} from '@dvsa/mes-test-schema/categories/AM1';

import {
  CommonOfficePageState,
  OfficeBasePageComponent,
} from '@shared/classes/test-flow-base-pages/office/office-base-page';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { StoreModel } from '@shared/models/store.model';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { WeatherConditionProvider } from '@providers/weather-conditions/weather-condition';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { QuestionProvider } from '@providers/question/question';
import { behaviourMap } from '@pages/office/office-behaviour-map.cat-a-mod1';
import { getCurrentTest, getTestOutcome } from '@store/tests/tests.selector';
import { getTests } from '@store/tests/tests.reducer';
import { getTestData } from '@store/tests/test-data/cat-a-mod1/test-data.cat-a-mod1.reducer';
import { getEmergencyStop } from '@store/tests/test-data/cat-a-mod1/emergency-stop/emergency-stop.selector';
import { getETA, getETAFaultText } from '@store/tests/test-data/common/test-data.selector';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { getAvoidance, getAvoidanceAttempted } from '@store/tests/test-data/cat-a-mod1/avoidance/avoidance.selector';
import { getTestSummary } from '@store/tests/test-summary/cat-a-mod1/test-summary.cat-a-mod1.reducer';
import { getCircuit } from '@store/tests/test-summary/cat-a-mod1/test-summary.cat-a-mod1.selector';
import { CommentSource, FaultSummary } from '@shared/models/fault-marking.model';
import { AddDangerousFaultComment } from '@store/tests/test-data/common/dangerous-faults/dangerous-faults.actions';
import {
  AddSingleFaultCompetencyComment,
} from '@store/tests/test-data/common/single-fault-competencies/single-fault-competencies.actions';
import { Competencies, SingleFaultCompetencyNames } from '@store/tests/test-data/test-data.constants';
import { AddSeriousFaultComment } from '@store/tests/test-data/common/serious-faults/serious-faults.actions';
import { startsWith } from 'lodash';
import { AddAvoidanceComment } from '@store/tests/test-data/cat-a-mod1/avoidance/avoidance.actions';
import { AddAnEmergencyStopComment } from '@store/tests/test-data/cat-a-mod1/emergency-stop/emergency-stop.actions';
import { AddDrivingFaultComment } from '@store/tests/test-data/common/driving-faults/driving-faults.actions';
import { CircuitTypeChanged } from '@store/tests/test-summary/cat-a-mod1/test-summary.cat-a-mod1.actions';

interface CatMod1MOfficePageState {
  etaFaults$: Observable<string>;
  displayDrivingFaultComments$: Observable<boolean>;
  displaySpeedRequirements$: Observable<boolean>;
  emergencyStop$: Observable<EmergencyStop>;
  displayCircuit$: Observable<boolean>;
  circuit$: Observable<Circuit>;
  avoidance$: Observable<Avoidance>;
  avoidanceAttempted$: Observable<boolean>;
  testCategory$: Observable<TestCategory>;
}

type OfficePageState = CommonOfficePageState & CatMod1MOfficePageState;

@Component({
  selector: '.office-cat-amod1-page',
  templateUrl: './office.cat-a-mod1.page.html',
  styleUrls: ['../office.page.scss'],
})
export class OfficeCatAMod1Page extends OfficeBasePageComponent implements OnInit {

  pageState: OfficePageState;
  static readonly maxFaultCount: number = 5;

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
    faultSummaryProvider: FaultSummaryProvider,
    faultCountProvider: FaultCountProvider,
    public questionProvider: QuestionProvider,
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
      faultSummaryProvider,
      faultCountProvider,
    );
    this.outcomeBehaviourProvider.setBehaviourMap(behaviourMap);
  }

  ngOnInit(): void {
    super.onInitialisation();

    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    const testCategory$ = currentTest$.pipe(
      select(getTestCategory),
      map((testCategory) => testCategory as TestCategory),
    );

    this.pageState = {
      ...this.commonPageState,
      etaFaults$: currentTest$.pipe(
        select(getTestData),
        select(getETA),
        select(getETAFaultText),
      ),
      displayDrivingFaultComments$: currentTest$.pipe(
        select(getTestData),
        withLatestFrom(testCategory$),
        map(([data, category]) => this.shouldDisplayDrivingFaultComments(data, category)),
      ),
      displayCircuit$: currentTest$.pipe(
        select(getTestOutcome),
        withLatestFrom(currentTest$.pipe(
          select(getTestSummary),
          select(getCircuit),
        )),
        map(([outcome, circuit]) =>
          this.outcomeBehaviourProvider.isVisible(outcome, 'circuit', circuit)),
      ),
      circuit$: currentTest$.pipe(
        select(getTestSummary),
        select(getCircuit),
      ),
      emergencyStop$: currentTest$.pipe(
        select(getTestData),
        select(getEmergencyStop),
      ),
      avoidance$: currentTest$.pipe(
        select(getTestData),
        select(getAvoidance),
      ),
      avoidanceAttempted$: currentTest$.pipe(
        select(getTestData),
        select(getAvoidance),
        select(getAvoidanceAttempted),
      ),
      displaySpeedRequirements$: currentTest$.pipe(
        select(getTestOutcome),
        withLatestFrom(
          currentTest$.pipe(
            select(getTestData),
            select(getEmergencyStop),
          ),
        ),
        map(([outcome, emergencyStop]) =>
          this.outcomeBehaviourProvider.isVisible(outcome, 'speedRequirement', emergencyStop.firstAttempt)),
      ),
      testCategory$: currentTest$.pipe(
        select(getTestCategory),
        map((testCategory) => testCategory as TestCategory),
      ),
    };
  }

  circuitChanged(circuit: Circuit): void {
    this.store$.dispatch(CircuitTypeChanged(circuit));
  }

  dangerousFaultCommentChanged(dangerousFaultComment: FaultSummary): void {
    if (dangerousFaultComment.source === CommentSource.SIMPLE) {
      this.store$.dispatch(
        AddDangerousFaultComment(dangerousFaultComment.competencyIdentifier, dangerousFaultComment.comment),
      );
    } else if (dangerousFaultComment.source === CommentSource.SINGLE_FAULT_COMPETENCY) {
      this.store$.dispatch(AddSingleFaultCompetencyComment(
        dangerousFaultComment.competencyIdentifier as SingleFaultCompetencyNames,
        dangerousFaultComment.comment,
      ));
    }
  }

  seriousFaultCommentChanged(seriousFaultComment: FaultSummary): void {
    if (seriousFaultComment.source === CommentSource.SIMPLE) {
      this.store$.dispatch(
        AddSeriousFaultComment(seriousFaultComment.competencyIdentifier, seriousFaultComment.comment),
      );
    } else if (seriousFaultComment.source === CommentSource.SINGLE_FAULT_COMPETENCY) {
      this.store$.dispatch(AddSingleFaultCompetencyComment(
        seriousFaultComment.competencyIdentifier as SingleFaultCompetencyNames,
        seriousFaultComment.comment,
      ));
    } else if (startsWith(seriousFaultComment.source, CommentSource.SPEED_REQUIREMENTS)) {
      const segments = seriousFaultComment.source.split('-');
      const fieldName = segments[1];
      switch (fieldName) {
        case Competencies.speedCheckAvoidance:
          this.store$.dispatch(AddAvoidanceComment(seriousFaultComment.comment));
          break;
        case Competencies.speedCheckEmergency:
          this.store$.dispatch(AddAnEmergencyStopComment(seriousFaultComment.comment));
          break;
        default:
      }
    }
  }

  drivingFaultCommentChanged(drivingFaultComment: FaultSummary): void {
    if (drivingFaultComment.source === CommentSource.SIMPLE) {
      this.store$.dispatch(
        AddDrivingFaultComment(drivingFaultComment.competencyIdentifier, drivingFaultComment.comment),
      );
    } else if (drivingFaultComment.source === CommentSource.SINGLE_FAULT_COMPETENCY) {
      this.store$.dispatch(AddSingleFaultCompetencyComment(
        drivingFaultComment.competencyIdentifier as SingleFaultCompetencyNames,
        drivingFaultComment.comment,
      ));
    }
  }

  shouldDisplayDrivingFaultComments = (data: TestData, category: TestCategory): boolean => {
    const drivingFaultCount: number = this.faultCountProvider.getDrivingFaultSumCount(category, data);
    const seriousFaultCount: number = this.faultCountProvider.getSeriousFaultSumCount(category, data);
    const dangerousFaultCount: number = this.faultCountProvider.getDangerousFaultSumCount(category, data);

    return dangerousFaultCount === 0 && seriousFaultCount === 0 && drivingFaultCount > OfficeCatAMod1Page.maxFaultCount;
  };

}
