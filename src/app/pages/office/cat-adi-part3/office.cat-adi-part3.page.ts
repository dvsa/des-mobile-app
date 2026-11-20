import { NgClass } from '@angular/common';
import { Component, OnInit, computed } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivityCodeComponent } from '@components/common/activity-code/activity-code';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
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
import { behaviourMap } from '@pages/office/office-behaviour-map.cat-adi-part3';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { ExaminerRole } from '@providers/app-config/constants/examiner-role.constants';
import { OfficeBasePageComponent } from '@shared/classes/test-flow-base-pages/office/office-base-page';
import { getActivityCodeOptions } from '@shared/constants/activity-code/activity-code.constants';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import { getCandidatePrn } from '@store/tests/journal-data/common/candidate/candidate.selector';
import { getReview } from '@store/tests/test-data/cat-adi-part3/review/review.reducer';
import { getGrade } from '@store/tests/test-data/cat-adi-part3/review/review.selector';
import { getTestData } from '@store/tests/test-data/cat-adi-part3/test-data.cat-adi-part3.reducer';
import { getJournalData, selectCurrentTest } from '@store/tests/tests.selector';
import { AdditionalInformationComponent } from '../components/additional-information/additional-information';
import { AlternateEvidenceDescriptionComponent } from '../components/alternate-mot-evidence-description/alternate-evidence-description.component';
import { AlternateEvidenceProvidedComponent } from '../components/alternate-mot-evidence-provided/alternate-evidence-provided.component';
import { CandidateSectionComponent } from '../components/candidate-section/candidate-section';
import { OfficeFooterComponent } from '../components/office-footer/office-footer.component';
import { OfficeRegistrationAndMotComponent } from '../components/office-registration-and-mot/office-registration-and-mot.component';
import { ReasonForEnteringTeamsComponent } from '../components/reason-for-entering-teams/reason-for-entering-teams';

@Component({
  selector: 'app-office-cat-adi-part3',
  templateUrl: './office.cat-adi-part3.page.html',
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
    ActivityCodeComponent,
    OfficeRegistrationAndMotComponent,
    AlternateEvidenceProvidedComponent,
    AlternateEvidenceDescriptionComponent,
    AdditionalInformationComponent,
    ReasonForEnteringTeamsComponent,
    IonFooter,
    OfficeFooterComponent,
  ],
})
export class OfficeCatADI3Page extends OfficeBasePageComponent implements OnInit {
  currentTest = this.store$.selectSignal(selectCurrentTest);
  testOutcomeGrade = computed(() => getGrade(getReview(getTestData(this.currentTest()))));
  isStandardsCheck = computed(() => isAnyOf(getTestCategory(this.currentTest()), [TestCategory.SC]));
  prn = computed(() => getCandidatePrn(getCandidate(getJournalData(this.currentTest() as never))));

  constructor(private appConfig: AppConfigProvider) {
    super();
    this.outcomeBehaviourProvider.setBehaviourMap(behaviourMap);
    this.activityCodeOptions = getActivityCodeOptions(this.appConfig.getAppConfig()?.role === ExaminerRole.DLG, true);
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
}
