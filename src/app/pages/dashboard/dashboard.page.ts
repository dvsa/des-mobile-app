import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AlertController, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { selectEmployeeName, selectVersionNumber, selectEmployeeId } from '../../../store/app-info/app-info.selectors';
import { selectRole } from '../../../store/app-config/app-config.selectors';
import { ExaminerRole, ExaminerRoleDescription } from '../../providers/app-config/constants/examiner-role.constants';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { AppConfigProvider } from '../../providers/app-config/app-config';
import { DateTimeProvider } from '../../providers/date-time/date-time';
import { StoreModel } from '../../shared/models/store.model';
import { DateTime } from '../../shared/helpers/date-time';
import { BasePageComponent } from '../../shared/classes/base-page';
import { NetworkStateProvider } from '../../providers/network-state/network-state';

interface DashboardPageState {
  appVersion$: Observable<string>;
  employeeName$: Observable<string>;
  employeeId$: Observable<string>;
  role$: Observable<string>;
  isOffline$: Observable<boolean>;
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
    };
  }

  ionViewWillEnter(): boolean {
    super.ionViewWillEnter();
    this.todaysDate = this.dateTimeProvider.now();
    this.todaysDateFormatted = this.dateTimeProvider.now().format('dddd Do MMMM YYYY');
    return true;
  }

  getRoleDisplayValue(role: string): string {
    return ExaminerRoleDescription[role] || 'Unknown Role';
  }

  getEmployeeNumberDisplayValue(employeeNumber: string): string {
    return employeeNumber || 'NOT_KNOWN';
  }

  showTestReportPracticeMode = (): boolean =>
    this.appConfigProvider.getAppConfig().journal.enableTestReportPracticeMode;

  showEndToEndPracticeMode = (): boolean =>
    this.appConfigProvider.getAppConfig().journal.enableEndToEndPracticeMode;

  showDelegatedExaminerRekey = (): boolean =>
    this.appConfigProvider.getAppConfig().role === ExaminerRole.DLG;
}
