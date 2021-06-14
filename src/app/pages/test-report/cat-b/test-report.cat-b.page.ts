import { Component, OnInit } from '@angular/core';
import {
  Platform,
  ModalController,
} from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { Observable, merge, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthenticationProvider } from '@providers/authentication/authentication';
import { StoreModel } from '@shared/models/store.model';
import { getUntitledCandidateName } from '@store/tests/journal-data/common/candidate/candidate.selector';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import {
  getCurrentTest,
  getJournalData,
} from '@store/tests/tests.selector';
import {
  Competencies,
  LegalRequirements,
  ExaminerActions,
} from '@store/tests/test-data/test-data.constants';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import { getTests } from '@store/tests/tests.reducer';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { hasManoeuvreBeenCompletedCatB } from '@store/tests/test-data/cat-b/test-data.cat-b.selector';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import {
  getTestRequirementsCatB,
} from '@store/tests/test-data/cat-b/test-requirements/test-requirements.reducer';
import { legalRequirementsLabels } from '@shared/constants/legal-requirements/legal-requirements.constants';
import { Router } from '@angular/router';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { TestReportBasePageComponent } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
// eslint-disable-next-line max-len
import { LegalRequirementsModal } from '@pages/test-report/components/legal-requirements-modal/legal-requirements-modal';
import { EtaInvalidModal } from '@pages/test-report/components/eta-invalid-modal/eta-invalid-modal';
import { EndTestModal } from '@pages/test-report/components/end-test-modal/end-test-modal';
import { OverlayCallback } from '../test-report.model';
import { ModalEvent } from '../test-report.constants';
import { isRemoveFaultMode, isSeriousMode, isDangerousMode } from '../test-report.selector';
import { getTestReportState } from '../test-report.reducer';
import {
  TestReportViewDidEnter,
  CalculateTestResult,
  TerminateTestFromTestReport,
} from '../test-report.actions';
import { CAT_B } from '../../page-names.constants';

interface TestReportPageState {
  candidateUntitledName$: Observable<string>;
  isRemoveFaultMode$: Observable<boolean>;
  isSeriousMode$: Observable<boolean>;
  isDangerousMode$: Observable<boolean>;
  manoeuvres$: Observable<boolean>;
  testData$: Observable<CatBUniqueTypes.TestData>;
  testRequirements$: Observable<CatBUniqueTypes.TestRequirements>;
}

@Component({
  selector: '.test-report-cat-b-page',
  templateUrl: 'test-report.cat-b.page.html',
  styleUrls: ['test-report.cat-b.page.scss'],
})
export class TestReportCatBPage extends TestReportBasePageComponent implements OnInit {

  pageState: TestReportPageState;
  subscription: Subscription;
  competencies = Competencies;
  legalRequirements = LegalRequirements;
  eta = ExaminerActions;
  displayOverlay: boolean;

  isRemoveFaultMode: boolean = false;
  isSeriousMode: boolean = false;
  isDangerousMode: boolean = false;
  manoeuvresCompleted: boolean = false;
  isTestReportValid: boolean = false;
  isEtaValid: boolean = true;

  modal: HTMLIonModalElement;
  missingLegalRequirements: legalRequirementsLabels[] = [];

  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    private modalController: ModalController,
    public testReportValidatorProvider: TestReportValidatorProvider,
    public screenOrientation: ScreenOrientation,
    public insomnia: Insomnia,
    public statusBar: StatusBar,
  ) {
    super(platform, authenticationProvider, router, store$);
    this.displayOverlay = false;
  }

  getCallback(): OverlayCallback {
    return {
      callbackMethod: () => {
        this.toggleReportOverlay();
      },
    };
  }

  ngOnInit(): void {
    super.onInitialisation();
    // this.pageState = {
    //   ...this.commonPageState,
    // };

    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    this.pageState = {
      candidateUntitledName$: currentTest$.pipe(
        select(getJournalData),
        select(getCandidate),
        select(getUntitledCandidateName),
      ),
      isRemoveFaultMode$: this.store$.pipe(
        select(getTestReportState),
        select(isRemoveFaultMode),
      ),
      isSeriousMode$: this.store$.pipe(
        select(getTestReportState),
        select(isSeriousMode),
      ),
      isDangerousMode$: this.store$.pipe(
        select(getTestReportState),
        select(isDangerousMode),
      ),
      manoeuvres$: currentTest$.pipe(
        select(getTestData),
        select(hasManoeuvreBeenCompletedCatB),
      ),
      testData$: currentTest$.pipe(
        select(getTestData),
      ),
      testRequirements$: currentTest$.pipe(
        select(getTestData),
        select(getTestRequirementsCatB),
      ),
    };
    this.setupSubscription();

  }

  async ionViewWillEnter(): Promise<boolean> {
    // ionViewWillEnter lifecylce event used to ensure screen orientation is correct before page transition
    if (super.isIos() && this.isPracticeMode) {
      await this.screenOrientation.lock(
        this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY,
      );
      await this.insomnia.keepAwake();
      this.statusBar.hide();
    }
    return true;
  }

  ionViewDidEnter(): void {

    // it is possible that we come back to the page from the terminate screen
    // so need to re-establish the subscription if it doesn't exists or is closed
    if (!this.subscription || this.subscription.closed) {
      this.setupSubscription();
    }
    this.store$.dispatch(TestReportViewDidEnter());
  }

  ionViewWillLeave() {
    if (super.isIos() && this.isPracticeMode) {
      this.statusBar.show();
    }
  }

  toggleReportOverlay(): void {
    this.displayOverlay = !this.displayOverlay;
  }

  ionViewDidLeave(): void {
    super.ionViewDidLeave();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  setupSubscription() {
    const {
      candidateUntitledName$,
      isRemoveFaultMode$,
      isSeriousMode$,
      isDangerousMode$,
      manoeuvres$,
      testData$,
    } = this.pageState;

    this.subscription = merge(
      candidateUntitledName$,
      isRemoveFaultMode$.pipe(map((result) => (this.isRemoveFaultMode = result))),
      isSeriousMode$.pipe(map((result) => (this.isSeriousMode = result))),
      isDangerousMode$.pipe(map((result) => (this.isDangerousMode = result))),
      manoeuvres$.pipe(map((result) => (this.manoeuvresCompleted = result))),
      testData$.pipe(map((data) => {
        this.isTestReportValid = this.testReportValidatorProvider.isTestReportValid(data, TestCategory.B);
        this.missingLegalRequirements = this.testReportValidatorProvider.getMissingLegalRequirements(
          data,
          TestCategory.B,
        );
        this.isEtaValid = this.testReportValidatorProvider.isETAValid(data, TestCategory.B);
      })),
    )
      .subscribe();
  }

  onEndTestClick = async (): Promise<void> => {
    const modalCssClass: string = 'mes-modal-alert text-zoom-regular';
    if (!this.isTestReportValid) {
      this.modal = await this.modalController.create({
        component: LegalRequirementsModal,
        componentProps: {
          legalRequirements: this.missingLegalRequirements,
        },
        cssClass: modalCssClass,
      });
    } else if (!this.isEtaValid) {
      this.modal = await this.modalController.create({
        component: EtaInvalidModal,
        cssClass: modalCssClass,
      });
    } else {
      this.modal = await this.modalController.create({
        component: EndTestModal,
        cssClass: modalCssClass,
      });
    }

    await this.modal.present();
    const { data } = await this.modal.onWillDismiss();
    if (data) { await this.onModalDismiss(data); }
  };

  onModalDismiss = async (event: ModalEvent): Promise<void> => {
    // eslint-disable-next-line default-case
    switch (event) {
      case ModalEvent.CONTINUE:
        this.store$.dispatch(CalculateTestResult());
        await this.router.navigate([CAT_B.DEBRIEF_PAGE]);
        break;
      case ModalEvent.TERMINATE:
        this.store$.dispatch(TerminateTestFromTestReport());
        await this.router.navigate([CAT_B.DEBRIEF_PAGE]);
        break;
      default:
        break;
    }
  };

  onCancel = async (): Promise<void> => {
    await this.modal.dismiss();
  };

  onContinue = async (): Promise<void> => {
    await this.modal.dismiss();
    await this.router.navigate([CAT_B.DEBRIEF_PAGE]);
  };

  onTerminate = async (): Promise<void> => {
    await this.modal.dismiss();
    await this.router.navigate([CAT_B.DEBRIEF_PAGE]);
  };
}
