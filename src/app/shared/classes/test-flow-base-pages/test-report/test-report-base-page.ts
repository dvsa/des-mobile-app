import { select, Store } from '@ngrx/store';
import { merge, Observable, Subscription } from 'rxjs';
import { ModalController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';

import { StoreModel } from '@shared/models/store.model';
import { getUntitledCandidateName } from '@store/tests/journal-data/common/candidate/candidate.selector';
import { getCurrentTest, getJournalData } from '@store/tests/tests.selector';
import { getTests } from '@store/tests/tests.reducer';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import { AuthenticationProvider } from '@providers/authentication/authentication';

import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import { getTestReportState } from '@pages/test-report/test-report.reducer';
import { isDangerousMode, isRemoveFaultMode, isSeriousMode } from '@pages/test-report/test-report.selector';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { map, withLatestFrom } from 'rxjs/operators';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { legalRequirementsLabels } from '@shared/constants/legal-requirements/legal-requirements.constants';
import {
  CalculateTestResult,
  TerminateTestFromTestReport,
  TestReportViewDidEnter,
} from '@pages/test-report/test-report.actions';
import { Competencies, ExaminerActions, LegalRequirements } from '@store/tests/test-data/test-data.constants';
import { OverlayCallback } from '@pages/test-report/test-report.model';
import { ModalEvent } from '@pages/test-report/test-report.constants';
import { getPageNameByCategoryAndKey } from '@pages/page-names.constants';
import { EtaInvalidModal } from '@pages/test-report/components/eta-invalid-modal/eta-invalid-modal';
import { EndTestModal } from '@pages/test-report/components/end-test-modal/end-test-modal';
import { LegalRequirementsModal } from
  '@pages/test-report/components/legal-requirements-modal/legal-requirements-modal';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { hasManoeuvreBeenCompletedCatB } from '@store/tests/test-data/cat-b/test-data.cat-b.selector';
import { hasManoeuvreBeenCompletedCatBE } from '@store/tests/test-data/cat-be/test-data.cat-be.selector';
import { hasManoeuvreBeenCompletedCatC } from '@store/tests/test-data/cat-c/test-data.cat-c.selector';
import { hasManoeuvreBeenCompletedCatD } from '@store/tests/test-data/cat-d/test-data.cat-d.selector';
import { hasManoeuvreBeenCompletedCatHomeTest } from '@store/tests/test-data/cat-home/test-data.cat-home.selector';
import { CatBEUniqueTypes } from '@dvsa/mes-test-schema/categories/BE';
import { TestDataUnion, TestRequirementsUnion } from '@shared/unions/test-schema-unions';
import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { CatHUniqueTypes } from '@dvsa/mes-test-schema/categories/H';
import {
  getTestRequirementsCatB,
} from '@store/tests/test-data/cat-b/test-requirements/test-requirements.reducer';
import {
  getTestRequirementsCatBE,
} from '@store/tests/test-data/cat-be/test-requirements/test-requirements.cat-be.reducer';
import {
  getTestRequirementsCatC,
} from '@store/tests/test-data/cat-c/test-requirements/test-requirements.cat-c.reducer';
import {
  getTestRequirementsCatD,
} from '@store/tests/test-data/cat-d/test-requirements/test-requirements.cat-d.reducer';
import {
  getTestRequirementsCatHome,
} from '@store/tests/test-data/cat-home/test-requirements/test-requirements.cat-home.reducer';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';

export interface CommonTestReportPageState {
  candidateUntitledName$: Observable<string>;
  isRemoveFaultMode$: Observable<boolean>;
  isSeriousMode$: Observable<boolean>;
  isDangerousMode$: Observable<boolean>;
  manoeuvres$: Observable<boolean>;
  testData$: Observable<TestDataUnion>;
  testRequirements$: Observable<TestRequirementsUnion>;
  category$: Observable<CategoryCode>;
}

export abstract class TestReportBasePageComponent extends PracticeableBasePageComponent {

  commonPageState: CommonTestReportPageState;
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
  testCategory: TestCategory;
  debriefPageName: string;

  missingLegalRequirements: legalRequirementsLabels[] = [];
  modal: HTMLIonModalElement;

  protected constructor(
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
  }

  getCallback(): OverlayCallback {
    return {
      callbackMethod: () => {
        this.toggleReportOverlay();
      },
    };
  }

  onInitialisation(): void {
    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    this.commonPageState = {
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
      testData$: currentTest$.pipe(
        select(getTestData),
      ),
      manoeuvres$: currentTest$.pipe(
        select(getTestData),
        withLatestFrom(currentTest$.pipe(select(getTestCategory))),
        map(([testData, category]) => {
          this.debriefPageName = getPageNameByCategoryAndKey(category as TestCategory, 'DEBRIEF_PAGE');
          return this.hasManoeuvreBeenCompleted(testData, category);
        }),
      ),
      testRequirements$: currentTest$.pipe(
        select(getTestData),
        withLatestFrom(currentTest$.pipe(select(getTestCategory))),
        map(([testData, category]) => this.getTestRequirements(testData, category)),
      ),
      category$: currentTest$.pipe(
        select(getTestCategory),
      ),
    };
  }

  getTestRequirements(testData: TestDataUnion, category: CategoryCode): TestRequirementsUnion {
    switch (category) {
      case TestCategory.B:
        return getTestRequirementsCatB(testData) as CatBUniqueTypes.TestRequirements;
      case TestCategory.BE:
        return getTestRequirementsCatBE(testData) as CatBEUniqueTypes.TestRequirements;
      case TestCategory.C:
      case TestCategory.C1:
      case TestCategory.C1E:
        return getTestRequirementsCatC(testData) as CatCUniqueTypes.TestRequirements;
      case TestCategory.D:
      case TestCategory.D1:
      case TestCategory.DE:
      case TestCategory.D1E:
        return getTestRequirementsCatD(testData) as CatDUniqueTypes.TestRequirements;
      case TestCategory.F:
      case TestCategory.G:
      case TestCategory.H:
      case TestCategory.K:
        return getTestRequirementsCatHome(testData) as CatHUniqueTypes.TestRequirements;
      default:
        return getTestRequirementsCatB(testData) as CatBUniqueTypes.TestRequirements;
    }
  }

  hasManoeuvreBeenCompleted(data: TestDataUnion, category: CategoryCode) {
    switch (category) {
      case TestCategory.B:
        return hasManoeuvreBeenCompletedCatB(data as CatBUniqueTypes.TestData);
      case TestCategory.BE:
        return hasManoeuvreBeenCompletedCatBE(data as CatBEUniqueTypes.TestData);
      case TestCategory.C:
      case TestCategory.C1:
      case TestCategory.C1E:
        return hasManoeuvreBeenCompletedCatC(data as CatCUniqueTypes.TestData);
      case TestCategory.D:
      case TestCategory.D1:
      case TestCategory.DE:
      case TestCategory.D1E:
        return hasManoeuvreBeenCompletedCatD(data as CatDUniqueTypes.TestData);
      case TestCategory.F:
      case TestCategory.G:
      case TestCategory.H:
      case TestCategory.K:
        return hasManoeuvreBeenCompletedCatHomeTest(data as CatHUniqueTypes.TestData);
      default:
        return null;
    }
  }

  async ionViewWillEnter(): Promise<void> {
    // ionViewWillEnter lifecylce event used to ensure screen orientation is correct before page transition
    if (super.isIos() && this.isPracticeMode) {
      await this.screenOrientation.lock(
        this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY,
      );
      await this.insomnia.keepAwake();
      this.statusBar.hide();
    }
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

  setupSubscription() {
    const {
      candidateUntitledName$,
      isRemoveFaultMode$,
      isSeriousMode$,
      isDangerousMode$,
      manoeuvres$,
      testData$,
      category$,
    } = this.commonPageState;

    this.subscription = merge(
      candidateUntitledName$,
      isRemoveFaultMode$.pipe(map((result) => (this.isRemoveFaultMode = result))),
      isSeriousMode$.pipe(map((result) => (this.isSeriousMode = result))),
      isDangerousMode$.pipe(map((result) => (this.isDangerousMode = result))),
      manoeuvres$.pipe(map((result) => (this.manoeuvresCompleted = result))),
      testData$.pipe(
        withLatestFrom(category$),
        map(([data, category]) => {
          this.isTestReportValid = this.testReportValidatorProvider.isTestReportValid(data, category as TestCategory);
          this.missingLegalRequirements = this.testReportValidatorProvider.getMissingLegalRequirements(
            data,
            category as TestCategory,
          );
          this.isEtaValid = this.testReportValidatorProvider.isETAValid(data, category as TestCategory);
        }),
      ),
    )
      .subscribe();
  }

  cancelSubscription(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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
        await this.router.navigate([this.debriefPageName]);
        break;
      case ModalEvent.TERMINATE:
        this.store$.dispatch(TerminateTestFromTestReport());
        await this.router.navigate([this.debriefPageName]);
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
    await this.router.navigate([this.debriefPageName]);
  };

  onTerminate = async (): Promise<void> => {
    await this.modal.dismiss();
    await this.router.navigate([this.debriefPageName]);
  };

}
