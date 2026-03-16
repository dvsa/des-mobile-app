import { Component, OnInit } from '@angular/core';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ModalController, ViewDidEnter, ViewDidLeave } from '@ionic/angular';

import {
  ASAMPopupPresented,
  BackToOfficeViewDidEnter,
  ClearVehicleData,
  DeferWriteUp,
} from '@pages/back-to-office/back-to-office.actions';
import { AsamFailureNotificationModal } from '@pages/back-to-office/components/asam-failure-notification/asam-failure-notification-modal';
import { JOURNAL_PAGE, TestFlowPageNames } from '@pages/page-names.constants';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import { trDestroy$ } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { wrtcDestroy$ } from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { selectTestCategory } from '@store/tests/category/category.reducer';

export enum NavigationTarget {
  OFFICE = 'office',
  JOURNAL = 'journal',
}

@Component({
  selector: '.back-to-office-page',
  templateUrl: 'back-to-office.page.html',
  styleUrls: ['back-to-office.page.scss'],
  standalone: false,
})
export class BackToOfficePage extends PracticeableBasePageComponent implements OnInit, ViewDidEnter, ViewDidLeave {
  testCategory = this.store$.selectSignal(selectTestCategory)() as TestCategory;
  singleAppModeEnabled: boolean;
  office: string = NavigationTarget.OFFICE;
  journal: string = NavigationTarget.JOURNAL;
  displayExitPracticeMode = false;

  constructor(
    public routeByCategoryProvider: RouteByCategoryProvider,
    public modalController: ModalController
  ) {
    super(false);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.destroyTestSubs();
  }

  async ionViewDidEnter(): Promise<void> {
    this.store$.dispatch(BackToOfficeViewDidEnter());
    this.store$.dispatch(ClearVehicleData());

    this.singleAppModeEnabled = super.isIos() ? await this.deviceProvider.isSAMEnabled() : false;

    await super.unlockDevice();
  }

  /**
   * If single app mode is disabled display error message.
   * @param navigationTarget
   */
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

  /**
   * Select appropriate function based upon navigation target
   * @param navigationTarget
   */
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
    await this.routeByCategoryProvider.navigateToPage(TestFlowPageNames.OFFICE_PAGE, this.testCategory);
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

  /**
   * Opens the exit practice mode row
   */
  onEndPracticeModeClicked() {
    this.displayExitPracticeMode = true;
  }

  /**
   * Closes the exit practice mode row
   */
  closeExitPracticeMode() {
    this.displayExitPracticeMode = false;
  }
}
