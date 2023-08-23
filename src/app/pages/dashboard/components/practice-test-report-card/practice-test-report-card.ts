import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { PracticeTestModal } from '@pages/dashboard/components/practice-test-modal/practice-test-modal';
import { testReportPracticeModeSlot } from '@store/tests/__mocks__/tests.mock';
import { ModalEvent } from '@pages/dashboard/components/practice-test-modal/practice-test-modal.constants';
import { StartTestReportPracticeTest } from '@store/tests/tests.actions';
import {
  TellMeQuestionCorrect,
  TellMeQuestionDrivingFault,
} from '@store/tests/test-data/cat-b/vehicle-checks/vehicle-checks.actions';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';

@Component({
  selector: 'practice-test-report-card',
  templateUrl: 'practice-test-report-card.html',
  styleUrls: ['practice-test-report-card.scss'],
})
export class PracticeTestReportCardComponent {

  slotId: string = testReportPracticeModeSlot.slotDetail.slotId;

  constructor(
    private store$: Store<StoreModel>,
    private modalController: ModalController,
    public routeByCat: RouteByCategoryProvider,
  ) {
  }

  async showDrivingFaultModal(): Promise<void> {
    const modal: HTMLIonModalElement = await this.modalController.create({
      id: 'partialPracticeModeModal',
      component: PracticeTestModal,
      cssClass: 'mes-modal-alert text-zoom-regular',
      backdropDismiss: false,
      showBackdrop: true,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss<ModalEvent>();
    await this.onModalDismiss(data);
  }

  onModalDismiss = async (event: ModalEvent): Promise<void> => {
    switch (event) {
      case ModalEvent.FAULT:
        this.store$.dispatch(StartTestReportPracticeTest(this.slotId));
        this.store$.dispatch(TellMeQuestionDrivingFault());
        await this.routeByCat.navigateToPage(TestFlowPageNames.TEST_REPORT_PAGE, TestCategory.B);
        break;
      case ModalEvent.NO_FAULT:
        this.store$.dispatch(StartTestReportPracticeTest(this.slotId));
        this.store$.dispatch(TellMeQuestionCorrect());
        await this.routeByCat.navigateToPage(TestFlowPageNames.TEST_REPORT_PAGE, TestCategory.B);
        break;
      case ModalEvent.CANCEL:
        break;
      default:
    }
  };

}
