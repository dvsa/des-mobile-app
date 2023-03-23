import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AlertController, Platform } from '@ionic/angular';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';

import { CompletedTestPersistenceProvider } from '@providers/completed-test-persistence/completed-test-persistence';
import { ExaminerRole, ExaminerRoleDescription } from '@providers/app-config/constants/examiner-role.constants';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { DeviceProvider } from '@providers/device/device';
import { StoreModel } from '@shared/models/store.model';
import { DateTime } from '@shared/helpers/date-time';
import { BasePageComponent } from '@shared/classes/base-page';
import { selectRole } from '@store/app-config/app-config.selectors';
import { selectEmployeeName, selectVersionNumber, selectEmployeeId } from '@store/app-info/app-info.selectors';
import * as journalActions from '@store/journal/journal.actions';
import { ClearCandidateLicenceData } from '@pages/candidate-licence/candidate-licence.actions';
import { RekeySearchClearState } from '@pages/rekey-search/rekey-search.actions';
import { ClearVehicleData } from '@pages/back-to-office/back-to-office.actions';
import { SlotProvider } from '@providers/slot/slot';
import { unsubmittedTestSlotsCount$ } from '@pages/unuploaded-tests/unuploaded-tests.selector';
import { sumFlatArray } from '@shared/helpers/sum-number-array';
import { DashboardViewDidEnter, PracticeTestReportCard } from './dashboard.actions';

interface DashboardPageState {
  appVersion$: Observable<string>;
  employeeName$: Observable<string>;
  employeeId$: Observable<string>;
  role$: Observable<string>;
  isOffline$: Observable<boolean>;
  notificationCount$: Observable<number>;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
})
export class DashboardPage extends BasePageComponent {

  pageState: DashboardPageState;
  todaysDateFormatted: string;
  todaysDate: DateTime;

  constructor(
    protected alertController: AlertController,
    private appConfigProvider: AppConfigProvider,
    private store$: Store<StoreModel>,
    private dateTimeProvider: DateTimeProvider,
    private networkStateProvider: NetworkStateProvider,
    private screenOrientation: ScreenOrientation,
    private insomnia: Insomnia,
    public deviceProvider: DeviceProvider,
    private completedTestPersistenceProvider: CompletedTestPersistenceProvider,
    private slotProvider: SlotProvider,
    authenticationProvider: AuthenticationProvider,
    platform: Platform,
    router: Router,
  ) {
    super(platform, authenticationProvider, router);
    this.todaysDate = this.dateTimeProvider.now();
    this.todaysDateFormatted = this.dateTimeProvider.now().format('dddd Do MMMM YYYY');
  }

  ngOnInit() {
    this.pageState = {
      appVersion$: this.store$.select(selectVersionNumber),
      employeeName$: this.store$.select(selectEmployeeName),
      employeeId$: this.store$.select(selectEmployeeId).pipe(map(this.getEmployeeNumberDisplayValue)),
      role$: this.store$.select(selectRole).pipe(map(this.getRoleDisplayValue)),
      isOffline$: this.networkStateProvider.isOffline$,
      notificationCount$: combineLatest([
        unsubmittedTestSlotsCount$(this.store$, this.dateTimeProvider, this.slotProvider),
      ]).pipe(map(sumFlatArray)), /* Sum all individual counts to determine, overall count */
    };
  }

  async ionViewDidEnter(): Promise<void> {
    this.store$.dispatch(DashboardViewDidEnter());
    this.store$.dispatch(ClearCandidateLicenceData());
    this.store$.dispatch(ClearVehicleData());

    if (super.isIos()) {
      this.screenOrientation.unlock();
      await this.insomnia.allowSleepAgain();
      await this.deviceProvider.disableSingleAppMode();
    }
    this.store$.dispatch(journalActions.LoadJournalSilent());
  }

  async ionViewWillEnter(): Promise<boolean> {
    super.ionViewWillEnter();
    this.todaysDate = this.dateTimeProvider.now();
    this.todaysDateFormatted = this.dateTimeProvider.now().format('dddd Do MMMM YYYY');
    await this.completedTestPersistenceProvider.loadCompletedPersistedTests();
    return true;
  }

  ionViewDidLeave() {
    this.store$.dispatch(RekeySearchClearState());
  }

  showTestReportPracticeMode = (): boolean =>
    this.appConfigProvider.getAppConfig().journal.enableTestReportPracticeMode;

  showEndToEndPracticeMode = (): boolean =>
    this.appConfigProvider.getAppConfig().journal.enableEndToEndPracticeMode;

  showDelegatedExaminerRekey = (): boolean =>
    this.appConfigProvider.getAppConfig().role === ExaminerRole.DLG;

  getRoleDisplayValue = (role: string): string => ExaminerRoleDescription[role] || 'Unknown Role';

  getEmployeeNumberDisplayValue = (employeeNumber: string): string => employeeNumber || 'NOT_KNOWN';

  practiceTestReportCardClicked = (): void => {
    this.store$.dispatch(PracticeTestReportCard());
  };
}
