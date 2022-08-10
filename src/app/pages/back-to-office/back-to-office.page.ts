import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { Store, select } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { BackToOfficeViewDidEnter, DeferWriteUp } from '@pages/back-to-office/back-to-office.actions';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { merge, Observable, Subscription } from 'rxjs';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getRekeyIndicator } from '@store/tests/rekey/rekey.reducer';
import { isRekey } from '@store/tests/rekey/rekey.selector';
import { Router } from '@angular/router';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
// import { JOURNAL_PAGE, TestFlowPageNames } from '@pages/page-names.constants';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { map } from 'rxjs/operators';
import { trDestroy$ } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { wrtcDestroy$ } from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { DeviceProvider } from '@providers/device/device';

interface BackToOfficePageState {
  isRekey$: Observable<boolean>;
  testCategory$: Observable<CategoryCode>;
}

@Component({
  selector: '.back-to-office-page',
  templateUrl: 'back-to-office.page.html',
  styleUrls: ['back-to-office.page.scss'],
})
export class BackToOfficePage extends PracticeableBasePageComponent {
  pageState: BackToOfficePageState;
  testCategory: TestCategory;
  isRekey: boolean;
  merged$: Observable<string | boolean>;
  subscription: Subscription;
  singleAppModeEnabled: boolean;

  constructor(
    store$: Store<StoreModel>,
    public platform: Platform,
    public authenticationProvider: AuthenticationProvider,
    public screenOrientation: ScreenOrientation,
    public insomnia: Insomnia,
    public router: Router,
    public routeByCategoryProvider: RouteByCategoryProvider,
    public deviceProvider: DeviceProvider,
  ) {
    super(platform, authenticationProvider, router, store$);
  }

  async ngOnInit(): Promise<void> {
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

    this.singleAppModeEnabled = await this.deviceProvider.checkSingleAppMode();

    this.subscription = this.merged$.subscribe();
    this.destroyTestSubs();
  }

  async ionViewDidEnter(): Promise<void> {
    this.store$.dispatch(BackToOfficeViewDidEnter());

    if (super.isIos()) {
      this.screenOrientation.unlock();
      await this.insomnia.allowSleepAgain();
    }
  }

  ionViewDidLeave() {
    super.ionViewDidLeave();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async goToJournal(): Promise<void> {
    console.log('singleAppModeEnabled', this.singleAppModeEnabled);
    // if (this.isEndToEndPracticeMode) {
    //   await this.exitPracticeMode();
    //   return;
    // }
    // this.store$.dispatch(DeferWriteUp());
    // await this.router.navigate([JOURNAL_PAGE], { replaceUrl: true });
  }

  async goToOfficePage() {
    console.log('isStarted', this.isStarted);
    // await this.routeByCategoryProvider.navigateToPage(TestFlowPageNames.OFFICE_PAGE, this.testCategory);
  }

  private destroyTestSubs = (): void => {
    // At this point in a test, you can not go back at all in the journey - therefore shutdown any subscriptions
    // where takeUntil(wrtcDestroy$) or takeUntil(trDestroy$) has been piped onto.

    // Waiting room to car
    wrtcDestroy$.next();
    wrtcDestroy$.complete();
    // Test report
    trDestroy$.next();
    trDestroy$.complete();
  };
}
