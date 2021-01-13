import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AlertController, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';

import { selectEmployeeName, selectVersionNumber } from '../../../store/app-info/app-info.selectors';
import { ExaminerRole, ExaminerRoleDescription } from '../../providers/app-config/constants/examiner-role.constants';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { LogoutBasePageComponent } from '../../shared/classes/logout-base-page';
import { AppConfigProvider } from '../../providers/app-config/app-config';
import { DateTimeProvider } from '../../providers/date-time/date-time';
import { StoreModel } from '../../shared/models/store.model';
import { DateTime } from '../../shared/helpers/date-time';
import { LOGIN_PAGE } from '../page-names.constants';

interface DashboardPageState {
  appVersion$: Observable<string>;
  employeeName$: Observable<string>;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
})
export class DashboardPage extends LogoutBasePageComponent {

  pageState: DashboardPageState;
  todaysDateFormatted: string;
  employeeId: string;
  todaysDate: DateTime;
  role: string;

  constructor(
    protected alertController: AlertController,
    private appConfigProvider: AppConfigProvider,
    private store$: Store<StoreModel>,
    private dateTimeProvider: DateTimeProvider,
    authenticationProvider: AuthenticationProvider,
    platform: Platform,
    router: Router,
  ) {
    super(platform, authenticationProvider, alertController, router);
    this.employeeId = this.authenticationProvider.getEmployeeId() || 'NOT_KNOWN';
    this.role = ExaminerRoleDescription[this.appConfigProvider.getAppConfig().role] || 'Unknown Role';
    this.todaysDate = this.dateTimeProvider.now();
    this.todaysDateFormatted = this.dateTimeProvider.now().format('dddd Do MMMM YYYY');
  }

  ngOnInit() {
    this.pageState = {
      appVersion$: this.store$.select(selectVersionNumber),
      employeeName$: this.store$.select(selectEmployeeName),
    };
  }

  ionViewWillEnter(): boolean {
    this.todaysDate = this.dateTimeProvider.now();
    this.todaysDateFormatted = this.dateTimeProvider.now().format('dddd Do MMMM YYYY');

    return true;
  }

  goToLogin() {
    this.router.navigate([LOGIN_PAGE]);
  }

  onLogout() {
    this.openLogoutModal();
  }

  showTestReportPracticeMode = ():boolean => this.appConfigProvider.getAppConfig().journal.enableTestReportPracticeMode;

  showEndToEndPracticeMode = (): boolean => this.appConfigProvider.getAppConfig().journal.enableEndToEndPracticeMode;

  isLogoutEnabled = (): boolean => this.authenticationProvider.logoutEnabled();

  showDelegatedExaminerRekey = (): boolean => this.appConfigProvider.getAppConfig().role === ExaminerRole.DLG;
}
