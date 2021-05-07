import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import { Router } from '@angular/router';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import {
  Address, CategoryCode, CommunicationMethod, ConductedLanguage,
} from '@dvsa/mes-test-schema/categories/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, merge, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getJournalData } from '@store/tests/tests.selector';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import {
  formatDriverNumber,
  getCandidateDriverNumber,
  getCandidateEmailAddress,
  getCandidateName,
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
  CommunicationSubmitInfo,
  CommunicationSubmitInfoError,
  CommunicationValidationError,
} from '@pages/communication/communication.actions';
import { DeviceAuthenticationProvider } from '@providers/device-authentication/device-authentication';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TestFlowPageNames } from '@pages/page-names.constants';

interface CommunicationPageState {
  candidateName$: Observable<string>;
  candidateUntitledName$: Observable<string>;
  candidateDriverNumber$: Observable<string>;
  candidateProvidedEmail$: Observable<string>;
  communicationEmail$: Observable<string>;
  communicationType$: Observable<string>;
  candidateAddress$: Observable<Address>;
  conductedLanguage$: Observable<string>;
  testCategory$: Observable<CategoryCode>;
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
  static readonly welshLanguage: ConductedLanguage = 'Cymraeg';
  static readonly englishLanguage: ConductedLanguage = 'English';

  form: FormGroup;
  subscription: Subscription;
  emailType: string;
  pageState: CommunicationPageState;
  candidateProvidedEmail: string;
  communicationEmail: string;
  communicationType: CommunicationMethod;
  merged$: Observable<string | boolean>;
  testCategory: CategoryCode;

  constructor(
    public platform: Platform,
    public router: Router,
    public authenticationProvider: AuthenticationProvider,
    store$: Store<StoreModel>,
    private navController: NavController,
    public routeByCat: RouteByCategoryProvider,
    public deviceAuthenticationProvider: DeviceAuthenticationProvider,
    private translate: TranslateService,
  ) {
    super(platform, router, authenticationProvider, store$);
    this.form = new FormGroup(this.getFormValidation());
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
      communicationEmail$: this.store$.pipe(
        select(getTests),
        select(getCurrentTest),
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
        map((result) => this.testCategory = result),
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
      testCategory$.pipe(map((result) => this.testCategory = result)),
    );

    this.subscription = this.merged$.subscribe();

    this.initialiseDefaultSelections();

    this.restoreRadiosFromState();
    this.restoreRadioValidators();
  }

  ionViewWillEnter(): boolean {
    if (this.subscription.closed && this.merged$) {
      this.subscription = this.merged$.subscribe();
    }

    return true;
  }

  ionViewDidLeave(): void {
    super.ionViewDidLeave();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onSubmit() {
    Object.keys(this.form.controls)
      .forEach((controlName) => this.form.controls[controlName].markAsDirty());
    if (this.form.valid) {
      this.deviceAuthenticationProvider.triggerLockScreen()
        .then(async () => {
          this.store$.dispatch(CommunicationSubmitInfo());
          await this.routeByCat.navigateToPage(TestFlowPageNames.WAITING_ROOM_TO_CAR_PAGE,
            this.testCategory as TestCategory);
        })
        .catch((err) => {
          this.store$.dispatch(CommunicationSubmitInfoError(err));
        });
    } else {
      Object.keys(this.form.controls)
        .forEach((controlName) => {
          if (this.form.controls[controlName].invalid) {
            this.store$.dispatch(CommunicationValidationError(`${controlName} is blank`));
          }
        });
    }
  }

  dispatchCandidateChoseProvidedEmail() {
    this.setCommunicationType(CommunicationPage.email, CommunicationPage.providedEmail);
    this.store$.dispatch(communicationPreferencesActions.CandidateChoseEmailAsCommunicationPreference(
      this.candidateProvidedEmail, CommunicationPage.email,
    ));
  }

  dispatchCandidateChoseNewEmail(communicationEmail: string): void {
    this.setCommunicationType(CommunicationPage.email, CommunicationPage.updatedEmail);
    this.store$.dispatch(communicationPreferencesActions.CandidateChoseEmailAsCommunicationPreference(
      communicationEmail, CommunicationPage.email,
    ));
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

  dispatchCandidateChosePost(): void {
    this.setCommunicationType(CommunicationPage.post);
    this.store$.dispatch(
      communicationPreferencesActions.CandidateChosePostAsCommunicationPreference(CommunicationPage.post),
    );
  }

  getFormValidation(): { [key: string]: FormControl } {
    return {
      radioCtrl: new FormControl('', Validators.required),
    };
  }

  /**
   * Facade function which dictates which radio value to reselect when rehydrating from state.
   * No current schema properties allow for the capture of radio selection for emails on the communication page.
   */
  restoreRadiosFromState() {
    if (this.communicationType === CommunicationPage.email) {
      this.assertEmailType();
    }
  }

  /**
   * Called by restoreRadiosFromState() when communicationType is 'Email'.
   *
   * If candidate provided an email at time of booking and this email is the same as the 'updatedEmail' in the
   * 'CommunicationPreferences' object stored in state then we select the relevant properties, to ensure that the
   * appropriate radio button is rehydrated.
   *
   * If the candidate did not provided an email at the time of booking and the 'CommunicationPreferences' object
   * contains one in state, we select the relevant properties, to ensure that the appropriate radio button is
   * rehydrated.
   */
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

  /**
   * Initialise a default radio selection on the communication page
   *
   * If 'communicationEmail' it implies the candidate is entering the form for the first time and
   * setting default values will not impact rehydration.
   *
   * If there is a candidate email provided at the time of booking, this will be chosen as
   * the default selection. If there is not then the new email radio selection will be chosen
   * as the default selection.
   *
   */
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
        newEmailCtrl.setValidators(Validators.email);
      }
      newEmailCtrl.updateValueAndValidity();
    }
  }

  /**
   * Function to conditionally dispatch 'dispatchCandidateChoseNewEmail' action
   * to cover edge case candidate action.
   *
   * Candidate selects new email -> app crashes -> candidate selects Post ->
   * app crashes -> candidate selects new email (previous state value exists so examiner clicks continue)
   *
   * As state change for new email happens on text input, the expected action
   * (CandidateChoseEmailAsCommunicationPreference) would not be dispatched.
   */
  conditionalDispatchCandidateChoseNewEmail() {
    this.setCommunicationType(CommunicationPage.email, CommunicationPage.updatedEmail);

    if (this.isNewEmailSelected() && this.communicationEmail !== '') {
      this.dispatchCandidateChoseNewEmail(this.communicationEmail);
    }
  }

  getNewEmailAddressValue() {
    return this.candidateProvidedEmail === this.communicationEmail ? '' : this.communicationEmail;
  }

}
