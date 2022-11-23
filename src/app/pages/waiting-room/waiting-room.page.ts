import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ModalController, Platform } from '@ionic/angular';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { merge, Observable, Subscription } from 'rxjs';
import { getPreTestDeclarations } from '@store/tests/pre-test-declarations/pre-test-declarations.reducer';
import * as preTestDeclarationsActions from '@store/tests/pre-test-declarations/pre-test-declarations.actions';
import {
  getInsuranceDeclarationStatus,
  getResidencyDeclarationStatus,
  getSignatureStatus,
} from '@store/tests/pre-test-declarations/pre-test-declarations.selector';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import {
  formatDriverNumber,
  getCandidateDriverNumber,
  getCandidateName,
  getUntitledCandidateName,
} from '@store/tests/journal-data/common/candidate/candidate.selector';
import { map, tap } from 'rxjs/operators';
import { getCurrentTest, getJournalData } from '@store/tests/tests.selector';
import { DeviceAuthenticationProvider } from '@providers/device-authentication/device-authentication';
import { getTests } from '@store/tests/tests.reducer';
import { TranslateService } from '@ngx-translate/core';
import {
  getTestSlotAttributes,
} from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.reducer';
import { isWelshTest } from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.selector';
import { getCommunicationPreference } from '@store/tests/communication-preferences/communication-preferences.reducer';
import { getConductedLanguage } from '@store/tests/communication-preferences/communication-preferences.selector';
import {
  CandidateChoseToProceedWithTestInEnglish,
  CandidateChoseToProceedWithTestInWelsh,
} from '@store/tests/communication-preferences/communication-preferences.actions';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { DeviceProvider } from '@providers/device/device';
import { configureI18N } from '@shared/helpers/translation.helpers';
import { CategoryCode, JournalData } from '@dvsa/mes-test-schema/categories/common';
import { isEmpty } from 'lodash';
import { Router } from '@angular/router';
import { SignatureAreaComponent } from '@components/common/signature-area/signature-area';

import { DASHBOARD_PAGE, TestFlowPageNames } from '@pages/page-names.constants';
import { ErrorTypes } from '@shared/models/error-message';
import { AppComponent } from '@app/app.component';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { showVrnButton } from '@store/tests/vehicle-details/vehicle-details.selector';
import {
  getManoeuvrePassCertificateNumber,
} from '@store/tests/pre-test-declarations/cat-c/pre-test-declarations.cat-c.selector';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { CbtNumberChanged } from '@store/tests/pre-test-declarations/cat-a/pre-test-declarations.cat-a.actions';
import {
  getPreTestDeclarationsCatAMod1,
} from '@store/tests/pre-test-declarations/cat-a-mod1/pre-test-declarations.cat-a-mod1.reducer';
import {
  getCBTNumberStatus,
} from '@store/tests/pre-test-declarations/cat-a-mod1/pre-test-declarations.cat-a-mod1.selector';
import { CBT_NUMBER_CTRL } from '@pages/waiting-room/components/cbt-number/cbt-number.constants';
import { ErrorPage } from '@pages/error-page/error';
// import { GetCandidateLicenceData } from '@pages/candidate-licence/candidate-licence.actions';
import { getRekeyIndicator } from '@store/tests/rekey/rekey.reducer';
import { isRekey } from '@store/tests/rekey/rekey.selector';
import * as waitingRoomActions from './waiting-room.actions';

interface WaitingRoomPageState {
  insuranceDeclarationAccepted$: Observable<boolean>;
  residencyDeclarationAccepted$: Observable<boolean>;
  signature$: Observable<string>;
  candidateName$: Observable<string>;
  candidateUntitledName$: Observable<string>;
  candidateDriverNumber$: Observable<string>;
  welshTest$: Observable<boolean>;
  conductedLanguage$: Observable<string>;
  testCategory$: Observable<CategoryCode>;
  showVrnBtn$: Observable<boolean>;
  showManoeuvresPassCertNumber$: Observable<boolean>;
  manoeuvresPassCertNumber$: Observable<string>;
  showCbtNumber$: Observable<boolean>;
  showResidencyDec$: Observable<boolean>;
  cbtNumber$: Observable<string>;
  isRekey$: Observable<boolean>;
}

@Component({
  selector: 'app-waiting-room-page',
  templateUrl: './waiting-room.page.html',
  styleUrls: ['./waiting-room.page.scss'],
})
export class WaitingRoomPage extends PracticeableBasePageComponent implements OnInit {

  @ViewChild(SignatureAreaComponent)
  signatureAreaComponent: SignatureAreaComponent;
  pageState: WaitingRoomPageState;
  formGroup: UntypedFormGroup;
  subscription: Subscription;
  testCategory: TestCategory;
  isRekey: boolean;
  merged$: Observable<boolean | string | JournalData>;

  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    private deviceAuthenticationProvider: DeviceAuthenticationProvider,
    private deviceProvider: DeviceProvider,
    private screenOrientation: ScreenOrientation,
    private insomnia: Insomnia,
    private translate: TranslateService,
    private modalController: ModalController,
    private app: AppComponent,
  ) {
    super(platform, authenticationProvider, router, store$, false);
    this.formGroup = new UntypedFormGroup({});
  }

  async ionViewDidEnter(): Promise<void> {
    this.store$.dispatch(waitingRoomActions.WaitingRoomViewDidEnter());
    // @TODO: Re-introduce when CandidateID goes live;
    // this.store$.dispatch(GetCandidateLicenceData());

    if (super.isIos()) {
      await this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
      await this.insomnia.keepAwake();

      if (!this.isEndToEndPracticeMode) {
        await this.deviceProvider.enableSingleAppMode();
      }
    }
  }

  ngOnInit(): void {
    super.ngOnInit();

    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    this.pageState = {
      insuranceDeclarationAccepted$: currentTest$.pipe(
        select(getPreTestDeclarations),
        select(getInsuranceDeclarationStatus),
      ),
      residencyDeclarationAccepted$: currentTest$.pipe(
        select(getPreTestDeclarations),
        select(getResidencyDeclarationStatus),
      ),
      signature$: currentTest$.pipe(
        select(getPreTestDeclarations),
        select(getSignatureStatus),
      ),
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
      welshTest$: currentTest$.pipe(
        select(getJournalData),
        select(getTestSlotAttributes),
        select(isWelshTest),
      ),
      conductedLanguage$: currentTest$.pipe(
        select(getCommunicationPreference),
        select(getConductedLanguage),
      ),
      testCategory$: currentTest$.pipe(
        select(getTestCategory),
      ),
      showVrnBtn$: currentTest$.pipe(
        select(getTestCategory),
        select(showVrnButton),
      ),
      showManoeuvresPassCertNumber$: currentTest$.pipe(
        select(getTestCategory),
        map((category) => isAnyOf(category, [
          TestCategory.C, TestCategory.C1, TestCategory.CE, TestCategory.C1E,
          TestCategory.D, TestCategory.D1, TestCategory.DE, TestCategory.D1E,
        ])),
      ),
      manoeuvresPassCertNumber$: currentTest$.pipe(
        select(getPreTestDeclarations),
        select(getManoeuvrePassCertificateNumber),
      ),
      showCbtNumber$: currentTest$.pipe(
        select(getTestCategory),
        map((category) => isAnyOf(category, [
          TestCategory.EUAMM1, TestCategory.EUA1M1, TestCategory.EUA2M1, TestCategory.EUAM1, // Mod 1
          TestCategory.EUAMM2, TestCategory.EUA1M2, TestCategory.EUA2M2, TestCategory.EUAM2, // Mod 2
        ])),
      ),
      showResidencyDec$: currentTest$.pipe(
        select(getTestCategory),
        map((category) => !isAnyOf(category, [TestCategory.ADI2, TestCategory.ADI3, TestCategory.SC])),
      ),
      cbtNumber$: currentTest$.pipe(
        select(getPreTestDeclarationsCatAMod1),
        select(getCBTNumberStatus),
      ),
      isRekey$: currentTest$.pipe(
        select(getRekeyIndicator),
        select(isRekey),
      ),
    };

    const {
      welshTest$,
      conductedLanguage$,
      testCategory$,
      isRekey$,
    } = this.pageState;

    this.merged$ = merge(
      currentTest$.pipe(
        select(getJournalData),
        tap((journalData: JournalData) => {
          if (this.isJournalDataInvalid(journalData)) {
            this.showCandidateDataMissingError();
          }
        }),
      ),
      welshTest$,
      conductedLanguage$.pipe(tap((value) => configureI18N(value as Language, this.translate))),
      testCategory$.pipe(tap((value) => this.testCategory = (value as TestCategory))),
      isRekey$.pipe(tap((value) => this.isRekey = value)),
    );
  }

  ionViewWillEnter(): boolean {
    if (this.merged$) {
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

  async canDeActivate() {
    try {
      await this.deviceAuthenticationProvider.triggerLockScreen();
      return true;
    } catch {
      return false;
    }
  }

  isJournalDataInvalid = (journalData: JournalData): boolean => {
    return isEmpty(journalData.examiner.staffNumber)
            || (isEmpty(journalData.candidate.candidateName) && isEmpty(journalData.candidate.driverNumber));
  };

  manoeuvresPassCertNumberChanged(manoeuvresPassCert: string): void {
    this.store$.dispatch(preTestDeclarationsActions.ManoeuvresPassCertNumberChanged(manoeuvresPassCert));
  }

  signatureChanged(signature: string): void {
    this.store$.dispatch(preTestDeclarationsActions.SignatureDataChanged(signature));
  }

  signatureCleared(): void {
    this.store$.dispatch(preTestDeclarationsActions.SignatureDataCleared());
  }

  insuranceDeclarationChanged(): void {
    this.store$.dispatch(preTestDeclarationsActions.ToggleInsuranceDeclaration());
  }

  residencyDeclarationChanged(): void {
    this.store$.dispatch(preTestDeclarationsActions.ToggleResidencyDeclaration());
  }

  dispatchCandidateChoseToProceedInWelsh(): void {
    this.store$.dispatch(CandidateChoseToProceedWithTestInWelsh(Language.CYMRAEG));
  }

  dispatchCandidateChoseToProceedInEnglish(): void {
    this.store$.dispatch(CandidateChoseToProceedWithTestInEnglish(Language.ENGLISH));
  }

  cbtNumberChanged(cbtNumber: string): void {
    this.store$.dispatch(CbtNumberChanged(cbtNumber));
  }

  async onSubmit(): Promise<void> {
    Object.keys(this.formGroup.controls).forEach((controlName) => this.formGroup.controls[controlName].markAsDirty());

    if (this.formGroup.valid) {
      const shouldNavToCandidateLicenceDetails: boolean = this.shouldNavigateToCandidateLicenceDetails();

      if (shouldNavToCandidateLicenceDetails) {
        try {
          await this.deviceAuthenticationProvider.triggerLockScreen();
        } catch {
          return;
        }
      }
      // navigate after successful device auth (if required) and when form is valid;
      await this.router.navigate(
        shouldNavToCandidateLicenceDetails
          ? [TestFlowPageNames.CANDIDATE_LICENCE_PAGE]
          : [TestFlowPageNames.COMMUNICATION_PAGE],
      );
      return;
    }

    Object.keys(this.formGroup.controls)
      .forEach((controlName) => {
        if (this.formGroup.controls[controlName].invalid) {
          if (controlName === CBT_NUMBER_CTRL) {
            this.store$.dispatch(waitingRoomActions.WaitingRoomValidationError(`${controlName} is invalid`));
          } else {
            this.store$.dispatch(waitingRoomActions.WaitingRoomValidationError(`${controlName} is blank`));
          }
        }
      });
  }

  async showCandidateDataMissingError(): Promise<void> {
    const errorModal: HTMLIonModalElement = await this.modalController.create({
      component: ErrorPage,
      cssClass: `modal-fullscreen ${this.app.getTextZoomClass()}`,
      componentProps: {
        errorType: ErrorTypes.JOURNAL_DATA_MISSING,
        displayAsModal: true,
      },
    });

    await errorModal.present();
    await errorModal.onWillDismiss();
    await this.router.navigate([DASHBOARD_PAGE], { replaceUrl: true });
  }

  private shouldNavigateToCandidateLicenceDetails = (): boolean => {
    // skip the candidate licence page when test is marked as a re-key or for non licence acquisition based categories.
    // if (this.isRekey || (isAnyOf(this.testCategory, [TestCategory.ADI3, TestCategory.SC]))) {
    //   return false;
    // }
    // return true;
    // @TODO: Re-introduce when CandidateID goes live;
    return false;
  };
}
