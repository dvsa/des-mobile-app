import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AlertController, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';

import { DateTime } from '../../shared/helpers/date-time';
import { DateTimeProvider } from '../../providers/date-time/date-time';
import { LogoutBasePageComponent } from '../../shared/classes/logout-base-page';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { StoreModel } from '../../../types/store.model';
import { selectEmployeeName, selectVersionNumber } from '../../../store/app-info/app-info.selectors';
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
  todaysDate: DateTime;
  todaysDateFormatted: string;

  constructor(
    public alertController: AlertController,
    private store$: Store<StoreModel>,
    private dateTimeProvider: DateTimeProvider,
    authenticationProvider: AuthenticationProvider,
    platform: Platform,
    router: Router,
  ) {
    super(platform, authenticationProvider, alertController, router);
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

  isLogoutEnabled = (): boolean => true; // this.authenticationProvider.logoutEnabled();

  goToLogin() {
    this.router.navigate([LOGIN_PAGE]);
  }

  onLogout() {
    this.openLogoutModal();
  }

}
