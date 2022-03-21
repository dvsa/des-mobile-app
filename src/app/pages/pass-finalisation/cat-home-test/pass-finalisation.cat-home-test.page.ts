import { Component, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import {
  PassCertificateNumberChanged,
} from '@store/tests/pass-completion/pass-completion.actions';
import { Observable, Subscription } from 'rxjs';
import { PersistTests } from '@store/tests/tests.actions';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { behaviourMap } from '@pages/office/office-behaviour-map';
import { ActivityCodes } from '@shared/models/activity-codes';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import {
  PassFinalisationPageComponent,
} from '@shared/classes/test-flow-base-pages/pass-finalisation/pass-finalisation-base-page';
import { Router } from '@angular/router';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { PASS_CERTIFICATE_NUMBER_CTRL } from '../components/pass-certificate-number/pass-certificate-number.constants';
import {
  PassFinalisationViewDidEnter,
  PassFinalisationValidationError,
} from '../pass-finalisation.actions';
import { TestFlowPageNames } from '../../page-names.constants';

interface PassFinalisationPageState {
  candidateName$: Observable<string>;
  candidateUntitledName$: Observable<string>;
  candidateDriverNumber$: Observable<string>;
  testOutcomeText$: Observable<string>;
  applicationNumber$: Observable<string>;
  provisionalLicense$: Observable<boolean>;
  passCertificateNumber$: Observable<string>;
  d255$: Observable<boolean>;
  debriefWitnessed$: Observable<boolean>;
  conductedLanguage$: Observable<string>;
  eyesightTestFailed$: Observable<boolean>;
}

@Component({
  selector: 'app-pass-finalisation-cat-home-test',
  templateUrl: './pass-finalisation.cat-home-test.page.html',
  styleUrls: ['./../pass-finalisation.page.scss'],
})
export class PassFinalisationCatHomeTestPage extends PassFinalisationPageComponent {
  pageState: PassFinalisationPageState;
  passCertificateCtrl: string = PASS_CERTIFICATE_NUMBER_CTRL;
  // @ViewChild('passCertificateNumberInput')
  passCertificateNumberInput: ElementRef;
  testOutcome: string = ActivityCodes.PASS;
  form: FormGroup;
  merged$: Observable<string>;
  subscription: Subscription;

  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    public routeByCat: RouteByCategoryProvider,
    private outcomeBehaviourProvider: OutcomeBehaviourMapProvider,
  ) {
    super(platform, authenticationProvider, router, store$);
    this.form = new FormGroup({});
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
      // this.navController.push(CAT_HOME_TEST.HealthDeclarationPage);
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

  passCertificateNumberChanged(passCertificateNumber: string): void {
    this.store$.dispatch(PassCertificateNumberChanged(passCertificateNumber));
  }
}
