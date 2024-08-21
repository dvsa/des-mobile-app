import { Component, Injector, OnInit } from '@angular/core';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { select } from '@ngrx/store';
import { behaviourMap } from '@pages/office/office-behaviour-map.cat-adi-part3';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { ExaminerRole } from '@providers/app-config/constants/examiner-role.constants';
import {
  CommonOfficePageState,
  OfficeBasePageComponent,
} from '@shared/classes/test-flow-base-pages/office/office-base-page';
import { getActivityCodeOptions } from '@shared/constants/activity-code/activity-code.constants';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import { getCandidatePrn } from '@store/tests/journal-data/common/candidate/candidate.selector';
import { getReview } from '@store/tests/test-data/cat-adi-part3/review/review.reducer';
import { getGrade } from '@store/tests/test-data/cat-adi-part3/review/review.selector';
import { getTestData } from '@store/tests/test-data/cat-adi-part3/test-data.cat-adi-part3.reducer';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getJournalData } from '@store/tests/tests.selector';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface CatADI3OfficePageState {
  testOutcomeGrade$: Observable<string>;
  isStandardsCheck$: Observable<boolean>;
  prn$: Observable<number>;
}

type OfficePageState = CommonOfficePageState & CatADI3OfficePageState;

@Component({
  selector: 'app-office-cat-adi-part3',
  templateUrl: './office.cat-adi-part3.page.html',
  styleUrls: ['../../office/office.page.scss'],
})
export class OfficeCatADI3Page extends OfficeBasePageComponent implements OnInit {
  pageState: OfficePageState;

  constructor(
    private appConfig: AppConfigProvider,
    injector: Injector
  ) {
    super(injector);
    this.outcomeBehaviourProvider.setBehaviourMap(behaviourMap);
    this.activityCodeOptions = getActivityCodeOptions(this.appConfig.getAppConfig()?.role === ExaminerRole.DLG, true);
  }

  ngOnInit(): void {
    super.onInitialisation();

    const currentTest$ = this.store$.pipe(select(getTests), select(getCurrentTest));

    this.pageState = {
      ...this.commonPageState,
      testOutcomeGrade$: currentTest$.pipe(select(getTestData), select(getReview), select(getGrade)),
      isStandardsCheck$: currentTest$.pipe(
        select(getTestCategory),
        map((category) => isAnyOf(category, [TestCategory.SC]))
      ),
      prn$: currentTest$.pipe(select(getJournalData), select(getCandidate), select(getCandidatePrn)),
    };

    super.setupSubscriptions();
  }

  async ionViewWillEnter() {
    super.ionViewWillEnter();

    if (!this.isPracticeMode && super.isIos()) {
      await this.deviceProvider.disableSingleAppMode();
    }
  }
}
