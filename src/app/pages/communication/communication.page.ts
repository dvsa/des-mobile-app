import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import { Router } from '@angular/router';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { Address, CategoryCode, CommunicationMethod } from '@dvsa/mes-test-schema/categories/common';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { merge, Observable, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getJournalData } from '@store/tests/tests.selector';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import {
  formatDriverNumber,
  getCandidateDriverNumber,
  getCandidateEmailAddress,
  getCandidateName,
  getCandidatePrn,
  getPostalAddress,
  getUntitledCandidateName,
} from '@store/tests/journal-data/common/candidate/candidate.selector';
import { map, take, tap } from 'rxjs/operators';
import { getCommunicationPreference } from '@store/tests/communication-preferences/communication-preferences.reducer';
import {
  getCommunicationPreferenceType,
  getCommunicationPreferenceUpdatedEmail,
  getConductedLanguage,
} from '@store/tests/communication-preferences/communication-preferences.selector';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { configureI18N } from '@shared/helpers/translation.helpers';
import * as communicationPreferencesActions
  from '@store/tests/communication-preferences/communication-preferences.actions';
import {
  BookingEmailSelected,
  CommunicationSubmitInfo,
  CommunicationSubmitInfoError,
  CommunicationValidationError,
  CommunicationViewDidEnter,
  NewEmailSelected,
  PostalSelected,
} from '@pages/communication/communication.actions';
import { DeviceAuthenticationProvider } from '@providers/device-authentication/device-authentication';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { showVrnButton } from '@store/tests/vehicle-details/vehicle-details.selector';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { getPreTestDeclarations } from '@store/tests/pre-test-declarations/pre-test-declarations.reducer';
import {
  getValidCertificateStatus,
} from '@store/tests/pre-test-declarations/cat-a-mod2/pre-test-declarations.cat-adi-part3.selector';
import { ValidPassCertChanged } from '@store/tests/pre-test-declarations/pre-test-declarations.actions';
import { OrientationType, ScreenOrientation } from '@capawesome/capacitor-screen-orientation';
import { KeepAwake as Insomnia } from '@capacitor-community/keep-awake';
import { DeviceProvider } from '@providers/device/device';

interface CommunicationPageState {
  candidateName$: Observable<string>;
  candidateUntitledName$: Observable<string>;
  candidateDriverNumber$: Observable<string>;
  candidateProvidedEmail$: Observable<string>;
  communicationEmail$: Observable<string>;
  communicationType$: Observable<string>;
  candidateAddress$: Observable<Address>;
  conductedLanguage$: Observable<Language>;
  testCategory$: Observable<CategoryCode>;
  showVrnBtn$: Observable<boolean>;
  prn$: Observable<number>;
  isStandardsCheck$: Observable<boolean>;
  validCertificate$: Observable<boolean>;
}

@Component({
  selector: 'app-communication',
  templateUrl: './communication.page.html',
  styleUrls: ['./communication.page.scss'],
})
export class CommunicationPage extends PracticeableBasePageComponent implements OnInit {

  static readonly providedEmail: string = 'Provided';
  static readonly updatedEmail: string = 'Updated';
  static readonly email: CommunicationMethod = 'Email';
  static readonly post: CommunicationMethod = 'Post';
  static readonly notProvided: CommunicationMethod = 'Not provided';

  form: UntypedFormGroup;
  subscription: Subscription;
  emailType: string;
  pageState: CommunicationPageState;
  candidateProvidedEmail: string;
  communicationEmail: string;
  communicationType: CommunicationMethod;
  merged$: Observable<string | boolean>;
  testCategory: TestCategory;
  maximumCallStackHandler = {
    emitEvent: false,
    onlySelf: true,
  };

  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    public routeByCat: RouteByCategoryProvider,
    public deviceAuthenticationProvider: DeviceAuthenticationProvider,
    private translate: TranslateService,
    private deviceProvider: DeviceProvider,
  ) {
    super(platform, authenticationProvider, router, store$, false);
    this.form = new UntypedFormGroup(this.getFormValidation());
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
      candidateProvidedEmail$: currentTest$.pipe(
        select(getJournalData),
        select(getCandidate),
        select(getCandidateEmailAddress),
        take(1),
      ),
      communicationEmail$: currentTest$.pipe(
        select(getCommunicationPreference),
        select(getCommunicationPreferenceUpdatedEmail),
      ),
      communicationType$: currentTest$.pipe(
        select(getCommunicationPreference),
        select(getCommunicationPreferenceType),
      ),
      candidateAddress$: currentTest$.pipe(
        select(getJournalData),
        select(getCandidate),
        select(getPostalAddress),
      ),
      conductedLanguage$: currentTest$.pipe(
        select(getCommunicationPreference),
        select(getConductedLanguage),
      ),
      testCategory$: currentTest$.pipe(
        select(getTestCategory),
        map((result) => this.testCategory = result as TestCategory),
      ),
      showVrnBtn$: currentTest$.pipe(
        select(getTestCategory),
        select(showVrnButton),
      ),
      prn$: currentTest$.pipe(
        select(getJournalData),
        select(getCandidate),
        select(getCandidatePrn),
      ),
      isStandardsCheck$: currentTest$.pipe(
        select(getTestCategory),
        map((category) => isAnyOf(category, [TestCategory.SC])),
      ),
      validCertificate$: currentTest$.pipe(
        select(getPreTestDeclarations),
        select(getValidCertificateStatus),
      ),
    };

    const {
      candidateProvidedEmail$,
      communicationEmail$,
      communicationType$,
      conductedLanguage$,
      testCategory$,
    } = this.pageState;

    this.merged$ = merge(
      candidateProvidedEmail$.pipe(map((value) => this.candidateProvidedEmail = value)),
      communicationEmail$.pipe(map((value) => this.communicationEmail = value)),
      communicationType$.pipe(map((value) => this.communicationType = value as CommunicationMethod)),
      conductedLanguage$.pipe(tap((value) => configureI18N(value as Language, this.translate))),
      testCategory$.pipe(map((result) => this.testCategory = result as TestCategory)),
    );

    this.subscription = this.merged$.subscribe();
  }

  ionViewWillEnter(): void {
    if (this.subscription.closed && this.merged$) {
      this.subscription = this.merged$.subscribe();
    }

    if (this.shouldPreselectADefaultValue()) {
      this.initialiseDefaultSelections();
    } else if (this.emailType !== CommunicationPage.updatedEmail) {
      this.form.controls['newEmailCtrl'].clearValidators();
      this.form.controls['newEmailCtrl'].updateValueAndValidity(this.maximumCallStackHandler);
    }
    this.restoreRadiosFromState();
    this.restoreRadioValidators();
  }

  ionViewDidLeave(): void {
    super.ionViewDidLeave();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async ionViewDidEnter(): Promise<void> {
    this.store$.dispatch(CommunicationViewDidEnter());

    if (super.isIos()) {
      await ScreenOrientation.lock({ type: OrientationType.PORTRAIT_PRIMARY });
      await Insomnia.keepAwake();

      if (!this.isEndToEndPracticeMode) {
        await this.deviceProvider.enableSingleAppMode();
      }
    }
  }

  async onSubmit(): Promise<void> {
    Object.keys(this.form.controls)
      .forEach((controlName) => this.form.controls[controlName].markAsDirty());
    if (!this.form.valid) {
      Object.keys(this.form.controls)
        .forEach((controlName) => {
          if (this.form.controls[controlName].invalid) {
            this.store$.dispatch(CommunicationValidationError(`${controlName} is blank`));
          }
        });
      return;
    }

    try {
      await this.deviceAuthenticationProvider.triggerLockScreen(this.isPracticeMode);
      this.store$.dispatch(CommunicationSubmitInfo());
      await this.routeByCat.navigateToPage(TestFlowPageNames.WAITING_ROOM_TO_CAR_PAGE, this.testCategory);
    } catch (err) {
      this.store$.dispatch(CommunicationSubmitInfoError(err));
    }
  }

  dispatchCandidateChoseProvidedEmail() {
    this.setCommunicationType(CommunicationPage.email, CommunicationPage.providedEmail);
    this.store$.dispatch(communicationPreferencesActions.CandidateChoseEmailAsCommunicationPreference(
      this.candidateProvidedEmail, CommunicationPage.email,
    ));
    this.store$.dispatch(BookingEmailSelected());
  }

  dispatchCandidateChoseNewEmail(communicationEmail: string): void {
    if (this.isNewEmailSelected()) {
      this.setCommunicationType(CommunicationPage.email, CommunicationPage.updatedEmail);
      this.store$.dispatch(communicationPreferencesActions.CandidateChoseEmailAsCommunicationPreference(
        communicationEmail, CommunicationPage.email,
      ));
      this.store$.dispatch(NewEmailSelected());
    }
  }

  dispatchCandidateChosePost(): void {
    this.setCommunicationType(CommunicationPage.post);
    this.store$.dispatch(
      communicationPreferencesActions.CandidateChosePostAsCommunicationPreference(CommunicationPage.post),
    );
    this.store$.dispatch(PostalSelected());
  }

  setCommunicationType(communicationChoice: CommunicationMethod, emailType: string = null) {
    this.communicationType = communicationChoice;
    this.emailType = emailType;
    this.verifyNewEmailFormControl(communicationChoice);
  }

  isProvidedEmailSelected(): boolean {
    return (this.communicationType === CommunicationPage.email
      && this.emailType === CommunicationPage.providedEmail);
  }

  isNewEmailSelected(): boolean {
    return (this.communicationType === CommunicationPage.email
      && this.emailType === CommunicationPage.updatedEmail);
  }

  isPostSelected() {
    return this.communicationType === CommunicationPage.post;
  }

  getFormValidation(): { [key: string]: UntypedFormControl } {
    return {
      radioCtrl: new UntypedFormControl('', Validators.required),
    };
  }

  restoreRadiosFromState() {
    if (this.communicationType === CommunicationPage.email) {
      this.assertEmailType();
    }
  }

  assertEmailType() {
    if (this.candidateProvidedEmail !== '' && this.candidateProvidedEmail === this.communicationEmail) {
      this.emailType = CommunicationPage.providedEmail;
    }

    if (this.candidateProvidedEmail !== this.communicationEmail) {
      this.emailType = CommunicationPage.updatedEmail;
    }
  }

  restoreRadioValidators() {
    this.form.controls['radioCtrl'].setValue(true);
  }

  initialiseDefaultSelections() {
    this.communicationType = CommunicationPage.email;
    if (this.candidateProvidedEmail) {
      this.emailType = CommunicationPage.providedEmail;
      this.form.controls['radioCtrl'].setValue(true);
      this.dispatchCandidateChoseProvidedEmail();
    }

    if (!this.candidateProvidedEmail) {
      this.emailType = CommunicationPage.updatedEmail;
      this.form.controls['radioCtrl'].setValue(true);
    }
  }

  verifyNewEmailFormControl(communicationChoice: string) {
    const newEmailCtrl = this.form.get('newEmailCtrl');
    if (newEmailCtrl !== null) {
      if (communicationChoice !== CommunicationPage.email || this.emailType === CommunicationPage.providedEmail) {
        newEmailCtrl.clearValidators();
      } else {
        newEmailCtrl.setValidators(Validators.compose([
          Validators.required,
          Validators.email,
        ]));
      }
      newEmailCtrl.updateValueAndValidity();
    }
  }

  shouldPreselectADefaultValue(): boolean {
    return this.communicationType === CommunicationPage.notProvided;
  }

  conditionalDispatchCandidateChoseNewEmail() {
    this.setCommunicationType(CommunicationPage.email, CommunicationPage.updatedEmail);

    if (this.isNewEmailSelected() && this.communicationEmail !== '') {
      this.dispatchCandidateChoseNewEmail(this.communicationEmail);
    }
  }

  validCertificateChanged(validCertificate: boolean): void {
    this.store$.dispatch(ValidPassCertChanged(validCertificate));
  }

  async canDeActivate(): Promise<boolean> {
    try {
      await this.deviceAuthenticationProvider.triggerLockScreen(this.isPracticeMode);
      return true;
    } catch {
      return false;
    }
  }
}
