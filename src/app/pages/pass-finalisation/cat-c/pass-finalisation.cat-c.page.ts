import { NgClass } from '@angular/common';
import { Component, OnInit, Signal, computed } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { TransmissionComponent } from '@components/common/transmission/transmission';
import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
import { D255Component } from '@components/test-finalisation/d255/d255';
import { DebriefWitnessedComponent } from '@components/test-finalisation/debrief-witnessed/debrief-witnessed';
import { FinalisationHeaderComponent } from '@components/test-finalisation/finalisation-header/finalisation-header';
import { LanguagePreferencesComponent } from '@components/test-finalisation/language-preference/language-preference';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import {
  IonButton,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonRow,
  IonText,
  IonToolbar,
} from '@ionic/angular';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { PASS_CERTIFICATE_NUMBER_CTRL } from '@pages/pass-finalisation/components/pass-certificate-number/pass-certificate-number.constants';
import {
  PassFinalisationReportActivityCode,
  PassFinalisationValidationError,
  PassFinalisationViewDidEnter,
} from '@pages/pass-finalisation/pass-finalisation.actions';
import { PassFinalisationPageComponent } from '@shared/classes/test-flow-base-pages/pass-finalisation/pass-finalisation-base-page';
import { TransmissionType } from '@shared/models/transmission-type';
import { getPassCompletion } from '@store/tests/pass-completion/cat-c/pass-completion.cat-c.reducer';
import { getCode78 } from '@store/tests/pass-completion/cat-c/pass-completion.cat-c.selector';
import { PersistTests } from '@store/tests/tests.actions';
import { behaviourMap } from '../../office/office-behaviour-map.cat-c';
import { ApplicationReferenceComponent } from '../components/application-reference/application-reference';
import { Code78Component } from '../components/code-78/code-78';
import { LicenceProvidedWarningBannerComponent } from '../components/licence-provided-warning-banner/licence-provided-warning-banner';
import { LicenseProvidedComponent } from '../components/license-provided/license-provided';
import { PassCertificateNumberComponent } from '../components/pass-certificate-number/pass-certificate-number';

@Component({
  selector: 'app-pass-finalisation-cat-c',
  templateUrl: './pass-finalisation.cat-c.page.html',
  styleUrls: ['./../pass-finalisation.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    NgClass,
    TestFlowHeaderComponent,
    IonContent,
    FormsModule,
    ReactiveFormsModule,
    IonGrid,
    FinalisationHeaderComponent,
    ApplicationReferenceComponent,
    LicenseProvidedComponent,
    LicenceProvidedWarningBannerComponent,
    WarningBannerComponent,
    TransmissionComponent,
    Code78Component,
    PassCertificateNumberComponent,
    D255Component,
    LanguagePreferencesComponent,
    DebriefWitnessedComponent,
    IonFooter,
    IonRow,
    IonCol,
    IonButton,
    IonText,
  ],
})
export class PassFinalisationCatCPage extends PassFinalisationPageComponent implements OnInit {
  form: UntypedFormGroup;
  manualMessage = 'A <strong><em>manual</em></strong> licence will be issued';
  automaticMessage = 'An <strong><em>automatic</em></strong> licence will be issued';
  askCandidateLicenseMessage = "Check that the candidate doesn't need their driving licence (e.g CPC Mod4)";
  code78Present: Signal<boolean | null> = computed(() => {
    const test = this.currentTest();
    return test ? getCode78(getPassCompletion(test as never) as never) : null;
  });
  testCategory: Signal<TestCategory> = computed(() => this.currentTest()?.category as TestCategory);

  constructor() {
    super();
    this.form = new UntypedFormGroup({});
    this.outcomeBehaviourProvider.setBehaviourMap(behaviourMap);
  }

  ngOnInit(): void {
    super.onInitialisation();
  }

  ionViewWillEnter(): boolean {
    super.ionViewWillEnter();
    this.store$.dispatch(PassFinalisationViewDidEnter());

    return true;
  }

  shouldShowCandidateDoesntNeedLicenseBanner(): boolean {
    return this.provisionalLicense();
  }

  shouldShowCode78Banner(): boolean {
    return this.code78Present() !== null && this.transmissionSignal() !== null;
  }

  shouldShowManualBanner(): boolean {
    if (this.shouldShowCode78Banner()) {
      return (
        this.transmissionSignal() === TransmissionType.Manual ||
        (this.transmissionSignal() === TransmissionType.Automatic && !this.code78Present())
      );
    }
    return false;
  }

  shouldShowAutomaticBanner(): boolean {
    if (this.shouldShowCode78Banner()) {
      return this.code78Present() && this.transmissionSignal() === TransmissionType.Automatic;
    }
    return false;
  }

  async onSubmit(): Promise<void> {
    Object.keys(this.form.controls).forEach((controlName) => this.form.controls[controlName].markAsDirty());

    if (this.form.valid) {
      this.store$.dispatch(PersistTests());
      this.store$.dispatch(PassFinalisationReportActivityCode(this.testOutcome));
      await this.routeByCat.navigateToPage(TestFlowPageNames.HEALTH_DECLARATION_PAGE);
      return;
    }

    Object.keys(this.form.controls).forEach((controlName) => {
      if (this.form.controls[controlName].invalid) {
        if (controlName === PASS_CERTIFICATE_NUMBER_CTRL) {
          this.store$.dispatch(PassFinalisationValidationError(`${controlName} is invalid`));
        }
        this.store$.dispatch(PassFinalisationValidationError(`${controlName} is blank`));
      }
    });
  }
}
