import { Component, Injector } from '@angular/core';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { select } from '@ngrx/store';
import { QuestionProvider } from '@providers/question/question';
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';
import {
  CommonOfficePageState,
  OfficeBasePageComponent,
} from '@shared/classes/test-flow-base-pages/office/office-base-page';
import { ActivityCodeModel } from '@shared/constants/activity-code/activity-code.constants';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { CommentSource, FaultSummary } from '@shared/models/fault-marking.model';
import {
  getSelectedTellMeQuestionText,
  getShowMeQuestion,
  getTellMeQuestion,
  getVehicleChecks,
} from '@store/tests/test-data/cat-b/test-data.cat-b.selector';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import {
  AddShowMeTellMeComment,
  ShowMeQuestionSelected,
} from '@store/tests/test-data/cat-b/vehicle-checks/vehicle-checks.actions';
import { AddControlledStopComment } from '@store/tests/test-data/common/controlled-stop/controlled-stop.actions';
import { AddDangerousFaultComment } from '@store/tests/test-data/common/dangerous-faults/dangerous-faults.actions';
import { AddDrivingFaultComment } from '@store/tests/test-data/common/driving-faults/driving-faults.actions';
import { EyesightTestAddComment } from '@store/tests/test-data/common/eyesight-test/eyesight-test.actions';
import { AddManoeuvreComment } from '@store/tests/test-data/common/manoeuvres/manoeuvres.actions';
import { AddSeriousFaultComment } from '@store/tests/test-data/common/serious-faults/serious-faults.actions';
import {
  getETA,
  getETAFaultText,
  getEco,
  getEcoFaultText,
  getShowMeQuestionOptions,
} from '@store/tests/test-data/common/test-data.selector';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getTestOutcome } from '@store/tests/tests.selector';
import { startsWith } from 'lodash-es';
import { Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { behaviourMap } from '../office-behaviour-map';

interface CatBOfficePageState {
  displayShowMeQuestion$: Observable<boolean>;
  displayTellMeQuestion$: Observable<boolean>;
  showMeQuestion$: Observable<VehicleChecksQuestion>;
  showMeQuestionOptions$: Observable<VehicleChecksQuestion[]>;
  tellMeQuestionText$: Observable<string>;
  etaFaults$: Observable<string>;
  ecoFaults$: Observable<string>;
  displayDrivingFaultComments$: Observable<boolean>;
}

type OfficePageState = CommonOfficePageState & CatBOfficePageState;

@Component({
  selector: '.office-cat-b-page',
  templateUrl: 'office.cat-b.page.html',
  styleUrls: ['../office.page.scss'],
})
export class OfficeCatBPage extends OfficeBasePageComponent {
  pageState: OfficePageState;
  drivingFaultCtrl = 'drivingFaultCtrl';
  seriousFaultCtrl = 'seriousFaultCtrl';
  dangerousFaultCtrl = 'dangerousFaultCtrl';
  static readonly maxFaultCount = 15;

  showMeQuestions: VehicleChecksQuestion[];
  activityCodeOptions: ActivityCodeModel[];

  constructor(
    public questionProvider: QuestionProvider,
    injector: Injector
  ) {
    super(injector);
    this.showMeQuestions = questionProvider.getShowMeQuestions(TestCategory.B);
    this.outcomeBehaviourProvider.setBehaviourMap(behaviourMap);
  }

  ngOnInit(): void {
    super.onInitialisation();
    const currentTest$ = this.store$.pipe(select(getTests), select(getCurrentTest));
    this.pageState = {
      ...this.commonPageState,
      displayShowMeQuestion$: currentTest$.pipe(
        select(getTestOutcome),
        withLatestFrom(currentTest$.pipe(select(getTestData), select(getVehicleChecks), select(getShowMeQuestion))),
        map(([outcome, question]) => this.outcomeBehaviourProvider.isVisible(outcome, 'showMeQuestion', question))
      ),
      displayTellMeQuestion$: currentTest$.pipe(
        select(getTestOutcome),
        withLatestFrom(currentTest$.pipe(select(getTestData), select(getVehicleChecks), select(getTellMeQuestion))),
        map(([outcome, question]) => this.outcomeBehaviourProvider.isVisible(outcome, 'tellMeQuestion', question))
      ),
      showMeQuestion$: currentTest$.pipe(select(getTestData), select(getVehicleChecks), select(getShowMeQuestion)),
      showMeQuestionOptions$: currentTest$.pipe(
        select(getTestOutcome),
        map((outcome) => getShowMeQuestionOptions(this.showMeQuestions, outcome, this.outcomeBehaviourProvider))
      ),
      tellMeQuestionText$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecks),
        select(getSelectedTellMeQuestionText)
      ),
      etaFaults$: currentTest$.pipe(select(getTestData), select(getETA), select(getETAFaultText)),
      ecoFaults$: currentTest$.pipe(select(getTestData), select(getEco), select(getEcoFaultText)),
      displayDrivingFaultComments$: currentTest$.pipe(
        select(getTestData),
        map((data) =>
          this.faultCountProvider.shouldDisplayDrivingFaultComments(data, TestCategory.B, OfficeCatBPage.maxFaultCount)
        )
      ),
    };

    this.setupSubscriptions();
  }

  async ionViewWillEnter() {
    super.ionViewWillEnter();

    if (!this.isPracticeMode && super.isIos()) {
      await this.deviceProvider.disableSingleAppMode();
    }
  }

  showMeQuestionChanged(showMeQuestion: VehicleChecksQuestion): void {
    this.store$.dispatch(ShowMeQuestionSelected(showMeQuestion));
  }

  dangerousFaultCommentChanged(dangerousFaultComment: FaultSummary) {
    if (dangerousFaultComment.source === CommentSource.SIMPLE) {
      this.store$.dispatch(
        AddDangerousFaultComment(dangerousFaultComment.competencyIdentifier, dangerousFaultComment.comment)
      );
    } else if (startsWith(dangerousFaultComment.source, CommentSource.MANOEUVRES)) {
      const segments = dangerousFaultComment.source.split('-');
      const fieldName = segments[1];
      const controlOrObservation = segments[2];
      this.store$.dispatch(
        AddManoeuvreComment(fieldName, CompetencyOutcome.D, controlOrObservation, dangerousFaultComment.comment)
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
        AddSeriousFaultComment(seriousFaultComment.competencyIdentifier, seriousFaultComment.comment)
      );
    } else if (startsWith(seriousFaultComment.source, CommentSource.MANOEUVRES)) {
      const segments = seriousFaultComment.source.split('-');
      const fieldName = segments[1];
      const controlOrObservation = segments[2];
      this.store$.dispatch(
        AddManoeuvreComment(fieldName, CompetencyOutcome.S, controlOrObservation, seriousFaultComment.comment)
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
        AddDrivingFaultComment(drivingFaultComment.competencyIdentifier, drivingFaultComment.comment)
      );
    } else if (startsWith(drivingFaultComment.source, CommentSource.MANOEUVRES)) {
      const segments = drivingFaultComment.source.split('-');
      const fieldName = segments[1];
      const controlOrObservation = segments[2];
      this.store$.dispatch(
        AddManoeuvreComment(fieldName, CompetencyOutcome.DF, controlOrObservation, drivingFaultComment.comment)
      );
    } else if (drivingFaultComment.source === CommentSource.CONTROLLED_STOP) {
      this.store$.dispatch(AddControlledStopComment(drivingFaultComment.comment));
    } else if (drivingFaultComment.source === CommentSource.VEHICLE_CHECKS) {
      this.store$.dispatch(AddShowMeTellMeComment(drivingFaultComment.comment));
    }
  }
}
