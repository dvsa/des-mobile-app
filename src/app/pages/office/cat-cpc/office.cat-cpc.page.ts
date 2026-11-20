import { NgClass } from '@angular/common';
import { Component, OnInit, computed } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivityCodeComponent } from '@components/common/activity-code/activity-code';
import { CPCDebriefCardComponent } from '@components/common/cpc-debrief-card/cpc-debrief-card';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { DebriefWitnessedComponent } from '@components/test-finalisation/debrief-witnessed/debrief-witnessed';
import { LanguagePreferencesComponent } from '@components/test-finalisation/language-preference/language-preference';
import { CombinationCodes } from '@dvsa/mes-test-schema/categories/CPC';
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
import { behaviourMap } from '@pages/office/office-behaviour-map.cat-cpc';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { ExaminerRole } from '@providers/app-config/constants/examiner-role.constants';
import { OfficeBasePageComponent } from '@shared/classes/test-flow-base-pages/office/office-base-page';
import { ActivityCodeModel, getActivityCodeOptions } from '@shared/constants/activity-code/activity-code.constants';
import { Combination, questionCombinations } from '@shared/constants/cpc-questions/cpc-question-combinations.constants';
import { TestOutcome } from '@shared/models/test-outcome';
import { PassCertificateNumberChanged } from '@store/tests/pass-completion/pass-completion.actions';
import { PassCertificateNumberReceived } from '@store/tests/post-test-declarations/post-test-declarations.actions';
import { getPostTestDeclarations } from '@store/tests/post-test-declarations/post-test-declarations.reducer';
import { getReceiptDeclarationStatus } from '@store/tests/post-test-declarations/post-test-declarations.selector';
import { getTestData } from '@store/tests/test-data/cat-cpc/test-data.cat-cpc.reducer';
import {
  getCombination,
  getQuestion1,
  getQuestion2,
  getQuestion3,
  getQuestion4,
  getQuestion5,
  getTotalPercent,
} from '@store/tests/test-data/cat-cpc/test-data.cat-cpc.selector';
import { AssessmentReportChanged } from '@store/tests/test-summary/cat-cpc/test-summary.cat-cpc.actions';
import { getTestSummary } from '@store/tests/test-summary/cat-cpc/test-summary.cat-cpc.reducer';
import { getAssessmentReport } from '@store/tests/test-summary/cat-cpc/test-summary.cat-cpc.selector';
import { getTestOutcome as getTestOutcomeDebrief } from '../../debrief/debrief.selector';
import { PassCertificateNumberComponent } from '../../pass-finalisation/components/pass-certificate-number/pass-certificate-number';
import { AccompanimentCardCatCPCComponent } from '../../waiting-room-to-car/cat-cpc/components/accompaniment-card/accompaniment-card.cat-cpc';
import { AdditionalInformationComponent } from '../components/additional-information/additional-information';
import { AlternateEvidenceDescriptionComponent } from '../components/alternate-mot-evidence-description/alternate-evidence-description.component';
import { AlternateEvidenceProvidedComponent } from '../components/alternate-mot-evidence-provided/alternate-evidence-provided.component';
import { CandidateDescriptionComponent } from '../components/candidate-description/candidate-description';
import { CandidateSectionComponent } from '../components/candidate-section/candidate-section';
import { DateOfTest } from '../components/date-of-test/date-of-test';
import { IdentificationComponent } from '../components/identification/identification';
import { OfficeFooterComponent } from '../components/office-footer/office-footer.component';
import { OfficeRegistrationAndMotComponent } from '../components/office-registration-and-mot/office-registration-and-mot.component';
import { ReasonForEnteringTeamsComponent } from '../components/reason-for-entering-teams/reason-for-entering-teams';
import { TrueLikenessComponent } from '../components/true-likeness/true-likeness';
import { AssessmentReportComponent } from './components/assessment-report/assessment-report';
import { CombinationComponent } from './components/combination/combination';
import { PassCertificateDeclarationComponent } from './components/pass-certificate-declaration/pass-certificate-declaration';

@Component({
  standalone: true,
  selector: '.office-cat-cpc-page',
  templateUrl: './office.cat-cpc.page.html',
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
    PassCertificateDeclarationComponent,
    LanguagePreferencesComponent,
    DebriefWitnessedComponent,
    TrueLikenessComponent,
    CandidateDescriptionComponent,
    IdentificationComponent,
    OfficeRegistrationAndMotComponent,
    AlternateEvidenceProvidedComponent,
    AlternateEvidenceDescriptionComponent,
    AdditionalInformationComponent,
    ReasonForEnteringTeamsComponent,
    AccompanimentCardCatCPCComponent,
    CombinationComponent,
    AssessmentReportComponent,
    CPCDebriefCardComponent,
    IonFooter,
    OfficeFooterComponent,
  ],
})
export class OfficeCatCPCPage extends OfficeBasePageComponent implements OnInit {
  assessmentReport = computed(() => getAssessmentReport(getTestSummary(this.officeCurrentTest() as never) as never));
  overallScore = computed(() => getTotalPercent(getTestData(this.officeCurrentTest() as never) as never));
  question1 = computed(() => getQuestion1(getTestData(this.officeCurrentTest() as never) as never));
  question2 = computed(() => getQuestion2(getTestData(this.officeCurrentTest() as never) as never));
  question3 = computed(() => getQuestion3(getTestData(this.officeCurrentTest() as never) as never));
  question4 = computed(() => getQuestion4(getTestData(this.officeCurrentTest() as never) as never));
  question5 = computed(() => getQuestion5(getTestData(this.officeCurrentTest() as never) as never));
  combination = computed(() => getCombination(getTestData(this.officeCurrentTest() as never) as never));
  passCertificateNumberReceived = computed(() =>
    getReceiptDeclarationStatus(getPostTestDeclarations(this.officeCurrentTest() as never) as never)
  );
  form: UntypedFormGroup;
  get outcome(): TestOutcome {
    return getTestOutcomeDebrief(this.officeCurrentTest() as never) as TestOutcome;
  }
  activityCodeOptions: ActivityCodeModel[];

  constructor(private appConfig: AppConfigProvider) {
    super();
    this.outcomeBehaviourProvider.setBehaviourMap(behaviourMap);
    this.activityCodeOptions = getActivityCodeOptions(this.appConfig.getAppConfig()?.role === ExaminerRole.DLG);
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

  assessmentReportChanged(assessmentReport: string): void {
    this.store$.dispatch(AssessmentReportChanged(assessmentReport));
  }

  getCombinationAdditionalText(combinationCodes: CombinationCodes): string {
    const question: Combination = questionCombinations.find(({ code }) => code === combinationCodes);

    return question?.additionalText || null;
  }

  passCertificateNumberChanged(passCertificateNumber: string): void {
    this.store$.dispatch(PassCertificateNumberChanged(passCertificateNumber));

    if (!this.isDelegated) {
      this.store$.dispatch(PassCertificateNumberReceived(this.form.get('passCertificateNumberCtrl').valid));
    }
  }

  passCertificateDeclarationChanged(passCertificateSigned: boolean): void {
    this.store$.dispatch(PassCertificateNumberReceived(passCertificateSigned));
  }

  isFail(): boolean {
    return this.outcome === TestOutcome.FAIL;
  }

  isPass(): boolean {
    return this.outcome === TestOutcome.PASS;
  }
}
