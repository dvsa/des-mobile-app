import { Component, OnInit } from '@angular/core';
import {
  ModalController, NavController, Platform, ToastController,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { WeatherConditionProvider } from '@providers/weather-conditions/weather-condition';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { getActivityCodeOptions } from '@shared/constants/activity-code/activity-code.constants';
import { ExaminerRole } from '@providers/app-config/constants/examiner-role.constants';
import {
  CommonOfficePageState,
  OfficeBasePageComponent,
} from '@shared/classes/test-flow-base-pages/office/office-base-page';
import { DeviceProvider } from '@providers/device/device';
import { behaviourMap } from '@pages/office/office-behaviour-map.cat-adi-part3';
import { Observable } from 'rxjs';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getTestData } from '@store/tests/test-data/cat-adi-part3/test-data.cat-adi-part3.reducer';
import { getReview } from '@store/tests/test-data/cat-adi-part3/review/review.reducer';
import { getGrade } from '@store/tests/test-data/cat-adi-part3/review/review.selector';

interface CatADI3OfficePageState {
  testOutcomeGrade$: Observable<string>;
}

type OfficePageState = CommonOfficePageState & CatADI3OfficePageState;

@Component({
  selector: 'app-office-cat-adi-part3',
  templateUrl: './office.cat-adi-part3.page.html',
  styleUrls: ['../../office/office.page.scss'],
})
export class OfficeCatADI3Page extends OfficeBasePageComponent implements OnInit {
  pageState: OfficePageState;

  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    navController: NavController,
    toastController: ToastController,
    modalController: ModalController,
    outcomeBehaviourProvider: OutcomeBehaviourMapProvider,
    weatherConditionProvider: WeatherConditionProvider,
    faultSummaryProvider: FaultSummaryProvider,
    faultCountProvider: FaultCountProvider,
    private appConfig: AppConfigProvider,
    public deviceProvider: DeviceProvider,
  ) {
    super(
      platform,
      authenticationProvider,
      router,
      store$,
      navController,
      toastController,
      modalController,
      outcomeBehaviourProvider,
      weatherConditionProvider,
      faultSummaryProvider,
      faultCountProvider,
    );
    this.outcomeBehaviourProvider.setBehaviourMap(behaviourMap);
    this.activityCodeOptions = getActivityCodeOptions(
      this.appConfig.getAppConfig().role === ExaminerRole.DLG,
    );
  }

  ngOnInit(): void {
    super.onInitialisation();

    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    this.pageState = {
      ...this.commonPageState,
      testOutcomeGrade$: currentTest$.pipe(
        select(getTestData),
        select(getReview),
        select(getGrade),
      ),
    };

    super.setupSubscriptions();
  }

  async ionViewWillEnter() {
    super.ionViewWillEnter();

    if (!this.isPracticeMode && super.isIos()) {
      await this.deviceProvider.disableSingleAppMode();
    }
  }

}
