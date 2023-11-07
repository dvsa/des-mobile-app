import { Component, Injector, OnInit } from '@angular/core';
import { CatFUniqueTypes } from '@dvsa/mes-test-schema/categories/F';
import { CatGUniqueTypes } from '@dvsa/mes-test-schema/categories/G';
import { CatKUniqueTypes } from '@dvsa/mes-test-schema/categories/K';
import { CatHUniqueTypes } from '@dvsa/mes-test-schema/categories/H';
import {
  CommonOfficePageState,
  OfficeBasePageComponent,
} from '@shared/classes/test-flow-base-pages/office/office-base-page';
import { select } from '@ngrx/store';
import { behaviourMap } from '@pages/office/office-behaviour-map.cat-home-test';
import { activityCodeModelList } from '@shared/constants/activity-code/activity-code.constants';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getTestOutcome } from '@store/tests/tests.selector';
import { merge, Observable, Subscription } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { getTestData } from '@store/tests/test-data/cat-home/test-data.cat-f.reducer';
import { vehicleChecksExist } from '@store/tests/test-data/cat-home/vehicle-checks/vehicle-checks.cat-home.selector';
import { CategoryCode, QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { getVehicleChecks } from '@store/tests/test-data/cat-home/test-data.cat-home.selector';
import { CommentSource, FaultSummary } from '@shared/models/fault-marking.model';
import { AddDangerousFaultComment } from '@store/tests/test-data/common/dangerous-faults/dangerous-faults.actions';
import { startsWith } from 'lodash';
import { AddManoeuvreComment } from '@store/tests/test-data/common/manoeuvres/manoeuvres.actions';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { AddUncoupleRecoupleComment } from '@store/tests/test-data/common/uncouple-recouple/uncouple-recouple.actions';
import { AddShowMeTellMeComment } from '@store/tests/test-data/cat-home/vehicle-checks/vehicle-checks.cat-home.actions';
import { AddControlledStopComment } from '@store/tests/test-data/common/controlled-stop/controlled-stop.actions';
import { AddSeriousFaultComment } from '@store/tests/test-data/common/serious-faults/serious-faults.actions';
import { EyesightTestAddComment } from '@store/tests/test-data/common/eyesight-test/eyesight-test.actions';
import {
  HighwayCodeSafetyAddComment,
} from '@store/tests/test-data/common/highway-code-safety/highway-code-safety.actions';
import { AddDrivingFaultComment } from '@store/tests/test-data/common/driving-faults/driving-faults.actions';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { getTestCategory } from '@store/tests/category/category.reducer';

interface CatHomeOfficePageState {
  testCategory$: Observable<CategoryCode>;
  displayVehicleChecks$: Observable<boolean>;
  vehicleChecks$: Observable<QuestionResult[]>;
  displayDrivingFaultComments$: Observable<boolean>;
}

export type HomeTestData =
  | CatFUniqueTypes.TestData
  | CatGUniqueTypes.TestData
  | CatHUniqueTypes.TestData
  | CatKUniqueTypes.TestData;

type OfficePageState = CommonOfficePageState & CatHomeOfficePageState;

@Component({
  selector: '.office-cat-home-page',
  templateUrl: './office.cat-home-test.page.html',
  styleUrls: ['../office.page.scss'],
})
export class OfficeCatHomeTestPage extends OfficeBasePageComponent implements OnInit {
  pageState: OfficePageState;
  testCategory: CategoryCode;
  pageSubscription: Subscription;
  readonly maxFaultCount = 15;

  constructor(injector: Injector) {
    super(injector);
    this.outcomeBehaviourProvider.setBehaviourMap(behaviourMap);
    this.activityCodeOptions = activityCodeModelList;
  }

  ngOnInit() {
    super.onInitialisation();

    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    this.pageState = {
      ...this.commonPageState,
      testCategory$: currentTest$.pipe(
        select(getTestCategory),
        map((result) => this.testCategory = result),
      ),
      displayVehicleChecks$: currentTest$.pipe(
        select(getTestOutcome),
        withLatestFrom(currentTest$.pipe(select(getTestData))),
        map(([outcome, data]) =>
          this.outcomeBehaviourProvider.isVisible(outcome, 'vehicleChecks', vehicleChecksExist(data.vehicleChecks))),
      ),
      vehicleChecks$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecks),
        map((checks) => [...checks.tellMeQuestions, ...checks.showMeQuestions]),
      ),
      displayDrivingFaultComments$: currentTest$.pipe(
        select(getTestData),
        map((data) => this.faultCountProvider.shouldDisplayDrivingFaultComments(
          data as HomeTestData,
          this.testCategory as TestCategory,
          this.maxFaultCount,
        )),
      ),
    };

    this.setupSubscription();
  }

  setupSubscription() {
    super.setupSubscriptions();

    const {
      testCategory$,
    } = this.pageState;

    this.pageSubscription = merge(
      testCategory$.pipe(map((result) => this.testCategory = result)),
    )
      .subscribe();
  }

  async ionViewWillEnter() {
    super.ionViewWillEnter();

    if (!this.isPracticeMode && super.isIos()) {
      await this.deviceProvider.disableSingleAppMode();
    }
  }

  ionViewDidLeave(): void {
    super.ionViewDidLeave();

    if (this.pageSubscription) {
      this.pageSubscription.unsubscribe();
    }
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

    } else if (seriousFaultComment.source === CommentSource.UNCOUPLE_RECOUPLE) {
      this.store$.dispatch(AddUncoupleRecoupleComment(seriousFaultComment.comment));
    } else if (seriousFaultComment.source === CommentSource.VEHICLE_CHECKS) {
      this.store$.dispatch(AddShowMeTellMeComment(seriousFaultComment.comment));
    } else if (seriousFaultComment.source === CommentSource.EYESIGHT_TEST) {
      this.store$.dispatch(EyesightTestAddComment(seriousFaultComment.comment));
    } else if (seriousFaultComment.source === CommentSource.CONTROLLED_STOP) {
      this.store$.dispatch(AddControlledStopComment(seriousFaultComment.comment));
    } else if (seriousFaultComment.source === CommentSource.HIGHWAY_CODE_SAFETY) {
      this.store$.dispatch(HighwayCodeSafetyAddComment(seriousFaultComment.comment));
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

    } else if (drivingFaultComment.source === CommentSource.UNCOUPLE_RECOUPLE) {
      this.store$.dispatch(AddUncoupleRecoupleComment(drivingFaultComment.comment));
    } else if (drivingFaultComment.source === CommentSource.VEHICLE_CHECKS) {
      this.store$.dispatch(AddShowMeTellMeComment(drivingFaultComment.comment));
    } else if (drivingFaultComment.source === CommentSource.CONTROLLED_STOP) {
      this.store$.dispatch(AddControlledStopComment(drivingFaultComment.comment));
    } else if (drivingFaultComment.source === CommentSource.HIGHWAY_CODE_SAFETY) {
      this.store$.dispatch(HighwayCodeSafetyAddComment(drivingFaultComment.comment));
    }
  }
}
