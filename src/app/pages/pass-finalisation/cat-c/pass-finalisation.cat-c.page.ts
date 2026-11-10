import { AsyncPipe, NgClass } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { TransmissionComponent } from '@components/common/transmission/transmission';
import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
import { D255Component } from '@components/test-finalisation/d255/d255';
import { DebriefWitnessedComponent } from '@components/test-finalisation/debrief-witnessed/debrief-witnessed';
import { FinalisationHeaderComponent } from '@components/test-finalisation/finalisation-header/finalisation-header';
import { LanguagePreferencesComponent } from '@components/test-finalisation/language-preference/language-preference';
import { GearboxCategory } from '@dvsa/mes-test-schema/categories/common';
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
import { select } from '@ngrx/store';
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
import { getPassCompletion } from '@store/tests/pass-completion/cat-c/pass-completion.cat-c.reducer';
import { getCode78 } from '@store/tests/pass-completion/cat-c/pass-completion.cat-c.selector';
import { PersistTests } from '@store/tests/tests.actions';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { Observable, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { behaviourMap } from '../../office/office-behaviour-map.cat-c';
import { ApplicationReferenceComponent } from '../components/application-reference/application-reference';
import { Code78Component } from '../components/code-78/code-78';
import { LicenceProvidedWarningBannerComponent } from '../components/licence-provided-warning-banner/licence-provided-warning-banner';
import { LicenseProvidedComponent } from '../components/license-provided/license-provided';
import { PassCertificateNumberComponent } from '../components/pass-certificate-number/pass-certificate-number';

interface CatCPassFinalisationPageState {
  code78$: Observable<boolean>;
}

type PassFinalisationPageState = CommonPassFinalisationPageState & CatCPassFinalisationPageState;

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
    AsyncPipe,
  ],
})
export class PassFinalisationCatCPage extends PassFinalisationPageComponent implements OnInit {
  pageState: PassFinalisationPageState;
  form: UntypedFormGroup;
  merged$: Observable<string | boolean>;
  manualMessage = 'A <strong><em>manual</em></strong> licence will be issued';
  automaticMessage = 'An <strong><em>automatic</em></strong> licence will be issued';
  askCandidateLicenseMessage = "Check that the candidate doesn't need their driving licence (e.g CPC Mod4)";
  transmission: GearboxCategory;
  code78Present: boolean = null;
  provisionalLicenseIsReceived: boolean;
  testCategory: TestCategory;

  constructor(injector: Injector) {
    super(injector);
    this.form = new UntypedFormGroup({});
    this.outcomeBehaviourProvider.setBehaviourMap(behaviourMap);
  }

  ngOnInit(): void {
    super.onInitialisation();

    const currentTest$ = this.store$.pipe(select(getTests), select(getCurrentTest));

    this.pageState = {
      ...this.commonPageState,
      code78$: currentTest$.pipe(select(getPassCompletion), select(getCode78)),
    };

    const { transmission$, code78$, provisionalLicense$, testCategory$ } = this.pageState;

    this.merged$ = merge(
      transmission$.pipe(map((value) => (this.transmission = value))),
      code78$.pipe(map((value) => (this.code78Present = value))),
      provisionalLicense$.pipe(map((value) => (this.provisionalLicenseIsReceived = value))),
      testCategory$.pipe(map((value) => (this.testCategory = value as TestCategory)))
    );
  }

  ionViewWillEnter(): boolean {
    super.ionViewWillEnter();
    this.store$.dispatch(PassFinalisationViewDidEnter());

    if (this.merged$) {
      this.subscription = this.merged$.subscribe();
    }
    return true;
  }

  shouldShowCandidateDoesntNeedLicenseBanner(): boolean {
    return this.provisionalLicenseIsReceived;
  }

  shouldShowCode78Banner(): boolean {
    return this.code78Present !== null && this.transmission !== null;
  }

  shouldShowManualBanner(): boolean {
    if (this.shouldShowCode78Banner()) {
      return (
        this.transmission === TransmissionType.Manual ||
        (this.transmission === TransmissionType.Automatic && !this.code78Present)
      );
    }
    return false;
  }

  shouldShowAutomaticBanner(): boolean {
    if (this.shouldShowCode78Banner()) {
      return this.code78Present && this.transmission === TransmissionType.Automatic;
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
