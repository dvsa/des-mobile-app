import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { SignatureAreaComponent } from '@components/common/signature-area/signature-area';
import { JournalData } from '@dvsa/mes-test-schema/categories/common';
import { ModalController } from '@ionic/angular';
import { DeviceAuthenticationProvider } from '@providers/device-authentication/device-authentication';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import {
  CandidateChoseToProceedWithTestInEnglish,
  CandidateChoseToProceedWithTestInWelsh,
} from '@store/tests/communication-preferences/communication-preferences.actions';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { selectConductedLanguage } from '@store/tests/communication-preferences/communication-preferences.selector';
import {
  selectCandidateName,
  selectFormatDriverNumber,
  selectUntitledCandidateName,
} from '@store/tests/journal-data/common/candidate/candidate.selector';
import { selectIsWelshTest } from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.selector';
import * as preTestDeclarationsActions from '@store/tests/pre-test-declarations/pre-test-declarations.actions';
import {
  selectInsuranceDeclarationStatus,
  selectResidencyDeclarationStatus,
  selectShowResidencyDec,
  selectSignatureStatus,
} from '@store/tests/pre-test-declarations/pre-test-declarations.selector';
import { selectJournalData } from '@store/tests/tests.selector';
import { isEmpty } from 'lodash-es';

import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { GetCandidateLicenceData } from '@pages/candidate-licence/candidate-licence.actions';
import { ErrorPage } from '@pages/error-page/error';
import { DASHBOARD_PAGE, TestFlowPageNames } from '@pages/page-names.constants';
import { CBT_NUMBER_CTRL } from '@pages/waiting-room/components/cbt-number/cbt-number.constants';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { ErrorTypes } from '@shared/models/error-message';
import { selectTestCategory } from '@store/tests/category/category.reducer';
import {
  selectCBTNumberStatus,
  selectShowCbtNumber,
} from '@store/tests/pre-test-declarations/cat-a-mod1/pre-test-declarations.cat-a-mod1.selector';
import { CbtNumberChanged } from '@store/tests/pre-test-declarations/cat-a/pre-test-declarations.cat-a.actions';
import {
  selectManoeuvrePassCertificateNumber,
  selectShowManoeuvresPassCertNumber,
} from '@store/tests/pre-test-declarations/cat-c/pre-test-declarations.cat-c.selector';
import { SignatureConfirmed } from '@store/tests/pre-test-declarations/pre-test-declarations.actions';
import { selectRekey } from '@store/tests/rekey/rekey.reducer';
import { selectShowVrnButton } from '@store/tests/vehicle-details/vehicle-details.selector';
import * as waitingRoomActions from './waiting-room.actions';

@Component({
  selector: 'app-waiting-room-page',
  templateUrl: './waiting-room.page.html',
  styleUrls: ['./waiting-room.page.scss'],
  standalone: false,
})
export class WaitingRoomPage extends PracticeableBasePageComponent implements OnInit {
  @ViewChild(SignatureAreaComponent)
  signatureAreaComponent: SignatureAreaComponent;

  formGroup: UntypedFormGroup;

  journalData = this.store$.selectSignal(selectJournalData)();
  candidateName = this.store$.selectSignal(selectCandidateName)();
  candidateUntitledName = this.store$.selectSignal(selectUntitledCandidateName)();
  candidateDriverNumber = this.store$.selectSignal(selectFormatDriverNumber)();
  testCategory = this.store$.selectSignal(selectTestCategory)();
  isRekey = this.store$.selectSignal(selectRekey)();
  showCbtNumber = this.store$.selectSignal(selectShowCbtNumber)();
  showVrnButton = this.store$.selectSignal(selectShowVrnButton)();
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
  private modalController = inject(ModalController);
  private accessibilityService = inject(AccessibilityService);

  constructor() {
    super(false);
    this.formGroup = new UntypedFormGroup({});
  }

  async ionViewDidEnter(): Promise<void> {
    this.store$.dispatch(waitingRoomActions.WaitingRoomViewDidEnter());
    this.store$.dispatch(GetCandidateLicenceData());
    await super.lockDevice(this.isEndToEndPracticeMode);
  }

  async ngOnInit(): Promise<void> {
    if (this.isJournalDataInvalid(this.journalData)) {
      await this.showCandidateDataMissingError();
    }
  }

  async canDeActivate() {
    return await this.deviceAuthenticationProvider.triggerLockScreen(this.isPracticeMode);
  }

  isJournalDataInvalid = (journalData: JournalData): boolean => {
    return (
      isEmpty(journalData.examiner.staffNumber) ||
      (isEmpty(journalData.candidate.candidateName) && isEmpty(journalData.candidate.driverNumber))
    );
  };

  manoeuvresPassCertNumberChanged(manoeuvresPassCert: string): void {
    this.store$.dispatch(
      preTestDeclarationsActions.ManoeuvresPassCertNumberChanged(manoeuvresPassCert ? manoeuvresPassCert : null)
    );
  }

  signatureChanged(signature: string): void {
    this.store$.dispatch(preTestDeclarationsActions.SignatureDataChanged(signature));
  }

  signatureCleared(): void {
    this.store$.dispatch(preTestDeclarationsActions.SignatureDataCleared());
  }

  insuranceDeclarationChanged(selected: boolean): void {
    this.store$.dispatch(preTestDeclarationsActions.ToggleInsuranceDeclaration(selected));
  }

  residencyDeclarationChanged(selected: boolean): void {
    this.store$.dispatch(preTestDeclarationsActions.ToggleResidencyDeclaration(selected));
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
        const isAuthed = await this.deviceAuthenticationProvider.triggerLockScreen(this.isEndToEndPracticeMode);
        if (!isAuthed) {
          return;
        }
      }

      this.store$.dispatch(SignatureConfirmed());

      // navigate after successful device auth (if required) and when form is valid;
      await this.router.navigate(
        shouldNavToCandidateLicenceDetails
          ? [TestFlowPageNames.CANDIDATE_LICENCE_PAGE]
          : [TestFlowPageNames.COMMUNICATION_PAGE]
      );
    }

    Object.keys(this.formGroup.controls).forEach((controlName) => {
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

  shouldNavigateToCandidateLicenceDetails = (): boolean => {
    // skip the candidate licence page when test is marked as a re-key or for non licence acquisition based categories.
    if (this.isRekey || isAnyOf(this.testCategory, [TestCategory.ADI3, TestCategory.SC])) {
      return false;
    }
    return true;
  };
}
