import { Component, Input } from '@angular/core';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import {
  CAT_A_MOD1,
  CAT_A_MOD2,
  CAT_ADI_PART2,
  CAT_B,
  CAT_BE,
  CAT_C,
  CAT_CPC,
  CAT_D,
  CAT_HOME_TEST,
} from '@pages/page-names.constants';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { TerminateTestModal } from '@components/common/terminate-test-modal/terminate-test-modal';

@Component({
  selector: 'end-test-link',
  templateUrl: './end-test-link.html',
  styleUrls: ['./end-test-link.scss'],
})
export class EndTestLinkComponent {

  terminateTestModal: HTMLIonModalElement;

  @Input()
  category: string;

  @Input()
  shouldAuthenticate: boolean = true;

  @Input()
  isDelegated: boolean = false;

  constructor(
    public modalController: ModalController,
    public router: Router) {
  }

  async openEndTestModal() {
    this.terminateTestModal = await this.modalController.create({
      component: TerminateTestModal,
      componentProps: {
        onCancel: this.onCancel,
        onTerminate: this.onTerminate,
        shouldAuthenticate: this.shouldAuthenticate,
      },
      cssClass: 'mes-modal-alert text-zoom-regular',
    });
    await this.terminateTestModal.present();
  }

  onCancel = () => {
    this.terminateTestModal.dismiss();
  };

  onTerminate = () => {
    this.terminateTestModal.dismiss();
    if (this.isDelegated) {
      this.navigateToOfficePage();
      return;
    }
    switch (this.category) {
      case TestCategory.ADI2:
        this.router.navigate([CAT_ADI_PART2.DEBRIEF_PAGE]);
        break;
      case TestCategory.B:
        this.router.navigate([CAT_B.DEBRIEF_PAGE]);
        break;
      case TestCategory.BE:
        this.router.navigate([CAT_BE.DEBRIEF_PAGE]);
        break;
      case TestCategory.C:
      case TestCategory.C1:
      case TestCategory.CE:
      case TestCategory.C1E:
        this.router.navigate([CAT_C.DEBRIEF_PAGE]);
        break;
      case TestCategory.CCPC:
      case TestCategory.DCPC:
        this.router.navigate([CAT_CPC.DEBRIEF_PAGE]);
        break;
      case TestCategory.D:
      case TestCategory.D1:
      case TestCategory.DE:
      case TestCategory.D1E:
        this.router.navigate([CAT_D.DEBRIEF_PAGE]);
        break;
      case TestCategory.F:
      case TestCategory.G:
      case TestCategory.H:
      case TestCategory.K:
        this.router.navigate([CAT_HOME_TEST.DEBRIEF_PAGE]);
        break;
      case TestCategory.EUA1M1:
      case TestCategory.EUA2M1:
      case TestCategory.EUAM1:
      case TestCategory.EUAMM1:
        this.router.navigate([CAT_A_MOD1.DEBRIEF_PAGE]);
        break;
      case TestCategory.EUA1M2:
      case TestCategory.EUA2M2:
      case TestCategory.EUAM2:
      case TestCategory.EUAMM2:
        this.router.navigate([CAT_A_MOD2.DEBRIEF_PAGE]);
        break;
      default:
        break;
    }
  };

  navigateToOfficePage = () => {
    switch (this.category) {
      case TestCategory.BE:
        this.router.navigate([CAT_BE.OFFICE_PAGE]);
        break;
      case TestCategory.C:
      case TestCategory.C1:
      case TestCategory.CE:
      case TestCategory.C1E:
        this.router.navigate([CAT_C.OFFICE_PAGE]);
        break;
      case TestCategory.CCPC:
      case TestCategory.DCPC:
        this.router.navigate([CAT_CPC.OFFICE_PAGE]);
        break;
      case TestCategory.D:
      case TestCategory.D1:
      case TestCategory.DE:
      case TestCategory.D1E:
        this.router.navigate([CAT_D.OFFICE_PAGE]);
        break;
      default:
        break;
    }
  };

}
