import { Component, ViewChild, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavController, Platform, ModalController } from '@ionic/angular';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { Store, select } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import * as waitingRoomActions from '../waiting-room.actions';
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
import { CAT_B, ERROR_PAGE, LOGIN_PAGE } from '../../page-names.constants';
import {
  CandidateChoseToProceedWithTestInWelsh,
  CandidateChoseToProceedWithTestInEnglish,
} from '@store/tests/communication-preferences/communication-preferences.actions';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { DeviceProvider } from '@providers/device/device';
import { configureI18N } from '@shared/helpers/translation.helpers';
import { JournalData } from '@dvsa/mes-test-schema/categories/common';
import { isEmpty } from 'lodash';
import { ErrorTypes } from '@shared/models/error-message';
import { AppComponent } from '../../../app.component';
import { Router } from '@angular/router';
import { SignatureAreaComponent } from '@components/common/signature-area/signature-area';
import {
  SIGNATURE_DATA_CHANGED,
  SIGNATURE_DATA_CLEARED,
} from '@store/tests/pre-test-declarations/pre-test-declarations.actions';
import { SignatureComponent } from '@pages/waiting-room/components/signature/signature';

interface WaitingRoomPageState {
  insuranceDeclarationAccepted$: Observable<boolean>;
  residencyDeclarationAccepted$: Observable<boolean>;
  signature$: Observable<string>;
  candidateName$: Observable<string>;
  candidateUntitledName$: Observable<string>;
  candidateDriverNumber$: Observable<string>;
  welshTest$: Observable<boolean>;
  conductedLanguage$: Observable<string>;
}

@Component({
  selector: '.waiting-room-cat-b-page',
  templateUrl: 'waiting-room.cat-b.page.html',
  styleUrls: ['waiting-room.cat-b.page.scss'],
})
export class WaitingRoomCatBPage extends PracticeableBasePageComponent implements OnInit {

  // @ViewChild(Navbar) navBar: Navbar;

  @ViewChild(SignatureAreaComponent) signatureAreaComponent: SignatureAreaComponent

  @ViewChild(SignatureComponent) signatureComponent: SignatureComponent;

  pageState: WaitingRoomPageState;

  formGroup: FormGroup;

  subscription: Subscription;

  merged$: Observable<boolean | string | JournalData>;

  constructor(
    store$: Store<StoreModel>,
    public router: Router,
    public platform: Platform,
    public authenticationProvider: AuthenticationProvider,
    private deviceAuthenticationProvider: DeviceAuthenticationProvider,
    private deviceProvider: DeviceProvider,
    private screenOrientation: ScreenOrientation,
    private insomnia: Insomnia,
    private translate: TranslateService,
    private modalController: ModalController,
    private app: AppComponent,
    public navController: NavController,
  ) {
    super(platform, router, authenticationProvider, store$);
    this.formGroup = new FormGroup({});
  }

  async ionViewDidEnter(): Promise<void> {
    this.store$.dispatch(waitingRoomActions.WaitingRoomViewDidEnter());

    this.signatureComponent.initialiseSignature();

    if (super.isIos()) {
      await this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
      await this.insomnia.keepAwake();

      if (!this.isPracticeMode) {
        await this.deviceProvider.enableSingleAppMode();
      }
    }

    // @TODO - update this
    // this.navBar.backButtonClick = (e: UIEvent) => {
    //   this.clickBack();
    // };
  }

  clickBack(): void {
    this.deviceAuthenticationProvider.triggerLockScreen()
      .then(() => {
        this.navController.pop();
      })
      .catch((err) => {
        console.log(err);
      });
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
    };
    const { welshTest$, conductedLanguage$ } = this.pageState;
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
      conductedLanguage$.pipe(tap(value => configureI18N(value as Language, this.translate))),
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

  isJournalDataInvalid = (journalData: JournalData): boolean => {
    return isEmpty(journalData.examiner.staffNumber) ||
      (isEmpty(journalData.candidate.candidateName) && isEmpty(journalData.candidate.driverNumber));
  }

  getSignatureDrawCompleteAction(): string {
    return SIGNATURE_DATA_CHANGED;
  }

  getSignatureClearAction() {
    return SIGNATURE_DATA_CLEARED;
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

  onSubmit() {
    Object.keys(this.formGroup.controls).forEach(controlName => this.formGroup.controls[controlName].markAsDirty());
    if (this.formGroup.valid) {
      //@TODO
      // this.navController.push(CAT_B.COMMUNICATION_PAGE);
    } else {
      Object.keys(this.formGroup.controls).forEach((controlName) => {
        if (this.formGroup.controls[controlName].invalid) {
          this.store$.dispatch(waitingRoomActions.WaitingRoomValidationError(`${controlName} is blank`));
        }
      });
    }
  }

  showCandidateDataMissingError() {
    // Modals are at the same level as the ion-nav so are not getting the zoom level class,
    // this needs to be passed in the create options.
    // const zoomClass = `modal-fullscreen ${this.app.getTextZoomClass()}`;
    //
    // const errorModal = this.modalController.create(
    //   ERROR_PAGE,
    //   { type: ErrorTypes.JOURNAL_DATA_MISSING },
    //   { cssClass: zoomClass });
    // errorModal.present();
    // errorModal.onDidDismiss(() => this.navController.setRoot(LOGIN_PAGE));
  }
}
