import { Component, OnInit } from '@angular/core';
import {
  AlertController, Platform,
} from '@ionic/angular';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { CONFIRM_TEST_DETAILS } from '@pages/page-names.constants';
import { Observable, Subscription, merge } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DeviceAuthenticationProvider } from '@providers/device-authentication/device-authentication';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import {
  HealthDeclarationViewDidEnter,
  HealthDeclarationValidationError, ContinueFromDeclaration,
} from '@pages/health-declaration/health-declaration.actions';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getJournalData } from '@store/tests/tests.selector';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { getPostTestDeclarations } from '@store/tests/post-test-declarations/post-test-declarations.reducer';
import {
  getHealthDeclarationStatus,
  getReceiptDeclarationStatus, getSignatureStatus,
} from '@store/tests/post-test-declarations/post-test-declarations.selector';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import {
  formatDriverNumber,
  getCandidateDriverNumber,
  getCandidateName,
  getUntitledCandidateName,
} from '@store/tests/journal-data/common/candidate/candidate.selector';
import { map, tap } from 'rxjs/operators';
import { getPassCompletion } from '@store/tests/pass-completion/pass-completion.reducer';
import {
  getPassCertificateNumber,
  isProvisionalLicenseProvided,
} from '@store/tests/pass-completion/pass-completion.selector';
import { getCommunicationPreference } from '@store/tests/communication-preferences/communication-preferences.reducer';
import { getConductedLanguage } from '@store/tests/communication-preferences/communication-preferences.selector';
import { configureI18N } from '@shared/helpers/translation.helpers';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import * as postTestDeclarationsActions from '@store/tests/post-test-declarations/post-test-declarations.actions';
import { ProvisionalLicenseNotReceived } from '@store/tests/pass-completion/pass-completion.actions';

interface HealthDeclarationPageState {
  healthDeclarationAccepted$: Observable<boolean>;
  receiptDeclarationAccepted$: Observable<boolean>;
  signature$: Observable<string>;
  candidateName$: Observable<string>;
  candidateUntitledName$: Observable<string>;
  candidateDriverNumber$: Observable<string>;
  passCertificateNumber$: Observable<string>;
  licenseProvided$: Observable<boolean>;
  conductedLanguage$: Observable<string>;
  testCategory$: Observable<CategoryCode>;
}
@Component({
  selector: 'app-health-declaration',
  templateUrl: './health-declaration.page.html',
  styleUrls: ['./health-declaration.page.scss'],
})
export class HealthDeclarationPage extends PracticeableBasePageComponent implements OnInit {

  pageState: HealthDeclarationPageState;
  formGroup: FormGroup;
  licenseProvided: boolean;
  healthDeclarationAccepted: boolean;
  subscription: Subscription;
  inputSubscriptions: Subscription[] = [];
  merged$: Observable<boolean | string>;
  formControl: FormControl;
  static readonly fieldName: string = 'healthCheckbox';

  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    private deviceAuthenticationProvider: DeviceAuthenticationProvider,
    private translate: TranslateService,
    public alertController: AlertController,
    public routeByCat: RouteByCategoryProvider,
  ) {
    super(platform, authenticationProvider, router, store$);
    this.formGroup = new FormGroup({});
  }

  ionViewDidEnter() {
    this.store$.dispatch(HealthDeclarationViewDidEnter());
  }

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl('', []);
      this.formGroup.addControl(HealthDeclarationPage.fieldName, this.formControl);
    }
    this.formControl.patchValue(this.healthDeclarationAccepted);
  }

  isInvalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

  ngOnInit() {
    super.ngOnInit();

    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    this.pageState = {
      healthDeclarationAccepted$: currentTest$.pipe(
        select(getPostTestDeclarations),
        select(getHealthDeclarationStatus),
      ),
      receiptDeclarationAccepted$: currentTest$.pipe(
        select(getPostTestDeclarations),
        select(getReceiptDeclarationStatus),
      ),
      signature$: currentTest$.pipe(
        select(getPostTestDeclarations),
        select(getSignatureStatus),
      ),
      candidateName$: this.store$.pipe(
        select(getTests),
        select(getCurrentTest),
        select(getJournalData),
        select(getCandidate),
        select(getCandidateName),
      ),
      candidateUntitledName$: this.store$.pipe(
        select(getTests),
        select(getCurrentTest),
        select(getJournalData),
        select(getCandidate),
        select(getUntitledCandidateName),
      ),
      candidateDriverNumber$: this.store$.pipe(
        select(getTests),
        select(getCurrentTest),
        select(getJournalData),
        select(getCandidate),
        select(getCandidateDriverNumber),
        map(formatDriverNumber),
      ),
      passCertificateNumber$: currentTest$.pipe(
        select(getPassCompletion),
        select(getPassCertificateNumber),
      ),
      licenseProvided$: currentTest$.pipe(
        select(getPassCompletion),
        map(isProvisionalLicenseProvided),
      ),
      conductedLanguage$: currentTest$.pipe(
        select(getCommunicationPreference),
        select(getConductedLanguage),
      ),
      testCategory$: currentTest$.pipe(
        select(getTestCategory),
      ),
    };

    const { licenseProvided$, healthDeclarationAccepted$, conductedLanguage$ } = this.pageState;

    this.merged$ = merge(
      licenseProvided$.pipe(map((val) => this.licenseProvided = val)),
      healthDeclarationAccepted$.pipe(map((val) => this.healthDeclarationAccepted = val)),
      conductedLanguage$.pipe(tap((value) => configureI18N(value as Language, this.translate))),
    );
  }

  ionViewWillEnter(): boolean {
    if (this.merged$) {
      this.subscription = this.merged$.subscribe();
    }

    return true;
  }

  getSignatureDrawCompleteAction(signature: string): void {
    this.store$.dispatch(postTestDeclarationsActions.SignatureDataChanged(signature));
  }

  getSignatureClearAction(): void {
    this.store$.dispatch(postTestDeclarationsActions.SignatureDataCleared());
  }

  healthDeclarationChanged(): void {
    this.store$.dispatch(postTestDeclarationsActions.ToggleHealthDeclaration());
  }

  receiptDeclarationChanged(): void {
    this.store$.dispatch(postTestDeclarationsActions.ToggleReceiptDeclaration());
  }

  async onSubmit() {
    Object.keys(this.formGroup.controls).forEach((controlName) => this.formGroup.controls[controlName].markAsDirty());
    if (this.formGroup.valid) {
      if (!this.healthDeclarationAccepted) {
        this.showConfirmHealthDeclarationModal();
      } else {
        await this.persistAndNavigate(false);
      }
      return;
    }
    Object.keys(this.formGroup.controls).forEach((controlName) => {
      if (this.formGroup.controls[controlName].invalid) {
        this.store$.dispatch(HealthDeclarationValidationError(`${controlName} is blank`));
      }
    });
  }

  showConfirmHealthDeclarationModal() {
    const shortMessage = 'Remind the candidate to contact DVLA';
    // eslint-disable-next-line operator-linebreak
    const extendedMessage =
      // eslint-disable-next-line max-len
      `You need to give the provisional licence back to the candidate.<br/>The field 'Driver licence received' will be automatically changed to 'no'.<br/>${shortMessage}`;
    this.alertController.create({
      header: 'The candidate has not confirmed the health declaration',
      message: this.licenseProvided ? extendedMessage : shortMessage,
      cssClass: 'confirm-declaration-modal',
      buttons: [
        {
          text: 'Cancel',
          handler: () => { },
        },
        {
          text: 'Continue',
          handler: () => this.persistAndNavigate(true),
        },
      ],
      backdropDismiss: false,
    }).then(async (res) => {
      await res.present();
    });
  }

  async persistAndNavigate(resetLicenseProvided: boolean) {
    const canNavigate: boolean = await this.router.navigate([CONFIRM_TEST_DETAILS]);
    if (canNavigate) {
      if (this.licenseProvided && resetLicenseProvided) {
        this.store$.dispatch(ProvisionalLicenseNotReceived());
      }
      this.store$.dispatch(ContinueFromDeclaration());
    }
  }

  ionViewDidLeave(): void {
    super.ionViewDidLeave();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.inputSubscriptions) {
      this.inputSubscriptions.forEach((sub) => sub.unsubscribe());
    }
  }
}
