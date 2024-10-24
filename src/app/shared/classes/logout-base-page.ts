import { Injector } from '@angular/core';
import { LogoutModal, LogoutModalEvent } from '@components/common/logout-modal/logout-modal';
import { ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';
import { select } from '@ngrx/store';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { getTests } from '@store/tests/tests.reducer';
import { getTestStatuses } from '@store/tests/tests.selector';
import { BasePageComponent } from './base-page';

export abstract class LogoutBasePageComponent extends BasePageComponent {
  protected modalController = this.injector.get(ModalController);
  protected accessibilityService = this.injector.get(AccessibilityService);

  protected constructor(injector: Injector) {
    super(injector);
  }

  async openLogoutModal() {
    let unsubmittedTestsCount = 0;
    this.store$
      .select(getTests)
      .pipe(select(getTestStatuses))
      .subscribe((tests) => {
        unsubmittedTestsCount = Object.values(tests).filter((key: TestStatus) => key === TestStatus.Submitted).length;
      });
    const modal: HTMLIonModalElement = await this.modalController.create({
      id: 'logOutModal',
      component: LogoutModal,
      componentProps: {
        unsubmittedCount: unsubmittedTestsCount,
      },
      cssClass: `${this.accessibilityService.getTextZoomClass()} mes-modal-alert`,
      backdropDismiss: false,
      showBackdrop: true,
    });
    await modal.present();
    const { data }: OverlayEventDetail = await modal.onDidDismiss<LogoutModalEvent>();
    console.log(data.event);
    if (data.event === LogoutModalEvent.LOGOUT) {
      await this.logout();
    }
  }
}
