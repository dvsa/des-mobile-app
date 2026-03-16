import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Address, CategoryCode, CommunicationMethod } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import {
  BookingEmailSelected,
  CommunicationSubmitInfo,
  CommunicationSubmitInfoError,
  CommunicationValidationError,
  CommunicationViewDidEnter,
  NewEmailSelected,
  PostalSelected,
} from '@pages/communication/communication.actions';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { emailValidator } from '@providers/custom-validators/custom-validators';
import { DeviceAuthenticationProvider } from '@providers/device-authentication/device-authentication';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import { selectIsStandardsCheck, selectTestCategory } from '@store/tests/category/category.reducer';
import * as communicationPreferencesActions from '@store/tests/communication-preferences/communication-preferences.actions';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import {
  selectCommunicationPreferenceType,
  selectCommunicationPreferenceUpdatedEmail,
  selectConductedLanguage,
} from '@store/tests/communication-preferences/communication-preferences.selector';
import {
  selectCandidateEmailAddress,
  selectCandidateName,
  selectCandidatePrn,
  selectFormatDriverNumber,
  selectPostalAddress,
  selectUntitledCandidateName,
} from '@store/tests/journal-data/common/candidate/candidate.selector';
import { selectValidCertificateStatus } from '@store/tests/pre-test-declarations/cat-a-mod2/pre-test-declarations.cat-adi-part3.selector';
import { ValidPassCertChanged } from '@store/tests/pre-test-declarations/pre-test-declarations.actions';
import { selectShowVrnButton } from '@store/tests/vehicle-details/vehicle-details.selector';
import { Observable } from 'rxjs';

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
  standalone: false,
})
export class CommunicationPage extends PracticeableBasePageComponent implements OnInit {
  static readonly providedEmail: string = 'Provided';
  static readonly updatedEmail: string = 'Updated';
  static readonly email: CommunicationMethod = 'Email';
  static readonly post: CommunicationMethod = 'Post';
  static readonly notProvided: CommunicationMethod = 'Not provided';

  form: UntypedFormGroup;
  emailType: string;
  maximumCallStackHandler = {
    emitEvent: false,
    onlySelf: true,
  };

  public routeByCategoryProvider = inject(RouteByCategoryProvider);
  public deviceAuthenticationProvider = inject(DeviceAuthenticationProvider);

  // One time getting of values for static data
  candidateName = this.store$.selectSignal(selectCandidateName)();
  candidateUntitledName = this.store$.selectSignal(selectUntitledCandidateName)();
  candidateDriverNumber = this.store$.selectSignal(selectFormatDriverNumber)();
  testCategory = this.store$.selectSignal(selectTestCategory)() as TestCategory;
  conductedLanguage = this.store$.selectSignal(selectConductedLanguage)();
  prn = this.store$.selectSignal(selectCandidatePrn)();
  isStandardsCheck = this.store$.selectSignal(selectIsStandardsCheck)();
  candidateAddress = this.store$.selectSignal(selectPostalAddress)();
  showVrnBtn = this.store$.selectSignal(selectShowVrnButton)();

  // Signals for data that could vary over time controlled within this page
  candidateProvidedEmail = this.store$.selectSignal(selectCandidateEmailAddress)();
  communicationEmail = this.store$.selectSignal(selectCommunicationPreferenceUpdatedEmail)();
  communicationType = this.store$.selectSignal(selectCommunicationPreferenceType)();
  validCertificate = this.store$.selectSignal(selectValidCertificateStatus)();

  constructor() {
    super(false);
    this.form = new UntypedFormGroup(this.getFormValidation());
  }

  ionViewWillEnter(): void {
    if (this.shouldPreselectADefaultValue()) {
      this.initialiseDefaultSelections();
    } else if (this.emailType !== CommunicationPage.updatedEmail) {
      this.form.controls.newEmailCtrl.clearValidators();
      this.form.controls.newEmailCtrl.updateValueAndValidity(this.maximumCallStackHandler);
    }
    this.restoreRadiosFromState();
    this.restoreRadioValidators();
  }

  async ionViewDidEnter(): Promise<void> {
    this.store$.dispatch(CommunicationViewDidEnter());
    await super.lockDevice(this.isEndToEndPracticeMode);
  }

  async onSubmit(): Promise<void> {
    Object.keys(this.form.controls).forEach((controlName) => this.form.controls[controlName].markAsDirty());

    if (!this.form.valid) {
      Object.keys(this.form.controls).forEach((controlName) => {
        if (this.form.controls[controlName].invalid) {
          this.store$.dispatch(CommunicationValidationError(`${controlName} is blank`));
        }
      });
      return;
    }

    try {
      if (await this.deviceAuthenticationProvider.triggerLockScreen(this.isPracticeMode)) {
        this.store$.dispatch(CommunicationSubmitInfo());
        await this.routeByCategoryProvider.navigateToPage(
          TestFlowPageNames.WAITING_ROOM_TO_CAR_PAGE,
          this.testCategory
        );
      }
    } catch (err) {
      this.store$.dispatch(CommunicationSubmitInfoError(err));
    }
  }

  dispatchCandidateChoseProvidedEmail() {
    this.setCommunicationType(CommunicationPage.email, CommunicationPage.providedEmail);
    this.store$.dispatch(
      communicationPreferencesActions.CandidateChoseEmailAsCommunicationPreference(
        this.candidateProvidedEmail,
        CommunicationPage.email
      )
    );
    this.store$.dispatch(BookingEmailSelected());
  }

  dispatchCandidateChoseNewEmail(communicationEmail: string): void {
    if (this.isNewEmailSelected()) {
      this.setCommunicationType(CommunicationPage.email, CommunicationPage.updatedEmail);
      this.store$.dispatch(
        communicationPreferencesActions.CandidateChoseEmailAsCommunicationPreference(
          communicationEmail,
          CommunicationPage.email
        )
      );
      this.store$.dispatch(NewEmailSelected());
    }
  }

  dispatchCandidateChosePost(): void {
    this.setCommunicationType(CommunicationPage.post);
    this.store$.dispatch(
      communicationPreferencesActions.CandidateChosePostAsCommunicationPreference(CommunicationPage.post)
    );
    this.store$.dispatch(PostalSelected());
  }

  setCommunicationType(communicationChoice: CommunicationMethod, emailType: string = null) {
    this.communicationType = communicationChoice;
    this.emailType = emailType;
    this.verifyNewEmailFormControl(communicationChoice);
  }

  isProvidedEmailSelected(): boolean {
    return this.communicationType === CommunicationPage.email && this.emailType === CommunicationPage.providedEmail;
  }

  isNewEmailSelected(): boolean {
    return this.communicationType === CommunicationPage.email && this.emailType === CommunicationPage.updatedEmail;
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
    this.form.controls.radioCtrl.setValue(true);
  }

  initialiseDefaultSelections() {
    this.communicationType = CommunicationPage.email;
    if (this.candidateProvidedEmail) {
      this.emailType = CommunicationPage.providedEmail;
      this.form.controls.radioCtrl.setValue(true);
      this.dispatchCandidateChoseProvidedEmail();
    }

    if (!this.candidateProvidedEmail) {
      this.emailType = CommunicationPage.updatedEmail;
      this.form.controls.radioCtrl.setValue(true);
    }
  }

  verifyNewEmailFormControl(communicationChoice: string) {
    const newEmailCtrl = this.form.get('newEmailCtrl');
    if (newEmailCtrl !== null) {
      if (communicationChoice !== CommunicationPage.email || this.emailType === CommunicationPage.providedEmail) {
        newEmailCtrl.clearValidators();
      } else {
        console.log('setting new validators');
        newEmailCtrl.setValidators(Validators.compose([Validators.required, emailValidator()]));
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
      return await this.deviceAuthenticationProvider.triggerLockScreen(this.isPracticeMode);
    } catch (err) {
      return false;
    }
  }
}
