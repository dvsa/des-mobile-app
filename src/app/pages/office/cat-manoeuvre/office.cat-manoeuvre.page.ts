import { Component, Injector, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { select } from '@ngrx/store';
import { startsWith } from 'lodash-es';
import { Observable, Subscription, merge } from 'rxjs';
import { map, take, withLatestFrom } from 'rxjs/operators';

import { AsyncPipe, NgClass } from '@angular/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonRow,
  IonToolbar,
} from '@ionic/angular';
import { behaviourMap } from '@pages/office/office-behaviour-map.cat-cm';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { ExaminerRole } from '@providers/app-config/constants/examiner-role.constants';
import {
  CommonOfficePageState,
  OfficeBasePageComponent,
} from '@shared/classes/test-flow-base-pages/office/office-base-page';
import { getActivityCodeOptions } from '@shared/constants/activity-code/activity-code.constants';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { CommentSource, FaultSummary } from '@shared/models/fault-marking.model';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { getCommunicationPreference } from '@store/tests/communication-preferences/communication-preferences.reducer';
import { getConductedLanguage } from '@store/tests/communication-preferences/communication-preferences.selector';
import { PassCertificateNumberChanged } from '@store/tests/pass-completion/pass-completion.actions';
import { PassCertificateNumberReceived } from '@store/tests/post-test-declarations/post-test-declarations.actions';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import { AddDangerousFaultComment } from '@store/tests/test-data/common/dangerous-faults/dangerous-faults.actions';
import { AddManoeuvreComment } from '@store/tests/test-data/common/manoeuvres/manoeuvres.actions';
import { AddSeriousFaultComment } from '@store/tests/test-data/common/serious-faults/serious-faults.actions';
import { AddUncoupleRecoupleComment } from '@store/tests/test-data/common/uncouple-recouple/uncouple-recouple.actions';
import { TestOutcome } from '@store/tests/tests.constants';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { ActivityCodeComponent } from '../../../../components/common/activity-code/activity-code';
import { HealthDeclarationSignedComponent } from '../../../../components/common/health-declaration-signed/health-declaration-signed';
import { TestFlowHeaderComponent } from '../../../../components/common/test-flow-header/test-flow-header.component';
import { D255Component } from '../../../../components/test-finalisation/d255/d255';
import { DebriefWitnessedComponent } from '../../../../components/test-finalisation/debrief-witnessed/debrief-witnessed';
import { LanguagePreferencesComponent } from '../../../../components/test-finalisation/language-preference/language-preference';
import { PassCertificateNumberComponent } from '../../pass-finalisation/components/pass-certificate-number/pass-certificate-number';
import { AccompanimentCardComponent } from '../../waiting-room-to-car/components/accompaniment-card/accompaniment-card';
import { AdditionalInformationComponent } from '../components/additional-information/additional-information';
import { AlternateEvidenceDescriptionComponent } from '../components/alternate-mot-evidence-description/alternate-evidence-description.component';
import { AlternateEvidenceProvidedComponent } from '../components/alternate-mot-evidence-provided/alternate-evidence-provided.component';
import { CandidateDescriptionComponent } from '../components/candidate-description/candidate-description';
import { CandidateSectionComponent } from '../components/candidate-section/candidate-section';
import { DateOfTest } from '../components/date-of-test/date-of-test';
import { ECOCardComponent } from '../components/eco-card/eco-card.component';
import { ETACardComponent } from '../components/eta-card/eta-card.component';
import { FaultCommentCardComponent } from '../components/fault-comment-card/fault-comment-card';
import { IdentificationComponent } from '../components/identification/identification';
import { OfficeFooterComponent } from '../components/office-footer/office-footer.component';
import { OfficeRegistrationAndMotComponent } from '../components/office-registration-and-mot/office-registration-and-mot.component';
import { ReasonForEnteringTeamsComponent } from '../components/reason-for-entering-teams/reason-for-entering-teams';
import { TrueLikenessComponent } from '../components/true-likeness/true-likeness';
import { WeatherConditionsComponent } from '../components/weather-conditions/weather-conditions';

interface CatManoeuvreOfficePageState {
  conductedLanguage$: Observable<string>;
}

type OfficePageState = CommonOfficePageState & CatManoeuvreOfficePageState;

@Component({
  selector: '.office-cat-manoeuvre-page',
  templateUrl: './office.cat-manoeuvre.page.html',
  styleUrls: ['../office.page.scss'],
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
    IonRow,
    IonCol,
    ActivityCodeComponent,
    PassCertificateNumberComponent,
    HealthDeclarationSignedComponent,
    D255Component,
    LanguagePreferencesComponent,
    DebriefWitnessedComponent,
    TrueLikenessComponent,
    CandidateDescriptionComponent,
    IdentificationComponent,
    WeatherConditionsComponent,
    AccompanimentCardComponent,
    OfficeRegistrationAndMotComponent,
    AlternateEvidenceProvidedComponent,
    AlternateEvidenceDescriptionComponent,
    AdditionalInformationComponent,
    ReasonForEnteringTeamsComponent,
    ETACardComponent,
    ECOCardComponent,
    FaultCommentCardComponent,
    IonFooter,
    OfficeFooterComponent,
    AsyncPipe,
  ],
})
export class OfficeCatManoeuvrePage extends OfficeBasePageComponent implements OnInit {
  pageState: OfficePageState;
  pageSubscription: Subscription;
  form: UntypedFormGroup;
  testOutcomeText: string;
  conductedLanguage: string;

  constructor(
    private appConfig: AppConfigProvider,
    injector: Injector
  ) {
    super(injector);
    this.outcomeBehaviourProvider.setBehaviourMap(behaviourMap);
    this.activityCodeOptions = getActivityCodeOptions(this.appConfig.getAppConfig()?.role === ExaminerRole.DLG);
  }

  ngOnInit(): void {
    super.onInitialisation();

    const currentTest$ = this.store$.pipe(select(getTests), select(getCurrentTest));

    this.pageState = {
      ...this.commonPageState,
      conductedLanguage$: currentTest$.pipe(select(getCommunicationPreference), select(getConductedLanguage)),
      dangerousFaults$: currentTest$.pipe(
        select(getTestData),
        withLatestFrom(currentTest$.pipe(select(getTestCategory))),
        take(1),
        map(([testData, category]) =>
          this.faultSummaryProvider.getDangerousFaultsList(testData, category as TestCategory)
        )
      ),
      seriousFaults$: currentTest$.pipe(
        select(getTestData),
        withLatestFrom(currentTest$.pipe(select(getTestCategory))),
        take(1),
        map(([testData, category]) =>
          this.faultSummaryProvider.getSeriousFaultsList(testData, category as TestCategory)
        )
      ),
    };

    this.setupSubscription();
  }

  setupSubscription(): void {
    super.setupSubscriptions();

    const { testOutcomeText$, conductedLanguage$ } = this.pageState;

    this.pageSubscription = merge(
      conductedLanguage$.pipe(map((result) => (this.conductedLanguage = result))),
      testOutcomeText$.pipe(map((result) => (this.testOutcomeText = result)))
    ).subscribe();
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
        AddDangerousFaultComment(dangerousFaultComment.competencyIdentifier, dangerousFaultComment.comment)
      );
    } else if (startsWith(dangerousFaultComment.source, CommentSource.MANOEUVRES)) {
      const segments = dangerousFaultComment.source.split('-');
      const fieldName = segments[1];
      const controlOrObservation = segments[2];
      this.store$.dispatch(
        AddManoeuvreComment(fieldName, CompetencyOutcome.D, controlOrObservation, dangerousFaultComment.comment)
      );
    } else if (dangerousFaultComment.source === CommentSource.UNCOUPLE_RECOUPLE) {
      this.store$.dispatch(AddUncoupleRecoupleComment(dangerousFaultComment.comment));
    }
  }

  seriousFaultCommentChanged(seriousFaultComment: FaultSummary): void {
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
    } else if (seriousFaultComment.source === CommentSource.UNCOUPLE_RECOUPLE) {
      this.store$.dispatch(AddUncoupleRecoupleComment(seriousFaultComment.comment));
    }
  }
}
