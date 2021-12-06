import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { SetActivityCode } from '@store/tests/activity-code/activity-code.actions';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
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
    public router: Router,
    public routerByCategory: RouteByCategoryProvider,
    private store$: Store<StoreModel>,
  ) {
  }

  openEndTestModal = async (): Promise<void> => {
    this.terminateTestModal = await this.modalController.create({
      id: 'TerminateTestModal',
      component: TerminateTestModal,
      backdropDismiss: false,
      showBackdrop: true,
      componentProps: {
        onCancel: this.onCancel,
        onTerminate: this.onTerminate,
        shouldAuthenticate: this.shouldAuthenticate,
      },
      cssClass: 'mes-modal-alert text-zoom-regular',
    });
    await this.terminateTestModal.present();
  };

  onCancel = async (): Promise<void> => {
    await this.terminateTestModal.dismiss();
  };

  onTerminate = async (): Promise<void> => {
    await this.terminateTestModal.dismiss();

    if (this.isDelegated) {
      await this.routerByCategory.navigateToPage(TestFlowPageNames.OFFICE_PAGE, this.category as TestCategory);
      return;
    }
    this.store$.dispatch(SetActivityCode(null));
    await this.router.navigate([TestFlowPageNames.DEBRIEF_PAGE]);
  };

}
