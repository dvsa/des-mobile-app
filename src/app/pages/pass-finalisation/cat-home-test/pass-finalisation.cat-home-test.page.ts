import { AsyncPipe, NgClass } from '@angular/common';
import { Component, Injector } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
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
import { behaviourMap } from '@pages/office/office-behaviour-map.cat-home-test';
import {
  CommonPassFinalisationPageState,
  PassFinalisationPageComponent,
} from '@shared/classes/test-flow-base-pages/pass-finalisation/pass-finalisation-base-page';
import { PersistTests } from '@store/tests/tests.actions';
import { TestFlowHeaderComponent } from '../../../../components/common/test-flow-header/test-flow-header.component';
import { WarningBannerComponent } from '../../../../components/common/warning-banner/warning-banner';
import { D255Component } from '../../../../components/test-finalisation/d255/d255';
import { DebriefWitnessedComponent } from '../../../../components/test-finalisation/debrief-witnessed/debrief-witnessed';
import { FinalisationHeaderComponent } from '../../../../components/test-finalisation/finalisation-header/finalisation-header';
import { LanguagePreferencesComponent } from '../../../../components/test-finalisation/language-preference/language-preference';
import { TestFlowPageNames } from '../../page-names.constants';
import { ApplicationReferenceComponent } from '../components/application-reference/application-reference';
import { LicenceProvidedWarningBannerComponent } from '../components/licence-provided-warning-banner/licence-provided-warning-banner';
import { LicenseProvidedComponent } from '../components/license-provided/license-provided';
import { PassCertificateNumberComponent } from '../components/pass-certificate-number/pass-certificate-number';
import { PASS_CERTIFICATE_NUMBER_CTRL } from '../components/pass-certificate-number/pass-certificate-number.constants';
import {
  PassFinalisationReportActivityCode,
  PassFinalisationValidationError,
  PassFinalisationViewDidEnter,
} from '../pass-finalisation.actions';

type PassFinalisationPageState = CommonPassFinalisationPageState;

@Component({
  selector: 'app-pass-finalisation-cat-home-test',
  templateUrl: './pass-finalisation.cat-home-test.page.html',
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
    PassCertificateNumberComponent,
    D255Component,
    WarningBannerComponent,
    LanguagePreferencesComponent,
    DebriefWitnessedComponent,
    IonFooter,
    IonRow,
    IonCol,
    IonButton,
    IonText,
    AsyncPipe,
  ],
})
export class PassFinalisationCatHomeTestPage extends PassFinalisationPageComponent {
  pageState: PassFinalisationPageState;
  form: UntypedFormGroup;

  constructor(injector: Injector) {
    super(injector);
    this.form = new UntypedFormGroup({});
    this.outcomeBehaviourProvider.setBehaviourMap(behaviourMap);
  }

  ngOnInit(): void {
    super.onInitialisation();

    this.pageState = { ...this.commonPageState };
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(PassFinalisationViewDidEnter());
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
