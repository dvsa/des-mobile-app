import { Component, Injector, OnInit } from '@angular/core';
import { Avoidance, Circuit, EmergencyStop } from '@dvsa/mes-test-schema/categories/AM1';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

import { behaviourMap } from '@pages/office/office-behaviour-map.cat-a-mod1';
import {
  CommonOfficePageState,
  OfficeBasePageComponent,
} from '@shared/classes/test-flow-base-pages/office/office-base-page';
import { CommentSource, FaultSummary } from '@shared/models/fault-marking.model';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { AddAvoidanceComment } from '@store/tests/test-data/cat-a-mod1/avoidance/avoidance.actions';
import { getAvoidance, getAvoidanceAttempted } from '@store/tests/test-data/cat-a-mod1/avoidance/avoidance.selector';
import { AddAnEmergencyStopComment } from '@store/tests/test-data/cat-a-mod1/emergency-stop/emergency-stop.actions';
import { getEmergencyStop } from '@store/tests/test-data/cat-a-mod1/emergency-stop/emergency-stop.selector';
import { getTestData } from '@store/tests/test-data/cat-a-mod1/test-data.cat-a-mod1.reducer';
import { AddDangerousFaultComment } from '@store/tests/test-data/common/dangerous-faults/dangerous-faults.actions';
import { AddDrivingFaultComment } from '@store/tests/test-data/common/driving-faults/driving-faults.actions';
import { AddSeriousFaultComment } from '@store/tests/test-data/common/serious-faults/serious-faults.actions';
import { AddSingleFaultCompetencyComment } from '@store/tests/test-data/common/single-fault-competencies/single-fault-competencies.actions';
import { getETA, getETAFaultText } from '@store/tests/test-data/common/test-data.selector';
import { Competencies, SingleFaultCompetencyNames } from '@store/tests/test-data/test-data.constants';
import { getTestSummary } from '@store/tests/test-summary/cat-a-mod1/test-summary.cat-a-mod1.reducer';
import { getCircuit } from '@store/tests/test-summary/cat-a-mod1/test-summary.cat-a-mod1.selector';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getTestOutcome } from '@store/tests/tests.selector';
import { getSchoolBike } from '@store/tests/vehicle-details/cat-a-mod1/vehicle-details.cat-a-mod1.selector';
import { getVehicleDetails } from '@store/tests/vehicle-details/vehicle-details.reducer';
import { startsWith } from 'lodash-es';

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
  schoolBike$: Observable<boolean>;
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

  constructor(injector: Injector) {
    super(injector);
    this.outcomeBehaviourProvider.setBehaviourMap(behaviourMap);
  }

  ngOnInit(): void {
    super.onInitialisation();

    const currentTest$ = this.store$.pipe(select(getTests), select(getCurrentTest));

    const testCategory$ = currentTest$.pipe(
      select(getTestCategory),
      map((testCategory) => testCategory as TestCategory)
    );

    this.pageState = {
      ...this.commonPageState,
      etaFaults$: currentTest$.pipe(select(getTestData), select(getETA), select(getETAFaultText)),
      displayDrivingFaultComments$: currentTest$.pipe(
        select(getTestData),
        withLatestFrom(testCategory$),
        map(([data, category]) =>
          this.faultCountProvider.shouldDisplayDrivingFaultComments(data, category, OfficeCatAMod1Page.maxFaultCount)
        )
      ),
      displayCircuit$: currentTest$.pipe(
        select(getTestOutcome),
        withLatestFrom(currentTest$.pipe(select(getTestSummary), select(getCircuit))),
        map(([outcome, circuit]) => this.outcomeBehaviourProvider.isVisible(outcome, 'circuit', circuit))
      ),
      circuit$: currentTest$.pipe(select(getTestSummary), select(getCircuit)),
      emergencyStop$: currentTest$.pipe(select(getTestData), select(getEmergencyStop)),
      avoidance$: currentTest$.pipe(select(getTestData), select(getAvoidance)),
      avoidanceAttempted$: currentTest$.pipe(select(getTestData), select(getAvoidance), select(getAvoidanceAttempted)),
      displaySpeedRequirements$: currentTest$.pipe(
        select(getTestOutcome),
        withLatestFrom(currentTest$.pipe(select(getTestData), select(getEmergencyStop))),
        map(([outcome, emergencyStop]) =>
          this.outcomeBehaviourProvider.isVisible(outcome, 'speedRequirement', emergencyStop.firstAttempt)
        )
      ),
      testCategory$: currentTest$.pipe(
        select(getTestCategory),
        map((testCategory) => testCategory as TestCategory)
      ),
      schoolBike$: currentTest$.pipe(select(getVehicleDetails), select(getSchoolBike)),
    };
  }

  async ionViewWillEnter() {
    super.ionViewWillEnter();

    if (!this.isPracticeMode && super.isIos()) {
      await this.deviceProvider.disableSingleAppMode();
    }
  }

  dangerousFaultCommentChanged(dangerousFaultComment: FaultSummary): void {
    if (dangerousFaultComment.source === CommentSource.SIMPLE) {
      this.store$.dispatch(
        AddDangerousFaultComment(dangerousFaultComment.competencyIdentifier, dangerousFaultComment.comment)
      );
    } else if (dangerousFaultComment.source === CommentSource.SINGLE_FAULT_COMPETENCY) {
      this.store$.dispatch(
        AddSingleFaultCompetencyComment(
          dangerousFaultComment.competencyIdentifier as SingleFaultCompetencyNames,
          dangerousFaultComment.comment
        )
      );
    }
  }

  seriousFaultCommentChanged(seriousFaultComment: FaultSummary): void {
    if (seriousFaultComment.source === CommentSource.SIMPLE) {
      this.store$.dispatch(
        AddSeriousFaultComment(seriousFaultComment.competencyIdentifier, seriousFaultComment.comment)
      );
    } else if (seriousFaultComment.source === CommentSource.SINGLE_FAULT_COMPETENCY) {
      this.store$.dispatch(
        AddSingleFaultCompetencyComment(
          seriousFaultComment.competencyIdentifier as SingleFaultCompetencyNames,
          seriousFaultComment.comment
        )
      );
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
        AddDrivingFaultComment(drivingFaultComment.competencyIdentifier, drivingFaultComment.comment)
      );
    } else if (drivingFaultComment.source === CommentSource.SINGLE_FAULT_COMPETENCY) {
      this.store$.dispatch(
        AddSingleFaultCompetencyComment(
          drivingFaultComment.competencyIdentifier as SingleFaultCompetencyNames,
          drivingFaultComment.comment
        )
      );
    }
  }
}
