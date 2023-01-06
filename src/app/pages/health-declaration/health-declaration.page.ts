import { Component, OnInit } from '@angular/core';
import {
  ModalController, Platform,
} from '@ionic/angular';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { CONFIRM_TEST_DETAILS } from '@pages/page-names.constants';
import { Observable, Subscription, merge } from 'rxjs';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
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
  getCandidateName, getCandidatePrn,
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
import { isAnyOf } from '@shared/helpers/simplifiers';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import {
  HealthDeclarationModal,
} from '@pages/health-declaration/components/health-declaration-modal/health-declaration-modal';

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
  showHealthDec$: Observable<boolean>;
  prn$: Observable<number>;
  isStandardsCheck$: Observable<boolean>;
}
@Component({
  selector: 'app-health-declaration',
  templateUrl: './health-declaration.page.html',
  styleUrls: ['./health-declaration.page.scss'],
})
export class HealthDeclarationPage extends PracticeableBasePageComponent implements OnInit {

  pageState: HealthDeclarationPageState;
  formGroup: UntypedFormGroup;
  licenseProvided: boolean;
  healthDeclarationAccepted: boolean;
  subscription: Subscription;
  merged$: Observable<boolean | string>;
  formControl: UntypedFormControl;
  showHealthDec: boolean = true;
  static readonly fieldName: string = 'healthCheckbox';

  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    public deviceAuthenticationProvider: DeviceAuthenticationProvider,
    private translate: TranslateService,
    public modalController: ModalController,
    public routeByCat: RouteByCategoryProvider,
  ) {
    super(platform, authenticationProvider, router, store$, false);
    this.formGroup = new UntypedFormGroup({});
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(HealthDeclarationViewDidEnter());
  }

  async canDeActivate(): Promise<boolean> {
    try {
      await this.deviceAuthenticationProvider.triggerLockScreen();
      return true;
    } catch {
      return false;
    }
  }

  ngOnInit(): void {
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
      showHealthDec$: currentTest$.pipe(
        select(getTestCategory),
        map((category) => !isAnyOf(category, [
          TestCategory.CM, TestCategory.C1M, TestCategory.CEM, TestCategory.C1EM,
          TestCategory.DM, TestCategory.D1M, TestCategory.DEM, TestCategory.D1EM,
        ])),
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
    };

    const {
      licenseProvided$, healthDeclarationAccepted$, conductedLanguage$, showHealthDec$,
    } = this.pageState;

    this.merged$ = merge(
      licenseProvided$.pipe(map((val) => this.licenseProvided = val)),
      healthDeclarationAccepted$.pipe(map((val) => this.healthDeclarationAccepted = val)),
      showHealthDec$.pipe(map((val) => this.showHealthDec = val)),
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

  async onSubmit(): Promise<void> {
    Object.keys(this.formGroup.controls).forEach((controlName) => this.formGroup.controls[controlName].markAsDirty());

    if (this.formGroup.valid) {
      if (!this.healthDeclarationAccepted && this.showHealthDec) {
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
        licenseProvided: this.licenseProvided,
      },
    });
    await modal.present();
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
  }
}
