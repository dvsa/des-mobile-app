import { Component, Injector, OnInit } from '@angular/core';
import { ModalController, ViewDidEnter, ViewDidLeave } from '@ionic/angular';
import { select } from '@ngrx/store';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ScreenOrientation } from '@capawesome/capacitor-screen-orientation';
import { map } from 'rxjs/operators';
import { merge, Observable, Subscription } from 'rxjs';

import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import {
  ASAMPopupPresented,
  BackToOfficeViewDidEnter,
  ClearVehicleData,
  DeferWriteUp,
} from '@pages/back-to-office/back-to-office.actions';
import { KeepAwake as Insomnia } from '@capacitor-community/keep-awake';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getRekeyIndicator } from '@store/tests/rekey/rekey.reducer';
import { isRekey } from '@store/tests/rekey/rekey.selector';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { JOURNAL_PAGE, TestFlowPageNames } from '@pages/page-names.constants';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { trDestroy$ } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { wrtcDestroy$ } from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { DeviceProvider } from '@providers/device/device';
import {
  AsamFailureNotificationModal,
} from '@pages/back-to-office/components/asam-failure-notification/asam-failure-notification-modal';

interface BackToOfficePageState {
  isRekey$: Observable<boolean>;
  testCategory$: Observable<CategoryCode>;
}

export enum NavigationTarget {
  OFFICE = 'office',
  JOURNAL = 'journal',
}

@Component({
  selector: '.back-to-office-page',
  templateUrl: 'back-to-office.page.html',
  styleUrls: ['back-to-office.page.scss'],
})
export class BackToOfficePage
  extends PracticeableBasePageComponent
  implements OnInit, ViewDidEnter, ViewDidLeave {

  pageState: BackToOfficePageState;
  testCategory: TestCategory;
  isRekey: boolean;
  merged$: Observable<string | boolean>;
  subscription: Subscription;
  singleAppModeEnabled: boolean;
  office: string = NavigationTarget.OFFICE;
  journal: string = NavigationTarget.JOURNAL;

  constructor(
    public routeByCategoryProvider: RouteByCategoryProvider,
    public deviceProvider: DeviceProvider,
    public modalController: ModalController,
    injector: Injector,
  ) {
    super(injector, false);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.pageState = {
      isRekey$: this.store$.pipe(
        select(getTests),
        select(getCurrentTest),
        select(getRekeyIndicator),
        select(isRekey),
      ),
      testCategory$: this.store$.pipe(
        select(getTests),
        select(getCurrentTest),
        select(getTestCategory),
      ),
    };

    const {
      testCategory$,
      isRekey$,
    } = this.pageState;

    this.merged$ = merge(
      testCategory$.pipe(map((value) => this.testCategory = (value as TestCategory))),
      isRekey$.pipe(map((value) => this.isRekey = value)),
    );

    this.subscription = this.merged$.subscribe();
    this.destroyTestSubs();
  }

  async ionViewDidEnter(): Promise<void> {
    this.store$.dispatch(BackToOfficeViewDidEnter());
    this.store$.dispatch(ClearVehicleData());

    this.singleAppModeEnabled = (super.isIos())
      ? await this.deviceProvider.isSAMEnabled()
      : false;

    if (super.isIos()) {
      await ScreenOrientation.unlock();
      await Insomnia.allowSleep();
    }
  }

  ionViewDidLeave() {
    super.ionViewDidLeave();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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
}
