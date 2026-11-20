import { computed, inject } from '@angular/core';
import { LogoutModal, LogoutModalEvent } from '@components/common/logout-modal/logout-modal';
import { ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';
import { select } from '@ngrx/store';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import {
  LogoutCancelled,
  LogoutConfirmed,
  LogoutModalChanged,
} from '@shared/classes/logout-base-page/logout-base-page.actions';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { getTests } from '@store/tests/tests.reducer';
import { getTestStatuses } from '@store/tests/tests.selector';
import { map, pairwise } from 'rxjs/operators';
import { BasePageComponent } from '../base-page';

const countUnuploadedTests = (statuses: ReturnType<typeof getTestStatuses>): number =>
  Object.values(statuses).filter((status) => status === TestStatus.Completed).length;

export abstract class LogoutBasePageComponent extends BasePageComponent {
  protected modalController = inject(ModalController);
  protected accessibilityService = inject(AccessibilityService);

  private readonly logoutTests = this.store$.selectSignal(getTests);
  private readonly unuploadedTestCount = computed(() => countUnuploadedTests(getTestStatuses(this.logoutTests())));

  protected constructor() {
    super();
  }

  async openLogoutModal() {
    const modal: HTMLIonModalElement = await this.modalController.create({
      id: 'logOutModal',
      component: LogoutModal,
      componentProps: {
        unuploadedTestCount: this.unuploadedTestCount,
      },
      cssClass: `${this.accessibilityService.getTextZoomClass()} mes-modal-alert`,
      backdropDismiss: false,
      showBackdrop: true,
    });
    const countChanges = this.store$
      .pipe(select(getTests), select(getTestStatuses), map(countUnuploadedTests), pairwise())
      .subscribe(([previous, count]) => {
        if (previous !== count) {
          this.store$.dispatch(LogoutModalChanged(count));
        }
      });
    let result: OverlayEventDetail<{ event: LogoutModalEvent }>;
    try {
      await modal.present();
      result = await modal.onDidDismiss<{ event: LogoutModalEvent }>();
    } finally {
      countChanges.unsubscribe();
    }

    if (result.data?.event === LogoutModalEvent.LOGOUT) {
      this.store$.dispatch(LogoutConfirmed(this.unuploadedTestCount()));
      await this.logout();
    } else {
      this.store$.dispatch(LogoutCancelled(this.unuploadedTestCount()));
    }
  }
}
