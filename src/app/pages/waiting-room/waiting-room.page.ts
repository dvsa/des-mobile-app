import { Component, ViewChild, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Platform, ModalController } from '@ionic/angular';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { Store, select } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { Observable, merge, Subscription } from 'rxjs';
import {
  getPreTestDeclarations,
} from '@store/tests/pre-test-declarations/pre-test-declarations.reducer';
import * as preTestDeclarationsActions
  from '@store/tests/pre-test-declarations/pre-test-declarations.actions';
import {
  getInsuranceDeclarationStatus,
  getResidencyDeclarationStatus,
  getSignatureStatus,
} from '@store/tests/pre-test-declarations/pre-test-declarations.selector';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import {
  getCandidateName, getCandidateDriverNumber, formatDriverNumber, getUntitledCandidateName,
} from '@store/tests/journal-data/common/candidate/candidate.selector';
import { map, tap } from 'rxjs/operators';
import { getCurrentTest, getJournalData } from '@store/tests/tests.selector';
import { DeviceAuthenticationProvider } from '@providers/device-authentication/device-authentication';
import { getTests } from '@store/tests/tests.reducer';
import { TranslateService } from '@ngx-translate/core';
import {
  getTestSlotAttributes,
} from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.reducer';
import { isWelshTest }
  from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.selector';
import {
  getCommunicationPreference,
} from '@store/tests/communication-preferences/communication-preferences.reducer';
import {
  getConductedLanguage,
} from '@store/tests/communication-preferences/communication-preferences.selector';
import {
  CandidateChoseToProceedWithTestInWelsh,
  CandidateChoseToProceedWithTestInEnglish,
} from '@store/tests/communication-preferences/communication-preferences.actions';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { DeviceProvider } from '@providers/device/device';
import { configureI18N } from '@shared/helpers/translation.helpers';
import { CategoryCode, JournalData } from '@dvsa/mes-test-schema/categories/common';
import { isEmpty } from 'lodash';
import { Router } from '@angular/router';
import { SignatureAreaComponent } from '@components/common/signature-area/signature-area';
import { SignatureComponent } from '@pages/waiting-room/components/signature/signature';

import {
  ERROR_PAGE, JOURNAL_PAGE, LOGIN_PAGE, TestFlowPageNames,
} from '@pages/page-names.constants';
import { ErrorTypes } from '@shared/models/error-message';
import { AppComponent } from '@app/app.component';
import { getTestCategory } from '@store/tests/category/category.reducer';
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
}

@Component({
  selector: '.waiting-room-page',
  templateUrl: './waiting-room.page.html',
  styleUrls: ['./waiting-room.page.scss'],
})
export class WaitingRoomPage extends PracticeableBasePageComponent implements OnInit {

  @ViewChild(SignatureAreaComponent) signatureAreaComponent: SignatureAreaComponent;
  @ViewChild(SignatureComponent) signatureComponent: SignatureComponent;

  pageState: WaitingRoomPageState;

  formGroup: FormGroup;

  subscription: Subscription;

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
    super(platform, authenticationProvider, router, store$);
    this.formGroup = new FormGroup({});
  }

  async ionViewDidEnter(): Promise<void> {

    this.store$.dispatch(waitingRoomActions.WaitingRoomViewDidEnter());

    if (super.isIos()) {
      await this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
      await this.insomnia.keepAwake();

      if (!this.isPracticeMode) {
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
    };
    const {
      welshTest$,
      conductedLanguage$,
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

  async clickBack(): Promise<void> {
    try {
      await this.deviceAuthenticationProvider.triggerLockScreen();
      await this.router.navigate([JOURNAL_PAGE]);
    } catch (err) {
      console.error(err);
    }
  }

  isJournalDataInvalid = (journalData: JournalData): boolean => {
    return isEmpty(journalData.examiner.staffNumber)
      || (isEmpty(journalData.candidate.candidateName) && isEmpty(journalData.candidate.driverNumber));
  };

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

  dispatchCandidateChoseToProceedInWelsh() {
    this.store$.dispatch(CandidateChoseToProceedWithTestInWelsh(Language.CYMRAEG));
  }

  dispatchCandidateChoseToProceedInEnglish() {
    this.store$.dispatch(CandidateChoseToProceedWithTestInEnglish(Language.ENGLISH));
  }

  async onSubmit() {
    Object.keys(this.formGroup.controls)
      .forEach((controlName) => this.formGroup.controls[controlName].markAsDirty());
    if (this.formGroup.valid) {
      await this.router.navigate([TestFlowPageNames.COMMUNICATION_PAGE]);
    } else {
      Object.keys(this.formGroup.controls)
        .forEach((controlName) => {
          if (this.formGroup.controls[controlName].invalid) {
            this.store$.dispatch(waitingRoomActions.WaitingRoomValidationError(`${controlName} is blank`));
          }
        });
    }
  }

  async showCandidateDataMissingError() {
    // Modals are at the same level as the ion-nav so are not getting the zoom level class,
    // this needs to be passed in the create options.
    const zoomClass = `modal-fullscreen ${this.app.getTextZoomClass()}`;

    const errorModal = await this.modalController.create(
      {
        component: ERROR_PAGE,
        cssClass: zoomClass,
        componentProps: {
          type: ErrorTypes.JOURNAL_DATA_MISSING,
        },
      },
    );

    errorModal.onDidDismiss()
      .then(async () => {
        await this.router.navigate([LOGIN_PAGE], { replaceUrl: true });
      });

    await errorModal.present();
  }
}
