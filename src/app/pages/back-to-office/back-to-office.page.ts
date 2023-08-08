import { Component, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ScreenOrientation } from '@capawesome/capacitor-screen-orientation';

import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import {
  ASAMPopupPresented,
  BackToOfficeViewDidEnter,
  ClearVehicleData,
  DeferWriteUp,
} from '@pages/back-to-office/back-to-office.actions';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { selectRekey } from '@store/tests/rekey/rekey.reducer';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { JOURNAL_PAGE, TestFlowPageNames } from '@pages/page-names.constants';
import { selectTestCategory } from '@store/tests/category/category.reducer';
import { trDestroy$ } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { wrtcDestroy$ } from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { DeviceProvider } from '@providers/device/device';
import {
  AsamFailureNotificationModal,
} from '@pages/back-to-office/components/asam-failure-notification/asam-failure-notification-modal';

export enum NavigationTarget {
  OFFICE = 'office',
  JOURNAL = 'journal',
}

@Component({
  selector: '.back-to-office-page',
  templateUrl: 'back-to-office.page.html',
  styleUrls: ['back-to-office.page.scss'],
})
export class BackToOfficePage extends PracticeableBasePageComponent {
  testCategory = this.store$.selectSignal(selectTestCategory)();
  isRekey = this.store$.selectSignal(selectRekey)();
  singleAppModeEnabled: boolean;
  office: string = NavigationTarget.OFFICE;
  journal: string = NavigationTarget.JOURNAL;

  private insomnia = inject(Insomnia);
  public routeByCategoryProvider = inject(RouteByCategoryProvider);
  public deviceProvider = inject(DeviceProvider);
  public modalController = inject(ModalController);

  constructor() {
    super(false);
  }

  async ngOnInit(): Promise<void> {
    this.singleAppModeEnabled = super.isIos() ? await this.deviceProvider.isSAMEnabled() : false;
    this.destroyTestSubs();
  }

  async ionViewDidEnter(): Promise<void> {
    this.store$.dispatch(BackToOfficeViewDidEnter());
    this.store$.dispatch(ClearVehicleData());

    if (super.isIos()) {
      await ScreenOrientation.unlock();
      await this.insomnia.allowSleepAgain();
    }
  }

  async navigateForward(navigationTarget: string): Promise<void> {
    if (!this.singleAppModeEnabled && !this.isPracticeMode) {
      const asamModal = await this.modalController.create({
        id: 'AsamFailureNotificationModal',
        component: AsamFailureNotificationModal,
        cssClass: 'mes-modal-alert text-zoom-regular',
        backdropDismiss: false,
        showBackdrop: true,
      });

      this.store$.dispatch(ASAMPopupPresented());
      await asamModal.present();
      await asamModal.onDidDismiss();
      await this.onContinue(navigationTarget);
    } else {
      await this.onContinue(navigationTarget);
    }
  }

  async onContinue(navigationTarget: string): Promise<void> {
    switch (navigationTarget) {
      case NavigationTarget.OFFICE:
        await this.goToOfficePage();
        break;
      case NavigationTarget.JOURNAL:
        await this.goToJournal();
        break;
      default:
        break;
    }
  }

  async goToJournal(): Promise<void> {
    if (this.isEndToEndPracticeMode) {
      await this.exitPracticeMode();
      return;
    }
    this.store$.dispatch(DeferWriteUp());
    await this.routeByCategoryProvider.navigateToPage(JOURNAL_PAGE, null, { replaceUrl: true });
  }

  async goToOfficePage() {
    await this.routeByCategoryProvider.navigateToPage(
      TestFlowPageNames.OFFICE_PAGE,
      this.testCategory as TestCategory,
    );
  }

  private destroyTestSubs = (): void => {
    // At this point in a test, you can not go back at all in the journey - therefore shutdown any subscriptions
    // where takeUntil(wrtcDestroy$) or takeUntil(trDestroy$) has been piped onto.

    // Waiting room to car
    wrtcDestroy$.next(null);
    wrtcDestroy$.complete();
    // Test report
    trDestroy$.next(null);
    trDestroy$.complete();
  };
}
