import { AsyncPipe, NgClass } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { GearboxCategory } from '@dvsa/mes-test-schema/categories/common';
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
import {
  CommonPassFinalisationPageState,
  PassFinalisationPageComponent,
} from '@shared/classes/test-flow-base-pages/pass-finalisation/pass-finalisation-base-page';
import { TransmissionType } from '@shared/models/transmission-type';
import { PersistTests } from '@store/tests/tests.actions';
import { Observable, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { BikeCategoryTypeComponent } from '../../../../components/common/bike-category-type/bike-category-type';
import { TestFlowHeaderComponent } from '../../../../components/common/test-flow-header/test-flow-header.component';
import { TransmissionComponent } from '../../../../components/common/transmission/transmission';
import { WarningBannerComponent } from '../../../../components/common/warning-banner/warning-banner';
import { D255Component } from '../../../../components/test-finalisation/d255/d255';
import { DebriefWitnessedComponent } from '../../../../components/test-finalisation/debrief-witnessed/debrief-witnessed';
import { FinalisationHeaderComponent } from '../../../../components/test-finalisation/finalisation-header/finalisation-header';
import { LanguagePreferencesComponent } from '../../../../components/test-finalisation/language-preference/language-preference';
import { behaviourMap } from '../../office/office-behaviour-map.cat-a-mod2';
import { ApplicationReferenceComponent } from '../components/application-reference/application-reference';
import { LicenceProvidedWarningBannerComponent } from '../components/licence-provided-warning-banner/licence-provided-warning-banner';
import { LicenseProvidedComponent } from '../components/license-provided/license-provided';
import { PassCertificateNumberComponent } from '../components/pass-certificate-number/pass-certificate-number';

type PassFinalisationPageState = CommonPassFinalisationPageState;

@Component({
  selector: 'app-pass-finalisation-cat-a-mod2',
  templateUrl: './pass-finalisation.cat-a-mod2.page.html',
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
    BikeCategoryTypeComponent,
    LicenseProvidedComponent,
    LicenceProvidedWarningBannerComponent,
    TransmissionComponent,
    WarningBannerComponent,
    PassCertificateNumberComponent,
    D255Component,
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
export class PassFinalisationCatAMod2Page extends PassFinalisationPageComponent implements OnInit {
  pageState: PassFinalisationPageState;
  form: UntypedFormGroup;
  merged$: Observable<string | boolean>;
  transmission: GearboxCategory;

  constructor(injector: Injector) {
    super(injector);
    this.form = new UntypedFormGroup({});
    this.outcomeBehaviourProvider.setBehaviourMap(behaviourMap);
  }

  ngOnInit(): void {
    super.onInitialisation();

    this.pageState = {
      ...this.commonPageState,
    };

    const { transmission$ } = this.pageState;

    this.merged$ = merge(transmission$.pipe(map((value) => (this.transmission = value))));
  }

  ionViewWillEnter(): boolean {
    super.ionViewWillEnter();
    this.store$.dispatch(PassFinalisationViewDidEnter());

    if (this.merged$) {
      this.subscription = this.merged$.subscribe();
    }
    return true;
  }

  displayTransmissionBanner(): boolean {
    return !this.form.controls.transmissionCtrl.pristine && this.transmission === TransmissionType.Automatic;
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
