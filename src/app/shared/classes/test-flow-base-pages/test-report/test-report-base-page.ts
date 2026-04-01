import { OrientationType, ScreenOrientation } from '@capawesome/capacitor-screen-orientation';
import { ModalController } from '@ionic/angular';
import { Subject, Subscription } from 'rxjs';

import { selectUntitledCandidateName } from '@store/tests/journal-data/common/candidate/candidate.selector';

import { Inject, computed, inject } from '@angular/core';
import { KeepAwake as Insomnia } from '@capacitor-community/keep-awake';
import { StatusBar } from '@capacitor/status-bar';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { CatHUniqueTypes } from '@dvsa/mes-test-schema/categories/H';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { EndTestModal } from '@pages/test-report/components/end-test-modal/end-test-modal';
import { EtaInvalidModal } from '@pages/test-report/components/eta-invalid-modal/eta-invalid-modal';
import { LegalRequirementsModal } from '@pages/test-report/components/legal-requirements-modal/legal-requirements-modal';
import { SpecialLegalRequirementModal } from '@pages/test-report/components/special-legal-requirement-modal/special-legal-requirement-modal';
import {
  CalculateTestResult,
  ResetFaultMode,
  ReturnToTest,
  TerminateTestFromTestReport,
  TestReportViewDidEnter,
} from '@pages/test-report/test-report.actions';
import { ModalEvent } from '@pages/test-report/test-report.constants';
import { OverlayCallback } from '@pages/test-report/test-report.model';
import {
  selectIsDangerousMode,
  selectIsRemoveFaultMode,
  selectIsSeriousMode,
} from '@pages/test-report/test-report.selector';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { TestDataUnion, TestRequirementsUnion } from '@shared/unions/test-schema-unions';
import { SetActivityCode } from '@store/tests/activity-code/activity-code.actions';
import { selectTestCategory } from '@store/tests/category/category.reducer';
import { hasManoeuvreBeenCompletedCatADIPart2 } from '@store/tests/test-data/cat-adi-part2/test-data.cat-adi-part2.selector';
import { hasManoeuvreBeenCompletedCatB } from '@store/tests/test-data/cat-b/test-data.cat-b.selector';
import { getTestRequirementsCatB } from '@store/tests/test-data/cat-b/test-requirements/test-requirements.reducer';
import { hasManoeuvreBeenCompletedCatC } from '@store/tests/test-data/cat-c/test-data.cat-c.selector';
import { getTestRequirementsCatC } from '@store/tests/test-data/cat-c/test-requirements/test-requirements.cat-c.reducer';
import { hasManoeuvreBeenCompletedCatD } from '@store/tests/test-data/cat-d/test-data.cat-d.selector';
import { getTestRequirementsCatD } from '@store/tests/test-data/cat-d/test-requirements/test-requirements.cat-d.reducer';
import { hasManoeuvreBeenCompletedCatHomeTest } from '@store/tests/test-data/cat-home/test-data.cat-home.selector';
import { getTestRequirementsCatHome } from '@store/tests/test-data/cat-home/test-requirements/test-requirements.cat-home.reducer';
import { selectTestData } from '@store/tests/test-data/common/test-data.selector';
import { Competencies, ExaminerActions, LegalRequirements } from '@store/tests/test-data/test-data.constants';

export const trDestroy$ = new Subject<{}>();

export abstract class TestReportBasePageComponent extends PracticeableBasePageComponent {
  public modalController = inject(ModalController);
  protected testReportValidatorProvider = inject(TestReportValidatorProvider);
  routeByCategory = inject(RouteByCategoryProvider);

  subscription: Subscription;
  competencies = Competencies;
  legalRequirements = LegalRequirements;
  eta = ExaminerActions;
  displayOverlay: boolean;

  category = this.store$.selectSignal(selectTestCategory)();
  candidateUntitledName = this.store$.selectSignal(selectUntitledCandidateName)();

  //Setup that the modes as signals so their value is updated live
  isRemoveFaultMode = this.store$.selectSignal(selectIsRemoveFaultMode);
  isSeriousMode = this.store$.selectSignal(selectIsSeriousMode);
  isDangerousMode = this.store$.selectSignal(selectIsDangerousMode);
  testData = this.store$.selectSignal(selectTestData);

  //These variables are computed, meaning they update live as the signals mentioned within them are updated
  isEtaValid = computed(() => {
    return this.testReportValidatorProvider.isETAValid(this.testData(), this.category as TestCategory);
  });

  isTestReportValid = computed(() => {
    return this.testReportValidatorProvider.isTestReportValid(
      this.testData(),
      this.category as TestCategory,
      this.isDelegated
    );
  });

  manoeuvresCompleted = computed(() => {
    return this.hasManoeuvreBeenCompleted(this.testData(), this.category);
  });

  missingLegalRequirements = computed(() => {
    return this.testReportValidatorProvider.getMissingLegalRequirements(
      this.testData(),
      this.category as TestCategory,
      this.isDelegated
    );
  });

  testRequirements = computed(() => {
    return this.getTestRequirements(this.testData(), this.category as TestCategory);
  });

  modal: HTMLIonModalElement;

  protected constructor(@Inject(false) public loginRequired = false) {
    super(loginRequired);
  }

  getCallback(): OverlayCallback {
    return {
      callbackMethod: () => {
        this.toggleReportOverlay();
      },
    };
  }

  onInitialisation(): void {
    super.ngOnInit();
  }

  getTestRequirements(testData: TestDataUnion, category: CategoryCode): TestRequirementsUnion {
    switch (category) {
      case TestCategory.B:
        return getTestRequirementsCatB(testData) as CatBUniqueTypes.TestRequirements;
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
      case TestCategory.ADI2:
        return hasManoeuvreBeenCompletedCatADIPart2((data as CatADI2UniqueTypes.TestData)?.manoeuvres);
      case TestCategory.B:
        return hasManoeuvreBeenCompletedCatB(data as CatBUniqueTypes.TestData);
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
    // ionViewWillEnter lifecycle event used to ensure screen orientation is correct before page transition
    if (super.isIos() && this.isPracticeMode) {
      await ScreenOrientation.lock({ type: OrientationType.PORTRAIT_PRIMARY });
      await Insomnia.keepAwake();
    }
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(TestReportViewDidEnter());
  }

  async ionViewWillLeave(): Promise<void> {
    if (super.isIos() && this.isPracticeMode) {
      await StatusBar.show();
    }
    this.store$.dispatch(ResetFaultMode());
  }

  toggleReportOverlay(): void {
    this.displayOverlay = !this.displayOverlay;
  }

  onEndTestClick = async (): Promise<void> => {
    const modalCssClass: string = 'mes-modal-alert text-zoom-regular';
    if (!this.isTestReportValid()) {
      this.modal = await this.modalController.create({
        component: LegalRequirementsModal,
        componentProps: {
          legalRequirements: this.missingLegalRequirements(),
          isDelegated: this.isDelegated,
        },
        cssClass: modalCssClass,
      });
    } else if (!this.isEtaValid()) {
      this.modal = await this.modalController.create({
        component: EtaInvalidModal,
        cssClass: modalCssClass,
      });
    } else if (
      !this.manoeuvresCompleted() &&
      isAnyOf(this.category, [TestCategory.F, TestCategory.G, TestCategory.H]) &&
      this.category !== TestCategory.K
    ) {
      this.modal = await this.modalController.create({
        component: SpecialLegalRequirementModal,
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
    if (data) {
      await this.onModalDismiss(data);
    }
  };

  onModalDismiss = async (event: ModalEvent): Promise<void> => {
    const nextPage: string = this.isDelegated
      ? this.routeByCategory.getNextPage(TestFlowPageNames.OFFICE_PAGE, this.category as TestCategory)
      : TestFlowPageNames.DEBRIEF_PAGE;

    switch (event) {
      case ModalEvent.CONTINUE:
        this.store$.dispatch(CalculateTestResult());
        await this.router.navigate([nextPage]);
        break;
      case ModalEvent.TERMINATE:
        this.store$.dispatch(TerminateTestFromTestReport());
        await this.router.navigate([nextPage]);
        break;
      case ModalEvent.END_WITH_ACTIVITY_CODE_4:
        this.store$.dispatch(SetActivityCode('4'));
        await this.router.navigate([nextPage]);
        break;
      case ModalEvent.CANCEL:
        this.store$.dispatch(ReturnToTest());
        break;
      default:
        break;
    }
  };
}
