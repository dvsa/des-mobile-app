import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AlertController, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';

import { selectEmployeeName, selectVersionNumber, selectEmployeeId } from '../../../store/app-info/app-info.selectors';
import { selectRole } from '../../../store/app-config/app-config.selectors';
import { ExaminerRole, ExaminerRoleDescription } from '../../providers/app-config/constants/examiner-role.constants';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { AppConfigProvider } from '../../providers/app-config/app-config';
import { DateTimeProvider } from '../../providers/date-time/date-time';
import { StoreModel } from '../../shared/models/store.model';
import { DateTime } from '../../shared/helpers/date-time';
import { BasePageComponent } from '../../shared/classes/base-page';
import { AppConfig } from '../../providers/app-config/app-config.model';

interface DashboardPageState {
  appVersion$: Observable<string>;
  employeeName$: Observable<string>;
  employeeId$: Observable<string>;
  role$: Observable<string>;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
})
export class DashboardPage extends BasePageComponent {

  pageState: DashboardPageState;
  todaysDateFormatted: string;
  // employeeId: string;
  todaysDate: DateTime;
  // role: string;

  constructor(
    protected alertController: AlertController,
    private appConfigProvider: AppConfigProvider,
    private store$: Store<StoreModel>,
    private dateTimeProvider: DateTimeProvider,
    authenticationProvider: AuthenticationProvider,
    platform: Platform,
    router: Router,
  ) {
    super(platform, authenticationProvider, router);
    // this.employeeId = this.authenticationProvider.getEmployeeId() || 'NOT_KNOWN';
    // this.role = ExaminerRoleDescription[this.appConfigProvider.getAppConfig().role] || 'Unknown Role';
    this.todaysDate = this.dateTimeProvider.now();
    this.todaysDateFormatted = this.dateTimeProvider.now().format('dddd Do MMMM YYYY');
  }

  ngOnInit() {
    this.pageState = {

      appVersion$: this.store$.select(selectVersionNumber),
      employeeName$: this.store$.select(selectEmployeeName),
      employeeId$: this.store$.select(selectEmployeeId),
      role$: this.store$.select(selectRole)
    };
  }

  ionViewWillEnter(): boolean {
    super.ionViewWillEnter();
    this.todaysDate = this.dateTimeProvider.now();
    this.todaysDateFormatted = this.dateTimeProvider.now().format('dddd Do MMMM YYYY');

    return true;
  }

  showTestReportPracticeMode = ():boolean => this.appConfigProvider.getAppConfig().journal.enableTestReportPracticeMode;

  showEndToEndPracticeMode = (): boolean => this.appConfigProvider.getAppConfig().journal.enableEndToEndPracticeMode;

  showDelegatedExaminerRekey = (): boolean => this.appConfigProvider.getAppConfig().role === ExaminerRole.DLG;
}
