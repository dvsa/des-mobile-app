import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription, merge } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { GearboxCategory } from '@dvsa/mes-test-schema/categories/common';
import { Router } from '@angular/router';
import { NavParams, Platform } from '@ionic/angular';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getJournalData, getTestOutcomeText } from '@store/tests/tests.selector';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import { getCandidateName } from '@store/candidate-details/candidate-details.selector';
import {
  formatDriverNumber,
  getCandidateDriverNumber,
  getUntitledCandidateName,
} from '@store/tests/journal-data/common/candidate/candidate.selector';
import { getApplicationNumber }
  from '@store/tests/journal-data/common/application-reference/application-reference.selector';
import { getApplicationReference }
  from '@store/tests/journal-data/common/application-reference/application-reference.reducer';
import { getPassCompletion } from '@store/tests/pass-completion/pass-completion.reducer';
import {
  getPassCertificateNumber,
  isProvisionalLicenseProvided,
} from '@store/tests/pass-completion/pass-completion.selector';
import { getVehicleDetails } from '@store/tests/vehicle-details/vehicle-details.reducer';
import { getGearboxCategory, isAutomatic, isManual } from '@store/tests/vehicle-details/vehicle-details.selector';
import { getTestSummary } from '@store/tests/test-summary/test-summary.reducer';
import { getD255, isDebriefWitnessed } from '@store/tests/test-summary/test-summary.selector';
import { getCommunicationPreference } from '@store/tests/communication-preferences/communication-preferences.reducer';
import { getConductedLanguage } from '@store/tests/communication-preferences/communication-preferences.selector';
import {
  PassCertificateNumberChanged, ProvisionalLicenseNotReceived,
  ProvisionalLicenseReceived,
} from '@store/tests/pass-completion/pass-completion.actions';
import { GearboxCategoryChanged } from '@store/tests/vehicle-details/vehicle-details.actions';
import { PersistTests } from '@store/tests/tests.actions';
import {
  D255No, D255Yes, DebriefUnWitnessed, DebriefWitnessed,
} from '@store/tests/test-summary/test-summary.actions';
import {
  CandidateChoseToProceedWithTestInEnglish,
  CandidateChoseToProceedWithTestInWelsh,
} from '@store/tests/communication-preferences/communication-preferences.actions';
import {
  PassFinalisationValidationError,
  PassFinalisationViewDidEnter,
} from '@pages/pass-finalisation/pass-finalisation.actions';
import { PASS_CERTIFICATE_NUMBER_CTRL } from '../components/pass-certificate-number/pass-certificate-number.constants';
import { TransmissionType } from '../../../shared/models/transmission-type';
import { AuthenticationProvider } from '../../../providers/authentication/authentication';
import { PracticeableBasePageComponent } from '../../../shared/classes/practiceable-base-page';
import { ActivityCodes } from '../../../shared/models/activity-codes';
import { behaviourMap } from '../../office/office-behaviour-map';
import { OutcomeBehaviourMapProvider } from '../../../providers/outcome-behaviour-map/outcome-behaviour-map';
import { CAT_B } from '../../page-names.constants';
import { StoreModel } from '../../../shared/models/store.model';

interface PassFinalisationPageState {
  candidateName$: Observable<string>;
  candidateUntitledName$: Observable<string>;
  candidateDriverNumber$: Observable<string>;
  testOutcomeText$: Observable<string>;
  applicationNumber$: Observable<string>;
  provisionalLicense$: Observable<boolean>;
  passCertificateNumber$: Observable<string>;
  transmission$: Observable<GearboxCategory>;
  transmissionAutomaticRadioChecked$: Observable<boolean>;
  transmissionManualRadioChecked$: Observable<boolean>;
  d255$: Observable<boolean>;
  debriefWitnessed$: Observable<boolean>;
  conductedLanguage$: Observable<string>;
}

@Component({
  selector: '.pass-finalisation-cat-b-page',
  templateUrl: 'pass-finalisation.cat-b.page.html',
  styleUrls: ['pass-finalisation.cat-b.page.scss'],
})
export class PassFinalisationCatBPage extends PracticeableBasePageComponent {
  pageState: PassFinalisationPageState;
  passCertificateCtrl: string = PASS_CERTIFICATE_NUMBER_CTRL;
  @ViewChild('passCertificateNumberInput')
  passCertificateNumberInput: ElementRef;
  testOutcome: string = ActivityCodes.PASS;
  form: FormGroup;
  merged$: Observable<string>;
  transmission: GearboxCategory;
  subscription: Subscription;

  constructor(
    store$: Store<StoreModel>,
    public router: Router,
    public navParams: NavParams,
    public platform: Platform,
    public authenticationProvider: AuthenticationProvider,
    private outcomeBehaviourProvider: OutcomeBehaviourMapProvider,
  ) {
    super(platform, authenticationProvider, router, store$);
    this.form = new FormGroup({});
    this.outcomeBehaviourProvider.setBehaviourMap(behaviourMap);
  }

  ngOnInit(): void {
    super.ngOnInit();
    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    this.pageState = {
      candidateName$: currentTest$.pipe(
        select(getJournalData),
        select(getCandidate),
        select(getCandidateName),
      ),
      candidateUntitledName$: currentTest$.pipe(
        select(getJournalData),
        select(getCandidate),
        select(getUntitledCandidateName),
      ),
      candidateDriverNumber$: currentTest$.pipe(
        select(getJournalData),
        select(getCandidate),
        select(getCandidateDriverNumber),
        map(formatDriverNumber),
      ),
      testOutcomeText$: currentTest$.pipe(
        select(getTestOutcomeText),
      ),
      applicationNumber$: currentTest$.pipe(
        select(getJournalData),
        select(getApplicationReference),
        select(getApplicationNumber),
      ),
      provisionalLicense$: currentTest$.pipe(
        select(getPassCompletion),
        map(isProvisionalLicenseProvided),
      ),
      passCertificateNumber$: currentTest$.pipe(
        select(getPassCompletion),
        select(getPassCertificateNumber),
      ),
      transmission$: currentTest$.pipe(
        select(getVehicleDetails),
        select(getGearboxCategory),
      ),
      transmissionAutomaticRadioChecked$: currentTest$.pipe(
        select(getVehicleDetails),
        map(isAutomatic),
        tap((val) => {
          if (val) this.form.controls['transmissionCtrl'].setValue('Automatic');
        }),
      ),
      transmissionManualRadioChecked$: currentTest$.pipe(
        select(getVehicleDetails),
        map(isManual),
        tap((val) => {
          if (val) this.form.controls['transmissionCtrl'].setValue('Manual');
        }),
      ),
      debriefWitnessed$: currentTest$.pipe(
        select(getTestSummary),
        select(isDebriefWitnessed),
      ),
      d255$: currentTest$.pipe(
        select(getTestSummary),
        select(getD255),
      ),
      conductedLanguage$: currentTest$.pipe(
        select(getCommunicationPreference),
        select(getConductedLanguage),
      ),
    };
    const { transmission$ } = this.pageState;

    this.merged$ = merge(
      transmission$.pipe(map((value) => this.transmission = value)),
    );
    this.subscription = this.merged$.subscribe();
  }

  ionViewDidLeave(): void {
    super.ionViewDidLeave();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(PassFinalisationViewDidEnter());
    if (this.subscription.closed && this.merged$) {
      this.subscription = this.merged$.subscribe();
    }
  }

  provisionalLicenseReceived(): void {
    this.store$.dispatch(ProvisionalLicenseReceived());
  }

  provisionalLicenseNotReceived(): void {
    this.store$.dispatch(ProvisionalLicenseNotReceived());
  }

  transmissionChanged(transmission: GearboxCategory): void {
    this.store$.dispatch(GearboxCategoryChanged(transmission));
  }

  onSubmit() {
    Object.keys(this.form.controls).forEach((controlName) => this.form.controls[controlName].markAsDirty());
    if (this.form.valid) {
      this.store$.dispatch(PersistTests());
      this.router.navigate([CAT_B.HealthDeclarationPage]);
      return;
    }
    Object.keys(this.form.controls).forEach((controlName) => {
      if (this.form.controls[controlName].invalid) {
        if (controlName === PASS_CERTIFICATE_NUMBER_CTRL) {
          this.store$.dispatch(PassFinalisationValidationError(`${controlName} is invalid`));
          return;
        }
        this.store$.dispatch(PassFinalisationValidationError(`${controlName} is blank`));
      }
    });
  }

  passCertificateNumberChanged(passCertificateNumber: string): void {
    this.store$.dispatch(PassCertificateNumberChanged(passCertificateNumber));
  }

  d255Changed(d255: boolean): void {
    this.store$.dispatch(d255 ? D255Yes() : D255No());
  }

  debriefWitnessedChanged(debriefWitnessed: boolean) {
    this.store$.dispatch(debriefWitnessed ? DebriefWitnessed() : DebriefUnWitnessed());
  }

  isWelshChanged(isWelsh: boolean) {
    this.store$.dispatch(
      isWelsh
        ? CandidateChoseToProceedWithTestInWelsh('Cymraeg')
        : CandidateChoseToProceedWithTestInEnglish('English'),
    );
  }

  displayTransmissionBanner(): boolean {
    return !this.form.controls['transmissionCtrl'].pristine && this.transmission === TransmissionType.Automatic;
  }
}
