import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { Store, select } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { BackToOfficeViewDidEnter, DeferWriteUp } from '@pages/back-to-office/back-to-office.actions';
import { DeviceProvider } from '@providers/device/device';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { merge, Observable, Subscription } from 'rxjs';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getRekeyIndicator } from '@store/tests/rekey/rekey.reducer';
import { isRekey } from '@store/tests/rekey/rekey.selector';
import { Router } from '@angular/router';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { JOURNAL_PAGE, TestFlowPageNames } from '@pages/page-names.constants';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { map } from 'rxjs/operators';

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

  constructor(
    store$: Store<StoreModel>,
    private deviceProvider: DeviceProvider,
    public platform: Platform,
    public authenticationProvider: AuthenticationProvider,
    public screenOrientation: ScreenOrientation,
    public insomnia: Insomnia,
    public router: Router,
    public routeByCategoryProvider: RouteByCategoryProvider,
  ) {
    super(platform, authenticationProvider, router, store$);
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
  }

  async ionViewDidEnter(): Promise<void> {
    if (super.isIos()) {
      this.screenOrientation.unlock();
      await this.insomnia.allowSleepAgain();

      if (!this.isEndToEndPracticeMode) {
        await this.deviceProvider.disableSingleAppMode();
      }
    }

    this.store$.dispatch(BackToOfficeViewDidEnter());
  }

  ionViewDidLeave() {
    super.ionViewDidLeave();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async goToJournal(): Promise<void> {
    if (this.isEndToEndPracticeMode) {
      await this.exitPracticeMode();
      return;
    }
    this.store$.dispatch(DeferWriteUp());
    await this.router.navigate([JOURNAL_PAGE], { replaceUrl: true });
  }

  async goToOfficePage() {
    await this.routeByCategoryProvider.navigateToPage(TestFlowPageNames.OFFICE_PAGE,
      this.testCategory);
  }
}
