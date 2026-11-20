import { NgClass } from '@angular/common';
import { Component, computed } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { CandidateSectionComponent } from '@components/common/candidate-section/candidate-section';
import { LockScreenIndicator } from '@components/common/screen-lock-indicator/lock-screen-indicator';
import { SignatureComponent } from '@components/common/signature/signature';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { AddOrRemoveLangCyDirective } from '@directives/add-or-remove-lang-cy.directive';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import {
  IonCol,
  IonContent,
  IonHeader,
  IonRow,
  IonText,
  IonToolbar,
  ModalController,
  ViewDidEnter,
  ViewDidLeave,
  ViewWillEnter,
} from '@ionic/angular';
import { select } from '@ngrx/store';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { HealthDeclarationModal } from '@pages/health-declaration/components/health-declaration-modal/health-declaration-modal';
import {
  ContinueFromDeclaration,
  HealthDeclarationValidationError,
  HealthDeclarationViewDidEnter,
} from '@pages/health-declaration/health-declaration.actions';
import { CONFIRM_TEST_DETAILS } from '@pages/page-names.constants';
import { DeviceAuthenticationProvider } from '@providers/device-authentication/device-authentication';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { configureI18N } from '@shared/helpers/translation.helpers';
import { selectTestCategory } from '@store/tests/category/category.reducer';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { getCommunicationPreference } from '@store/tests/communication-preferences/communication-preferences.reducer';
import { getConductedLanguage } from '@store/tests/communication-preferences/communication-preferences.selector';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import {
  formatDriverNumber,
  getCandidateDriverNumber,
  getCandidateName,
  getCandidatePrn,
  getUntitledCandidateName,
} from '@store/tests/journal-data/common/candidate/candidate.selector';
import { ProvisionalLicenseNotReceived } from '@store/tests/pass-completion/pass-completion.actions';
import { getPassCompletion } from '@store/tests/pass-completion/pass-completion.reducer';
import {
  getPassCertificateNumber,
  isProvisionalLicenseProvided,
} from '@store/tests/pass-completion/pass-completion.selector';
import * as postTestDeclarationsActions from '@store/tests/post-test-declarations/post-test-declarations.actions';
import { getPostTestDeclarations } from '@store/tests/post-test-declarations/post-test-declarations.reducer';
import {
  getHealthDeclarationStatus,
  getReceiptDeclarationStatus,
  getSignatureStatus,
} from '@store/tests/post-test-declarations/post-test-declarations.selector';
import { selectCurrentTest } from '@store/tests/tests.selector';
import { Subscription } from 'rxjs';
import { HealthDeclarationComponent } from './components/health-declaration/health-declaration';
import { ReceiptDeclarationComponent } from './components/receipt-declaration/receipt-declaration';

@Component({
  selector: 'app-health-declaration',
  templateUrl: './health-declaration.page.html',
  styleUrls: ['./health-declaration.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    NgClass,
    TestFlowHeaderComponent,
    IonContent,
    LockScreenIndicator,
    FormsModule,
    ReactiveFormsModule,
    CandidateSectionComponent,
    IonRow,
    IonCol,
    IonText,
    AddOrRemoveLangCyDirective,
    HealthDeclarationComponent,
    ReceiptDeclarationComponent,
    SignatureComponent,
    TranslatePipe,
  ],
})
export class HealthDeclarationPage
  extends PracticeableBasePageComponent
  implements ViewDidEnter, ViewWillEnter, ViewDidLeave
{
  static readonly fieldName: string = 'healthCheckbox';
  formGroup: UntypedFormGroup;
  subscription: Subscription;
  formControl: UntypedFormControl;
  private readonly currentTest = this.store$.selectSignal(selectCurrentTest);
  private readonly declarations = computed(() => getPostTestDeclarations(this.currentTest()));
  private readonly candidate = computed(() => getCandidate(this.currentTest().journalData));
  private readonly passCompletion = computed(() => getPassCompletion(this.currentTest()));
  private readonly testCategory = this.store$.selectSignal(selectTestCategory);
  healthDeclarationAccepted = computed(() => getHealthDeclarationStatus(this.declarations()));
  receiptDeclarationAccepted = computed(() => getReceiptDeclarationStatus(this.declarations()));
  signature = computed(() => getSignatureStatus(this.declarations()));
  readonly candidateName = computed(() => getCandidateName(this.candidate()));
  readonly candidateUntitledName = computed(() => getUntitledCandidateName(this.candidate()));
  readonly candidateDriverNumber = computed(() => formatDriverNumber(getCandidateDriverNumber(this.candidate())));
  readonly passCertificateNumber = computed(() => getPassCertificateNumber(this.passCompletion()));
  licenseProvided = computed(() => isProvisionalLicenseProvided(this.passCompletion()));
  readonly prn = computed(() => getCandidatePrn(this.candidate()));
  readonly isStandardsCheck = computed(() => this.testCategory() === TestCategory.SC);
  readonly showHealthDec = computed(
    () =>
      !isAnyOf(this.testCategory(), [
        TestCategory.CM,
        TestCategory.C1M,
        TestCategory.CEM,
        TestCategory.C1EM,
        TestCategory.DM,
        TestCategory.D1M,
        TestCategory.DEM,
        TestCategory.D1EM,
      ])
  );

  constructor(
    public deviceAuthenticationProvider: DeviceAuthenticationProvider,
    public translate: TranslateService,
    public modalController: ModalController
  ) {
    super(false);
    this.formGroup = new UntypedFormGroup({});
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(HealthDeclarationViewDidEnter());
  }

  async canDeActivate(): Promise<boolean> {
    return await this.deviceAuthenticationProvider.triggerLockScreen(this.isPracticeMode);
  }

  ionViewWillEnter(): boolean {
    this.subscription?.unsubscribe();
    this.subscription = this.store$
      .pipe(select(selectCurrentTest), select(getCommunicationPreference), select(getConductedLanguage))
      .subscribe((value) => configureI18N(value as Language, this.translate));
    return true;
  }

  getSignatureDrawCompleteAction(signature: string): void {
    this.store$.dispatch(postTestDeclarationsActions.SignatureDataChanged(signature));
  }

  getSignatureClearAction(): void {
    this.store$.dispatch(postTestDeclarationsActions.SignatureDataCleared());
  }

  healthDeclarationChanged(isSelected: boolean): void {
    this.store$.dispatch(postTestDeclarationsActions.ToggleHealthDeclaration(isSelected));
  }

  receiptDeclarationChanged(isSelected: boolean): void {
    this.store$.dispatch(postTestDeclarationsActions.ToggleReceiptDeclaration(isSelected));
  }

  async onSubmit(): Promise<void> {
    Object.keys(this.formGroup.controls).forEach((controlName) => {
      this.formGroup.controls[controlName].markAsDirty();
    });

    if (this.formGroup.valid) {
      if (!this.healthDeclarationAccepted() && this.showHealthDec()) {
        await this.showConfirmHealthDeclarationModal();
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

  async showConfirmHealthDeclarationModal(): Promise<void> {
    const modal: HTMLIonModalElement = await this.modalController.create({
      id: 'HealthDeclarationModal',
      component: HealthDeclarationModal,
      cssClass: 'mes-modal-alert text-zoom-regular',
      backdropDismiss: false,
      showBackdrop: true,
      componentProps: {
        onTestDetailsConfirm: async () => this.persistAndNavigate(true),
        licenseProvided: this.licenseProvided(),
      },
    });
    await modal.present();
  }

  async persistAndNavigate(resetLicenseProvided: boolean) {
    const canNavigate: boolean = await this.router.navigate([CONFIRM_TEST_DETAILS]);

    if (canNavigate) {
      if (this.licenseProvided() && resetLicenseProvided) {
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
  }
}
