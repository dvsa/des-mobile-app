import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import * as preTestDeclarationsActions from '@store/tests/pre-test-declarations/pre-test-declarations.actions';
import {
  selectInsuranceDeclarationStatus,
  selectResidencyDeclarationStatus,
  selectShowResidencyDec,
  selectSignatureStatus,
} from '@store/tests/pre-test-declarations/pre-test-declarations.selector';
import {
  selectCandidateName,
  selectFormatDriverNumber,
  selectUntitledCandidateName,
} from '@store/tests/journal-data/common/candidate/candidate.selector';
import { DeviceAuthenticationProvider } from '@providers/device-authentication/device-authentication';
import {
  selectIsWelshTest,
} from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.selector';
import { selectConductedLanguage } from '@store/tests/communication-preferences/communication-preferences.selector';
import {
  CandidateChoseToProceedWithTestInEnglish,
  CandidateChoseToProceedWithTestInWelsh,
} from '@store/tests/communication-preferences/communication-preferences.actions';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { OrientationType, ScreenOrientation } from '@capawesome/capacitor-screen-orientation';

import { DeviceProvider } from '@providers/device/device';
import { JournalData } from '@dvsa/mes-test-schema/categories/common';
import { isEmpty } from 'lodash';
import { SignatureAreaComponent } from '@components/common/signature-area/signature-area';

import { DASHBOARD_PAGE, TestFlowPageNames } from '@pages/page-names.constants';
import { ErrorTypes } from '@shared/models/error-message';
import { selectTestCategory } from '@store/tests/category/category.reducer';
import {
  selectManoeuvrePassCertificateNumber,
  selectShowManoeuvresPassCertNumber,
} from '@store/tests/pre-test-declarations/cat-c/pre-test-declarations.cat-c.selector';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { CbtNumberChanged } from '@store/tests/pre-test-declarations/cat-a/pre-test-declarations.cat-a.actions';
import {
  selectCBTNumberStatus,
  selectShowCbtNumber,
} from '@store/tests/pre-test-declarations/cat-a-mod1/pre-test-declarations.cat-a-mod1.selector';
import { CBT_NUMBER_CTRL } from '@pages/waiting-room/components/cbt-number/cbt-number.constants';
import { ErrorPage } from '@pages/error-page/error';
import { GetCandidateLicenceData } from '@pages/candidate-licence/candidate-licence.actions';
import { selectRekey } from '@store/tests/rekey/rekey.reducer';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { selectJournalData } from '@store/tests/tests.selector';
import * as waitingRoomActions from './waiting-room.actions';

@Component({
  selector: 'app-waiting-room-page',
  templateUrl: 'waiting-room.page.html',
  styleUrls: ['waiting-room.page.scss'],
})
export class WaitingRoomPage extends PracticeableBasePageComponent implements OnInit {
  @ViewChild(SignatureAreaComponent) signatureAreaComponent: SignatureAreaComponent;
  formGroup: UntypedFormGroup;

  journalData = this.store$.selectSignal(selectJournalData)();
  candidateName = this.store$.selectSignal(selectCandidateName)();
  candidateUntitledName = this.store$.selectSignal(selectUntitledCandidateName)();
  candidateDriverNumber = this.store$.selectSignal(selectFormatDriverNumber)();
  testCategory = this.store$.selectSignal(selectTestCategory)();
  isRekey = this.store$.selectSignal(selectRekey)();
  showCbtNumber = this.store$.selectSignal(selectShowCbtNumber)();
  showManoeuvresPassCertNumber = this.store$.selectSignal(selectShowManoeuvresPassCertNumber)();
  showResidencyDec = this.store$.selectSignal(selectShowResidencyDec)();

  conductedLanguage = this.store$.selectSignal(selectConductedLanguage);
  insuranceDeclarationAccepted = this.store$.selectSignal(selectInsuranceDeclarationStatus);
  residencyDeclarationAccepted = this.store$.selectSignal(selectResidencyDeclarationStatus);
  signature = this.store$.selectSignal(selectSignatureStatus);
  manoeuvresPassCertNumber = this.store$.selectSignal(selectManoeuvrePassCertificateNumber);
  cbtNumber = this.store$.selectSignal(selectCBTNumberStatus);
  welshTest = this.store$.selectSignal(selectIsWelshTest);

  private deviceAuthenticationProvider = inject(DeviceAuthenticationProvider);
  private deviceProvider = inject(DeviceProvider);
  private insomnia = inject(Insomnia);
  private modalController = inject(ModalController);
  private accessibilityService = inject(AccessibilityService);

  constructor() {
    super();
    this.formGroup = new UntypedFormGroup({});
  }

  async ngOnInit(): Promise<void> {
    if (this.isJournalDataInvalid(this.journalData)) {
      await this.showCandidateDataMissingError();
    }
  }

  async ionViewDidEnter(): Promise<void> {
    this.store$.dispatch(waitingRoomActions.WaitingRoomViewDidEnter());
    this.store$.dispatch(GetCandidateLicenceData());

    if (super.isIos()) {
      await ScreenOrientation.lock({ type: OrientationType.PORTRAIT_PRIMARY });
      await this.insomnia.keepAwake();

      if (!this.isEndToEndPracticeMode) {
        await this.deviceProvider.enableSingleAppMode();
      }
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
    Object.keys(this.formGroup.controls)
      .forEach((controlName) => this.formGroup.controls[controlName].markAsDirty());

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
      cssClass: `modal-fullscreen ${this.accessibilityService.getTextZoomClass()}`,
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
    if (this.isRekey || (isAnyOf(this.testCategory, [TestCategory.ADI3, TestCategory.SC]))) {
      return false;
    }
    return true;
  };

  isJournalDataInvalid = (journalData: JournalData): boolean => {
    return (
      isEmpty(journalData.examiner.staffNumber)
      || (isEmpty(journalData.candidate.candidateName) && isEmpty(journalData.candidate.driverNumber))
    );
  };
}
