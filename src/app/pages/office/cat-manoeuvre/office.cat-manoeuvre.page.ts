import { Component, Injector, OnInit } from '@angular/core';
import { merge, Observable, Subscription } from 'rxjs';
import { map, take, withLatestFrom } from 'rxjs/operators';
import { UntypedFormGroup } from '@angular/forms';
import { select } from '@ngrx/store';
import { startsWith } from 'lodash';

import {
  CommonOfficePageState,
  OfficeBasePageComponent,
} from '@shared/classes/test-flow-base-pages/office/office-base-page';
import { behaviourMap } from '@pages/office/office-behaviour-map.cat-cm';
import { getActivityCodeOptions } from '@shared/constants/activity-code/activity-code.constants';
import { ExaminerRole } from '@providers/app-config/constants/examiner-role.constants';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { TestOutcome } from '@store/tests/tests.constants';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { CommentSource, FaultSummary } from '@shared/models/fault-marking.model';
import { PassCertificateNumberChanged } from '@store/tests/pass-completion/pass-completion.actions';
import { PassCertificateNumberReceived } from '@store/tests/post-test-declarations/post-test-declarations.actions';
import { getCommunicationPreference } from '@store/tests/communication-preferences/communication-preferences.reducer';
import { getConductedLanguage } from '@store/tests/communication-preferences/communication-preferences.selector';
import { getDelegatedTestIndicator } from '@store/tests/delegated-test/delegated-test.reducer';
import { isDelegatedTest } from '@store/tests/delegated-test/delegated-test.selector';
import { AddDangerousFaultComment } from '@store/tests/test-data/common/dangerous-faults/dangerous-faults.actions';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { AddManoeuvreComment } from '@store/tests/test-data/common/manoeuvres/manoeuvres.actions';
import { AddSeriousFaultComment } from '@store/tests/test-data/common/serious-faults/serious-faults.actions';
import { AddUncoupleRecoupleComment } from '@store/tests/test-data/common/uncouple-recouple/uncouple-recouple.actions';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { getTestCategory } from '@store/tests/category/category.reducer';

interface CatManoeuvreOfficePageState {
  delegatedTest$: Observable<boolean>;
  conductedLanguage$: Observable<string>;
}

type OfficePageState = CommonOfficePageState & CatManoeuvreOfficePageState;

@Component({
  selector: '.office-cat-manoeuvre-page',
  templateUrl: './office.cat-manoeuvre.page.html',
  styleUrls: ['../office.page.scss'],
})
export class OfficeCatManoeuvrePage extends OfficeBasePageComponent implements OnInit {

  pageState: OfficePageState;
  pageSubscription: Subscription;
  form: UntypedFormGroup;
  testOutcomeText: string;
  conductedLanguage: string;
  isDelegated: boolean;

  constructor(
    private appConfig: AppConfigProvider,
    injector: Injector,
  ) {
    super(injector);
    this.outcomeBehaviourProvider.setBehaviourMap(behaviourMap);
    this.activityCodeOptions = getActivityCodeOptions(this.appConfig.getAppConfig()?.role === ExaminerRole.DLG);
  }

  ngOnInit(): void {
    super.onInitialisation();

    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    this.pageState = {
      ...this.commonPageState,
      conductedLanguage$: currentTest$.pipe(
        select(getCommunicationPreference),
        select(getConductedLanguage),
      ),
      delegatedTest$: currentTest$.pipe(
        select(getDelegatedTestIndicator),
        select(isDelegatedTest),
      ),
      dangerousFaults$: currentTest$.pipe(
        select(getTestData),
        withLatestFrom(currentTest$.pipe(select(getTestCategory))),
        take(1),
        map(([testData, category]) =>
          this.faultSummaryProvider.getDangerousFaultsList(testData, category as TestCategory)),
      ),
      seriousFaults$: currentTest$.pipe(
        select(getTestData),
        withLatestFrom(currentTest$.pipe(select(getTestCategory))),
        take(1),
        map(([testData, category]) =>
          this.faultSummaryProvider.getSeriousFaultsList(testData, category as TestCategory)),
      ),
    };

    this.setupSubscription();
  }

  setupSubscription(): void {
    super.setupSubscriptions();

    const {
      testOutcomeText$,
      conductedLanguage$,
      delegatedTest$,
    } = this.pageState;

    this.pageSubscription = merge(
      conductedLanguage$.pipe(map((result) => this.conductedLanguage = result)),
      testOutcomeText$.pipe(map((result) => this.testOutcomeText = result)),
      delegatedTest$.pipe(map((result) => this.isDelegated = result)),
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

  isPass(): boolean {
    return this.testOutcomeText === TestOutcome.Passed;
  }

  isWelsh(): boolean {
    return this.conductedLanguage === Language.CYMRAEG;
  }

  passCertificateNumberChanged(passCertificateNumber: string): void {
    this.store$.dispatch(PassCertificateNumberChanged(passCertificateNumber));
    this.store$.dispatch(PassCertificateNumberReceived(this.form.get('passCertificateNumberCtrl').valid));
  }

  dangerousFaultCommentChanged(dangerousFaultComment: FaultSummary): void {
    if (dangerousFaultComment.source === CommentSource.SIMPLE) {
      this.store$.dispatch(
        AddDangerousFaultComment(dangerousFaultComment.competencyIdentifier, dangerousFaultComment.comment),
      );
    } else if (startsWith(dangerousFaultComment.source, CommentSource.MANOEUVRES)) {
      const segments = dangerousFaultComment.source.split('-');
      const fieldName = segments[1];
      const controlOrObservation = segments[2];
      this.store$.dispatch(AddManoeuvreComment(
        fieldName,
        CompetencyOutcome.D,
        controlOrObservation,
        dangerousFaultComment.comment,
      ));
    } else if (dangerousFaultComment.source === CommentSource.UNCOUPLE_RECOUPLE) {
      this.store$.dispatch(AddUncoupleRecoupleComment(dangerousFaultComment.comment));
    }
  }

  seriousFaultCommentChanged(seriousFaultComment: FaultSummary): void {
    if (seriousFaultComment.source === CommentSource.SIMPLE) {
      this.store$.dispatch(
        AddSeriousFaultComment(seriousFaultComment.competencyIdentifier, seriousFaultComment.comment),
      );
    } else if (startsWith(seriousFaultComment.source, CommentSource.MANOEUVRES)) {
      const segments = seriousFaultComment.source.split('-');
      const fieldName = segments[1];
      const controlOrObservation = segments[2];
      this.store$.dispatch(AddManoeuvreComment(
        fieldName,
        CompetencyOutcome.S,
        controlOrObservation,
        seriousFaultComment.comment,
      ));
    } else if (seriousFaultComment.source === CommentSource.UNCOUPLE_RECOUPLE) {
      this.store$.dispatch(AddUncoupleRecoupleComment(seriousFaultComment.comment));
    }
  }
}
