import { Component } from '@angular/core';
import { merge, Observable, Subscription } from 'rxjs';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { GearboxCategory } from '@dvsa/mes-test-schema/categories/common';
import { getTests } from '@store/tests/tests.reducer';
import {
  getActivityCode,
  getCurrentTest,
  getJournalData,
  getTestOutcomeText,
} from '@store/tests/tests.selector';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import {
  getCandidateName,
  getUntitledCandidateName,
} from '@store/tests/journal-data/common/candidate/candidate.selector';
import { getTestSlotAttributes }
  from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.reducer';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { map, tap } from 'rxjs/operators';
import { getTestStartDateTime }
  from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.selector';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { isProvisionalLicenseProvided } from '@store/tests/pass-completion/pass-completion.selector';
import { getGearboxCategory } from '@store/tests/vehicle-details/vehicle-details.selector';
import { getTestSummary } from '@store/tests/test-summary/test-summary.reducer';
import { getD255 } from '@store/tests/test-summary/test-summary.selector';
import { getPassCompletion } from '@store/tests/pass-completion/pass-completion.reducer';
import {
  CategorySpecificVehicleDetails,
  VehicleDetailsByCategoryProvider,
} from '@providers/vehicle-details-by-category/vehicle-details-by-category';
import { TestOutcome } from '@store/tests/tests.constants';
import { SetTestStatusWriteUp } from '@store/tests/test-status/test-status.actions';
import { PersistTests } from '@store/tests/tests.actions';
import { getCode78 } from '@store/tests/pass-completion/cad-d/pass-completion.cat-d.selector';
import { Router } from '@angular/router';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { ActivityCodeModel } from '@shared/constants/activity-code/activity-code.constants';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { ConfirmSubmitModal } from './components/confirm-submit-modal/confirm-submit-modal';
import { ConfirmTestDetailsViewDidEnter } from './confirm-test-details.actions';
import { TestFlowPageNames } from '../page-names.constants';

interface ConfirmTestDetailsPageState {
  candidateUntitledName$: Observable<string>;
  candidateName$: Observable<string>;
  startDateTime$: Observable<string>;
  testOutcomeText$: Observable<string>;
  activityCode$: Observable<ActivityCodeModel>;
  testCategory$: Observable<TestCategory>;
  provisionalLicense$?: Observable<boolean>;
  transmission$: Observable<GearboxCategory>;
  code78$: Observable<boolean>;
  d255$: Observable<boolean>;
  slotId$: Observable<string>;
}

enum LicenceReceivedText {
  TRUE = 'Yes - Please retain the candidates licence',
  FALSE = 'No - Please ensure that the licence is kept by the candidate',
}

enum D255 {
  TRUE = 'Yes - Please complete a D255',
  FALSE = 'No',
}

@Component({
  selector: 'confirm-test-details-page',
  templateUrl: 'confirm-test-details.page.html',
  styleUrls: ['confirm-test-details.page.scss'],
})

export class ConfirmTestDetailsPage extends PracticeableBasePageComponent {

  pageState: ConfirmTestDetailsPageState;
  category: TestCategory;
  testOutcome: string;
  candidateName: string;
  subscription: Subscription;
  merged$: Observable<boolean | string>;
  vehicleDetails: CategorySpecificVehicleDetails;
  slotId: string;
  idPrefix: string = 'confirm-test-details';

  constructor(
    public platform: Platform,
    public authenticationProvider: AuthenticationProvider,
    public router: Router,
    store$: Store<StoreModel>,
    public navController: NavController,
    public vehicleDetailsProvider: VehicleDetailsByCategoryProvider,
    private modalController: ModalController,
  ) {
    super(platform, authenticationProvider, router, store$);
  }

  ionViewWillEnter(): boolean {
    if (this.merged$) {
      this.subscription = this.merged$.subscribe();
    }
    return true;
  }

  isADI2(category: TestCategory): boolean {
    return category === TestCategory.ADI2;
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(ConfirmTestDetailsViewDidEnter());
  }

  async goBackToDebrief(): Promise<void> {
    await this.navController.navigateBack(TestFlowPageNames.DEBRIEF_PAGE);
  }

  ngOnInit(): void {
    super.ngOnInit();

    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    let category: TestCategory;
    currentTest$.pipe(select(getTestCategory))
      .subscribe((value) => {
        category = value as TestCategory;
        const vehicleDetails = this.vehicleDetailsProvider.getVehicleDetailsByCategoryCode(category);
        this.pageState = {
          slotId$: this.store$.pipe(
            select(getTests),
            map((tests) => tests.currentTest.slotId),
          ),
          candidateUntitledName$: currentTest$.pipe(
            select(getJournalData),
            select(getCandidate),
            select(getUntitledCandidateName),
          ),
          candidateName$: currentTest$.pipe(
            select(getJournalData),
            select(getCandidate),
            select(getCandidateName),
          ),
          startDateTime$: currentTest$.pipe(
            select(getJournalData),
            select(getTestSlotAttributes),
            select(getTestStartDateTime),
          ),
          testOutcomeText$: currentTest$.pipe(
            select(getTestOutcomeText),
          ),
          activityCode$: currentTest$.pipe(
            select(getActivityCode),
          ),
          testCategory$: currentTest$.pipe(
            select(getTestCategory),
            map((testCategory) => testCategory as TestCategory),
          ),
          transmission$: currentTest$.pipe(
            select(vehicleDetails.vehicleDetails),
            select(getGearboxCategory),
          ),
          code78$: currentTest$.pipe(
            select(getPassCompletion),
            select(getCode78),
          ),
          d255$: currentTest$.pipe(
            select(getTestSummary),
            select(getD255),
          ),
        };
        if (category !== TestCategory.ADI2) {
          this.pageState = {
            ...this.pageState,
            provisionalLicense$: currentTest$.pipe(
              select(getPassCompletion),
              map(isProvisionalLicenseProvided),
            ),
          };
        }
      });

    const {
      testCategory$,
      testOutcomeText$,
      candidateUntitledName$,
      slotId$,
    } = this.pageState;

    this.merged$ = merge(
      testCategory$.pipe(map((value) => this.category = value)),
      testOutcomeText$.pipe(map((value) => this.testOutcome = value)),
      candidateUntitledName$.pipe(tap((value) => this.candidateName = value)),
      slotId$.pipe(map((slotId) => this.slotId = slotId)),
    );
  }

  isTerminated(testResult: string): boolean {
    return testResult === TestOutcome.Terminated;
  }

  isPassed(testResult: string): boolean {
    return testResult === TestOutcome.Passed;
  }

  getActivityCode(activityCodeModel: ActivityCodeModel): string {
    return `${activityCodeModel.activityCode} - ${activityCodeModel.description}`;
  }

  getProvisionalText(received: boolean): LicenceReceivedText {
    return received ? LicenceReceivedText.TRUE : LicenceReceivedText.FALSE;
  }

  getD255Text(d255: boolean): D255 {
    return d255 ? D255.TRUE : D255.FALSE;
  }

  async onSubmit() {
    await this.showConfirmTestDetailsModal();
  }

  async showConfirmTestDetailsModal(): Promise<void> {
    const modal: HTMLIonModalElement = await this.modalController.create({
      id: 'ConfirmSubmitModal',
      component: ConfirmSubmitModal,
      cssClass: 'mes-modal-alert text-zoom-regular',
      backdropDismiss: false,
      showBackdrop: true,
      componentProps: {
        onTestDetailsConfirm: this.onTestDetailsConfirm,
        testOutcome: this.testOutcome,
        category: this.category,
        candidateName: this.candidateName,
      },
    });
    await modal.present();
  }

  onTestDetailsConfirm = async (): Promise<void> => {
    this.store$.dispatch(SetTestStatusWriteUp(this.slotId));
    this.store$.dispatch(PersistTests());
    await this.router.navigate([TestFlowPageNames.BACK_TO_OFFICE_PAGE], { replaceUrl: true });
  };

  ionViewDidLeave(): void {
    super.ionViewDidLeave();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
